import { differenceInCalendarDays, parseISO } from 'date-fns';

import { getAllWorkouts, getWorkoutsByCategory } from '@/data/workout-library';
import {
  PHASE_AVOID_VARIANTS,
  PHASE_PREFERRED_VARIANTS,
} from '@/constants/template-phase-selection';
import {
  beginnerRunnerRunVariant,
  beginnerRunnerSelectionBonus,
  filterBeginnerRunningCandidates,
} from '@/lib/coaching-engine/beginner-runner-protection';
import {
  buildRacePrepSimulationPool,
  preferRacePrepSimulationCandidates,
  simulationTemplateBonus,
} from '@/lib/coaching-engine/hyrox-simulation-exposure';
import {
  preferProactiveRecoveryCandidates,
  recoveryTemplateBonus,
} from '@/lib/coaching-engine/recovery-insertion';
import {
  isAdvancedRunner,
  isAdvancedStrength,
  isBeginnerRunner,
} from '@/lib/profile-levels';
import { scoreWorkout, templateEquipmentMatches } from '@/lib/workout-scoring';
import type { WeekPhase } from '@/lib/recovery-prescription';
import { strengthLowerVariant } from '@/lib/coaching-engine/slot-resolve';
import type { OnboardingProfile, FitnessLevel } from '@/types';
import type { WorkoutCategory, WorkoutDifficulty, WorkoutTemplate } from '@/types/workout';

import {
  buildRecentStationMap,
  stationRotationBonus,
  type HyroxStationType,
} from './station-rotation';

export const TEMPLATE_REPEAT_WINDOW_DAYS = 14;

export interface TemplateUsage {
  templateId: string;
  date: string;
}

export interface TemplateSelectContext {
  weekIndex: number;
  dayIndex: number;
  phase: WeekPhase;
  /** Scheduled session date (yyyy-MM-dd) — used for repeat prevention. */
  sessionDate: string;
  /** Templates already placed on the plan (grows as the calendar is built). */
  recentTemplateUsage: TemplateUsage[];
}

function matchesDifficulty(template: WorkoutTemplate, profile: OnboardingProfile): boolean {
  const level: FitnessLevel = profile.fitnessLevel;
  if (level === 'beginner') return template.difficulty !== 'advanced';
  if (level === 'advanced') return true;
  return template.difficulty !== 'advanced';
}

function resolveStrengthLowerVariant(
  variant: string | undefined,
  profile: OnboardingProfile,
  ctx: TemplateSelectContext
): string {
  if (variant === 'performance') return 'standard';
  if (variant === 'maintenance' || variant === 'heavy' || variant === 'standard') {
    return variant;
  }
  return strengthLowerVariant(profile, ctx.phase);
}

function resolveRunVariantHint(
  variant: string | undefined,
  profile: OnboardingProfile,
  ctx: TemplateSelectContext
): string | undefined {
  const beginner = isBeginnerRunner(profile);
  if (beginner) {
    return beginnerRunnerRunVariant(variant, variant === 'long', ctx.weekIndex);
  }
  if (variant) return variant;
  if (ctx.phase === 'taper') return 'easy';
  if (ctx.phase === 'peak') return 'tempo';
  return 'tempo';
}

function variantAlignmentBonus(
  template: WorkoutTemplate,
  phase: WeekPhase,
  variantHint?: string
): number {
  let bonus = 0;
  const preferred = PHASE_PREFERRED_VARIANTS[phase][template.category] ?? [];
  const avoid = PHASE_AVOID_VARIANTS[phase][template.category] ?? [];

  if (variantHint && template.variant === variantHint) bonus += 10;
  if (template.variant && preferred.includes(template.variant)) bonus += 5;
  if (template.variant && avoid.includes(template.variant)) bonus -= 6;

  return bonus;
}

export function wasTemplateUsedWithinDays(
  templateId: string,
  sessionDate: string,
  usage: TemplateUsage[],
  windowDays: number = TEMPLATE_REPEAT_WINDOW_DAYS
): boolean {
  const session = parseISO(sessionDate);
  return usage.some((entry) => {
    if (entry.templateId !== templateId) return false;
    const usedOn = parseISO(entry.date);
    const daysAgo = differenceInCalendarDays(session, usedOn);
    return daysAgo >= 0 && daysAgo < windowDays;
  });
}

/** True when this template was used on the same weekday 7–13 days earlier. */
export function wasTemplateUsedOnSameWeekdayPreviousWeek(
  templateId: string,
  sessionDate: string,
  usage: TemplateUsage[]
): boolean {
  const session = parseISO(sessionDate);
  const weekday = session.getDay();
  return usage.some((entry) => {
    if (entry.templateId !== templateId) return false;
    const usedOn = parseISO(entry.date);
    if (usedOn.getDay() !== weekday) return false;
    const daysAgo = differenceInCalendarDays(session, usedOn);
    return daysAgo >= 7 && daysAgo < 14;
  });
}

function excludeSameWeekdayRepeats(
  candidates: WorkoutTemplate[],
  ctx: TemplateSelectContext
): WorkoutTemplate[] {
  const filtered = candidates.filter(
    (t) =>
      !wasTemplateUsedOnSameWeekdayPreviousWeek(
        t.id,
        ctx.sessionDate,
        ctx.recentTemplateUsage
      )
  );
  return filtered.length > 0 ? filtered : candidates;
}

function excludeRecentRepeats(
  candidates: WorkoutTemplate[],
  ctx: TemplateSelectContext
): WorkoutTemplate[] {
  const filtered = candidates.filter(
    (t) => !wasTemplateUsedWithinDays(t.id, ctx.sessionDate, ctx.recentTemplateUsage)
  );
  return filtered.length > 0 ? filtered : candidates;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return hash;
}

function seededTiebreak(idA: string, idB: string, sessionDate: string): number {
  const seed = sessionDate.replace(/-/g, '');
  const hashA = simpleHash(idA + seed);
  const hashB = simpleHash(idB + seed);
  return hashA - hashB;
}

function buildCandidatePool(
  category: WorkoutCategory,
  profile: OnboardingProfile
): WorkoutTemplate[] {
  const pool = getWorkoutsByCategory(category);
  if (pool.length === 0) {
    throw new Error(`WORKOUT_LIBRARY has no templates for category: ${category}`);
  }

  let candidates = pool.filter(
    (t) => templateEquipmentMatches(t, profile) && matchesDifficulty(t, profile)
  );
  if (candidates.length === 0) {
    candidates = pool.filter((t) => templateEquipmentMatches(t, profile));
  }

  return candidates;
}

function rankCandidates(
  candidates: WorkoutTemplate[],
  profile: OnboardingProfile,
  ctx: TemplateSelectContext,
  variantHint?: string,
  recentStations?: Map<HyroxStationType, number>
): WorkoutTemplate[] {
  const beginner = isBeginnerRunner(profile);
  const simBonus = (t: WorkoutTemplate) =>
    variantHint === 'simulation' ? simulationTemplateBonus(t, ctx.weekIndex, ctx.phase) : 0;
  const recoveryBonus = (t: WorkoutTemplate) =>
    t.category === 'recovery' ? recoveryTemplateBonus(t, ctx.weekIndex) : 0;
  const rotationBonus = (t: WorkoutTemplate) =>
    recentStations ? stationRotationBonus(t, recentStations) : 0;

  return [...candidates].sort((a, b) => {
    const scoreA =
      scoreWorkout(a, profile, ctx.phase) +
      variantAlignmentBonus(a, ctx.phase, variantHint) +
      (beginner ? beginnerRunnerSelectionBonus(a, ctx.weekIndex) : 0) +
      simBonus(a) +
      recoveryBonus(a) +
      rotationBonus(a);
    const scoreB =
      scoreWorkout(b, profile, ctx.phase) +
      variantAlignmentBonus(b, ctx.phase, variantHint) +
      (beginner ? beginnerRunnerSelectionBonus(b, ctx.weekIndex) : 0) +
      simBonus(b) +
      recoveryBonus(b) +
      rotationBonus(b);
    if (scoreB !== scoreA) return scoreB - scoreA;
    return seededTiebreak(a.id, b.id, ctx.sessionDate);
  });
}

/**
 * Selects the best-fitting template from WORKOUT_LIBRARY for a resolved slot.
 * Uses scoreWorkout(), equipment filtering, and 14-day repeat prevention.
 */
export function selectWorkoutTemplate(
  category: WorkoutCategory,
  variant: string | undefined,
  profile: OnboardingProfile,
  ctx: TemplateSelectContext
): WorkoutTemplate {
  let variantHint = variant;

  if (category === 'running') {
    variantHint = resolveRunVariantHint(variant, profile, ctx);
  }
  if (category === 'strength_lower') {
    variantHint = resolveStrengthLowerVariant(variant, profile, ctx);
  }
  if (category === 'hyrox' && variant === 'simulation' && !isAdvancedStrength(profile)) {
    variantHint = 'simulation';
  }
  if (category === 'running' && variant === 'speed') {
    if (isBeginnerRunner(profile)) variantHint = 'speed';
    else if (ctx.phase === 'taper') variantHint = 'speed';
    else if (ctx.phase === 'peak' && isAdvancedRunner(profile)) variantHint = 'speed';
    else variantHint = 'speed';
  }

  let pool = buildCandidatePool(category, profile);
  if (category === 'hyrox' && variantHint === 'simulation') {
    const racePrepPool = buildRacePrepSimulationPool(profile);
    if (racePrepPool.length > 0) {
      pool = racePrepPool;
    } else {
      pool = preferRacePrepSimulationCandidates(pool, profile);
    }
  }
  if (category === 'running' && isBeginnerRunner(profile)) {
    pool = filterBeginnerRunningCandidates(pool, profile, ctx.weekIndex, variantHint);
  }
  if (category === 'recovery') {
    pool = preferProactiveRecoveryCandidates(pool);
  }
  const withoutSameWeekday = excludeSameWeekdayRepeats(pool, ctx);
  const withoutRepeats = excludeRecentRepeats(withoutSameWeekday, ctx);
  const recentStations =
    category === 'hyrox'
      ? buildRecentStationMap(ctx.recentTemplateUsage, getAllWorkouts(), ctx.sessionDate)
      : undefined;
  const ranked = rankCandidates(withoutRepeats, profile, ctx, variantHint, recentStations);
  return ranked[0]!;
}

/** Maps fitness level to preferred template difficulties for scoring ties. */
export function difficultyPreference(level: FitnessLevel): WorkoutDifficulty[] {
  if (level === 'beginner') return ['beginner', 'intermediate'];
  if (level === 'advanced') return ['advanced', 'intermediate', 'beginner'];
  return ['intermediate', 'beginner', 'advanced'];
}
