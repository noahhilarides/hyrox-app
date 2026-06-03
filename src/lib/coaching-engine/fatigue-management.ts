import { differenceInCalendarDays, parseISO } from 'date-fns';

import { isPerformanceTrainingGoal } from '@/lib/performance-training';
import type { OnboardingProfile, WorkoutType, Weakness } from '@/types';
import type { WorkoutCategory } from '@/types/workout';

import type { ResolvedSlot, SlotResolveContext } from './slot-resolve';
import { resolveSlot } from './slot-resolve';
import { strengthIndexForUpperBody } from './strength-assignment';

/** Rolling calendar window length (days inclusive). */
export const FATIGUE_WINDOW_DAYS = 3;

/** Max total fatigue points allowed in any rolling window. */
export const FATIGUE_WINDOW_MAX = 6;

/** High-load categories used for consecutive-session protection. */
export type SessionLoadTag =
  | 'heavy_lower'
  | 'simulation'
  | 'long_run'
  | 'sled_session';

const CONSECUTIVE_PROTECTION_TRIGGERS: readonly SessionLoadTag[] = [
  'heavy_lower',
  'simulation',
  'long_run',
  'sled_session',
] as const;

export interface FatigueHistoryEntry {
  date: string;
  score: number;
  loadTags: SessionLoadTag[];
  workoutType: WorkoutType;
}

export interface FatigueSafeSession {
  type: WorkoutType;
  slotContext: SlotResolveContext;
  fatigueScore: number;
  /** True when the planned slot was swapped for upper / easy work. */
  fatigueAdjusted: boolean;
}

const LOWER_DOMINANT_TAGS = ['sled_push', 'sled_pull', 'legs', 'lunges'] as const;

function isHeavyLowerStrength(resolved: ResolvedSlot): boolean {
  return (
    resolved.category === 'strength_lower' &&
    (resolved.variant === 'heavy' ||
      resolved.variant === 'standard' ||
      resolved.variant === 'performance')
  );
}

function isUpperStrength(resolved: ResolvedSlot): boolean {
  return resolved.category === 'strength_upper';
}

function isLongRun(resolved: ResolvedSlot, ctx: SlotResolveContext): boolean {
  return resolved.category === 'running' && (resolved.variant === 'long' || ctx.isLongRun);
}

function isStationSlot(resolved: ResolvedSlot): boolean {
  return resolved.category === 'hyrox' || resolved.workoutType === 'skills';
}

function isSledFocused(resolved: ResolvedSlot, targetWeakness?: Weakness): boolean {
  if (resolved.variant === 'sled') return true;
  if (targetWeakness === 'sleds' && isStationSlot(resolved)) return true;
  return false;
}

function isWallBallFocused(resolved: ResolvedSlot, targetWeakness?: Weakness): boolean {
  if (targetWeakness === 'wall_balls' && isStationSlot(resolved)) return true;
  return resolved.variant === 'stations' && !isSledFocused(resolved, targetWeakness);
}

function isBurpeeFocused(resolved: ResolvedSlot, targetWeakness?: Weakness): boolean {
  if (targetWeakness === 'burpees' && isStationSlot(resolved)) return true;
  return resolved.variant === 'burpee';
}

/** Classify session load for consecutive-session protection. */
export function classifySessionLoadTags(
  resolved: ResolvedSlot,
  ctx: SlotResolveContext
): SessionLoadTag[] {
  const tags: SessionLoadTag[] = [];
  if (isHeavyLowerStrength(resolved)) tags.push('heavy_lower');
  if (
    resolved.workoutType === 'race_sim' ||
    resolved.variant === 'simulation'
  ) {
    tags.push('simulation');
  }
  if (isLongRun(resolved, ctx)) tags.push('long_run');
  if (isSledFocused(resolved, ctx.targetWeakness)) tags.push('sled_session');
  return tags;
}

export function isPlannedLowerBodyDominant(
  workoutType: WorkoutType,
  profile: OnboardingProfile,
  ctx: SlotResolveContext
): boolean {
  const resolved = resolveSlot(workoutType, profile, ctx);
  if (classifySessionLoadTags(resolved, ctx).length > 0) return true;
  if (isHeavyLowerStrength(resolved)) return true;
  if (resolved.workoutType === 'race_sim' || resolved.variant === 'simulation') {
    return true;
  }
  if (isLongRun(resolved, ctx)) return true;
  if (isSledFocused(resolved, ctx.targetWeakness)) return true;
  if (
    resolved.category === 'hyrox' ||
    resolved.workoutType === 'skills' ||
    resolved.category === 'conditioning'
  ) {
    if (resolved.variant === 'row') return false;
    return resolved.variant !== 'easy';
  }
  if (resolved.category === 'strength_lower') return true;
  if (resolved.category === 'running' && ctx.isLongRun) return true;
  return false;
}

function lastNSessions(
  history: FatigueHistoryEntry[],
  n: number
): FatigueHistoryEntry[] {
  return [...history]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, n);
}

/** True when both of the previous two sessions were high lower-body loads. */
export function shouldProtectFromConsecutiveLowerLoad(
  history: FatigueHistoryEntry[]
): boolean {
  const recent = lastNSessions(history, 2);
  if (recent.length < 2) return false;
  return recent.every((entry) =>
    entry.loadTags.some((tag) => CONSECUTIVE_PROTECTION_TRIGGERS.includes(tag))
  );
}

/** Estimate fatigue from resolved slot — used before template selection. */
export function fatigueScoreFromResolved(
  resolved: ResolvedSlot,
  ctx: SlotResolveContext
): number {
  if (resolved.workoutType === 'recovery') return 0;

  if (isUpperStrength(resolved)) return 1;
  if (resolved.category === 'full_body_strength') return 2;

  if (isHeavyLowerStrength(resolved)) return 3;
  if (isLongRun(resolved, ctx)) return 2;
  if (isSledFocused(resolved, ctx.targetWeakness)) return 3;
  if (isBurpeeFocused(resolved, ctx.targetWeakness)) return 2;
  if (isWallBallFocused(resolved, ctx.targetWeakness)) return 2;

  if (resolved.workoutType === 'race_sim' || resolved.variant === 'simulation') return 3;

  if (resolved.category === 'hyrox' || resolved.workoutType === 'skills') {
    if (resolved.variant === 'row') return 1;
    return 2;
  }

  if (resolved.category === 'conditioning') return 2;

  if (resolved.category === 'running') {
    if (resolved.variant === 'easy') return 0;
    if (resolved.variant === 'speed') return 1;
    return 1;
  }

  return 1;
}

export function estimateSessionFatigue(
  workoutType: WorkoutType,
  profile: OnboardingProfile,
  slotContext: SlotResolveContext
): number {
  const resolved = resolveSlot(workoutType, profile, slotContext);
  return fatigueScoreFromResolved(resolved, slotContext);
}

export function rollingWindowFatigueTotal(
  history: FatigueHistoryEntry[],
  sessionDate: string
): number {
  const session = parseISO(sessionDate);
  return history.reduce((sum, entry) => {
    const daysAgo = differenceInCalendarDays(session, parseISO(entry.date));
    if (daysAgo >= 0 && daysAgo < FATIGUE_WINDOW_DAYS) {
      return sum + entry.score;
    }
    return sum;
  }, 0);
}

function wouldExceedFatigueWindow(
  history: FatigueHistoryEntry[],
  sessionDate: string,
  additionalScore: number
): boolean {
  return rollingWindowFatigueTotal(history, sessionDate) + additionalScore > FATIGUE_WINDOW_MAX;
}

function cloneSlotContext(ctx: SlotResolveContext): SlotResolveContext {
  return { ...ctx };
}

type FatigueReplacement = {
  type: WorkoutType;
  score: number;
  buildContext: (ctx: SlotResolveContext) => SlotResolveContext;
};

function fatigueReplacementOptions(
  profile: OnboardingProfile,
  preferUpperFirst: boolean
): FatigueReplacement[] {
  const easyRun: FatigueReplacement = {
    type: 'run',
    score: 0,
    buildContext: (ctx) => ({
      ...ctx,
      isLongRun: false,
      forceRaceSim: false,
      targetWeakness: undefined,
    }),
  };

  const upperStrength: FatigueReplacement = {
    type: 'strength',
    score: 1,
    buildContext: (ctx) => ({
      ...ctx,
      isLongRun: false,
      forceRaceSim: false,
      targetWeakness: undefined,
      strengthIndex: strengthIndexForUpperBody(ctx),
      forceUpperStrength: true,
    }),
  };

  const options: FatigueReplacement[] = [];

  if (preferUpperFirst && !isPerformanceTrainingGoal(profile.goal)) {
    options.push(upperStrength);
  }
  options.push(easyRun);
  if (!preferUpperFirst && !isPerformanceTrainingGoal(profile.goal)) {
    options.push(upperStrength);
  }

  return options;
}

function easyRunFallback(
  profile: OnboardingProfile,
  preferUpperFirst: boolean,
  slotContext: SlotResolveContext
): FatigueSafeSession {
  const easyRun = fatigueReplacementOptions(profile, preferUpperFirst).find(
    (option) => option.type === 'run'
  )!;
  const fallbackContext = easyRun.buildContext(cloneSlotContext(slotContext));
  return {
    type: easyRun.type,
    slotContext: { ...fallbackContext, fatigueAdjusted: true },
    fatigueScore: 0,
    fatigueAdjusted: true,
  };
}

function isHighFatigueType(score: number): boolean {
  return score >= 2;
}

function tryFatigueReplacements(
  profile: OnboardingProfile,
  slotContext: SlotResolveContext,
  history: FatigueHistoryEntry[],
  sessionDate: string,
  preferUpperFirst: boolean
): FatigueSafeSession | null {
  for (const replacement of fatigueReplacementOptions(profile, preferUpperFirst)) {
    const nextContext = replacement.buildContext(cloneSlotContext(slotContext));
    const nextScore = estimateSessionFatigue(replacement.type, profile, nextContext);
    if (!wouldExceedFatigueWindow(history, sessionDate, nextScore)) {
      return {
        type: replacement.type,
        slotContext: { ...nextContext, fatigueAdjusted: true },
        fatigueScore: nextScore,
        fatigueAdjusted: true,
      };
    }
  }
  return null;
}

export function resolveFatigueSafeSessionForDate(
  plannedType: WorkoutType,
  profile: OnboardingProfile,
  slotContext: SlotResolveContext,
  history: FatigueHistoryEntry[],
  sessionDate: string
): FatigueSafeSession {
  let type = plannedType;
  let context = cloneSlotContext(slotContext);
  let score = estimateSessionFatigue(type, profile, context);
  let adjusted = false;

  if (context.forceRaceSim && type === 'race_sim') {
    return {
      type,
      slotContext: { ...context, fatigueAdjusted: false },
      fatigueScore: score,
      fatigueAdjusted: false,
    };
  }

  const consecutiveLowerRisk =
    isPlannedLowerBodyDominant(type, profile, context) &&
    shouldProtectFromConsecutiveLowerLoad(history);

  if (consecutiveLowerRisk) {
    const swapped = tryFatigueReplacements(
      profile,
      slotContext,
      history,
      sessionDate,
      true
    );
    if (swapped) {
      return swapped;
    }
    return easyRunFallback(profile, true, slotContext);
  }

  if (!wouldExceedFatigueWindow(history, sessionDate, score)) {
    return {
      type,
      slotContext: { ...context, fatigueAdjusted: adjusted },
      fatigueScore: score,
      fatigueAdjusted: adjusted,
    };
  }

  if (!isHighFatigueType(score)) {
    return {
      type,
      slotContext: { ...context, fatigueAdjusted: false },
      fatigueScore: score,
      fatigueAdjusted: false,
    };
  }

  const windowSwap = tryFatigueReplacements(
    profile,
    slotContext,
    history,
    sessionDate,
    false
  );
  if (windowSwap) {
    return windowSwap;
  }

  return easyRunFallback(profile, false, slotContext);
}

export function buildFatigueHistoryEntry(
  sessionDate: string,
  workoutType: WorkoutType,
  profile: OnboardingProfile,
  slotContext: SlotResolveContext,
  fatigueScore: number
): FatigueHistoryEntry {
  const resolved = resolveSlot(workoutType, profile, slotContext);
  return {
    date: sessionDate,
    score: fatigueScore,
    loadTags: classifySessionLoadTags(resolved, slotContext),
    workoutType,
  };
}

/** Tags for templates that are clearly lower-body dominant (post-selection audit). */
export function templateLooksLowerDominant(tags: string[]): boolean {
  return LOWER_DOMINANT_TAGS.some((tag) => tags.includes(tag));
}
