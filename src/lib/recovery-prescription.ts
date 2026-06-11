import type { RecoveryPrescription } from '@/constants/coaching-philosophy';
import { RECOVERY_BY_DAYS_PER_WEEK } from '@/constants/coaching-philosophy';
import { PEAK_PHASE_MAX_WEEKS, TAPER_PHASE_MAX_WEEKS } from '@/constants/plan-generation';
import { isAdvancedAthlete, isBeginnerAthlete } from '@/lib/profile-levels';
import type { FitnessLevel, OnboardingProfile, WorkoutType } from '@/types';

export type WeekPhase = 'base' | 'build' | 'peak' | 'taper';

/** Phase split as fraction of base+build (peak/taper are capped separately). */
const PHASE_SPLIT: Record<FitnessLevel, { base: number; build: number }> = {
  beginner: { base: 0.62, build: 0.38 },     // more aerobic + movement foundation
  intermediate: { base: 0.47, build: 0.53 }, // balanced
  advanced: { base: 0.38, build: 0.62 },     // already has base, more intensity
};

/**
 * Mesocycle phase for a plan week (0-based weekIndex).
 *
 * Peak and taper are capped windows at the end of the plan; the remaining
 * weeks split between base and build by fitness level. Extra weeks on long
 * plans bank into base (beginners) or build (advanced).
 */
export function weekPhase(
  weekIndex: number,
  totalWeeks: number,
  level: FitnessLevel = 'intermediate',
  mode: 'race' | 'rolling' = 'race'
): WeekPhase {
  const weeks = Math.max(1, totalWeeks);
  const weekNumber = weekIndex + 1;

  if (mode === 'rolling') {
    // No race date: sustainable training. Short base to start, then stay in build.
    const split = PHASE_SPLIT[level];
    const baseWeeks = Math.max(1, Math.round(weeks * split.base * 0.5));
    return weekNumber <= baseWeeks ? 'base' : 'build';
  }

  // Peak and taper are capped windows at the end of the plan
  const taperWeeks = Math.min(TAPER_PHASE_MAX_WEEKS, Math.max(1, Math.round(weeks * 0.08)));
  const peakWeeks = Math.min(PEAK_PHASE_MAX_WEEKS, Math.max(1, Math.round(weeks * 0.18)));

  // Remaining weeks split between base and build by fitness level
  const remaining = Math.max(2, weeks - taperWeeks - peakWeeks);
  const split = PHASE_SPLIT[level];
  const baseWeeks = Math.max(1, Math.round(remaining * split.base));
  const buildWeeks = Math.max(1, remaining - baseWeeks);

  const baseEnd = baseWeeks;
  const buildEnd = baseEnd + buildWeeks;
  const peakEnd = buildEnd + peakWeeks;

  if (weekNumber <= baseEnd) return 'base';
  if (weekNumber <= buildEnd) return 'build';
  if (weekNumber <= peakEnd) return 'peak';
  return 'taper';
}

/** Base recovery frequency before athlete-level refinement. */
export function baseRecoveryPrescription(daysPerWeek: number): RecoveryPrescription {
  return RECOVERY_BY_DAYS_PER_WEEK[Math.min(6, Math.max(3, daysPerWeek))] ?? 'rare';
}

function refinedPrescription(_profile: OnboardingProfile): RecoveryPrescription {
  return 'never';
}

/** Deload/taper/weakness-driven recovery (excludes proactive 3rd/4th-week cadence). */
export function scheduleRecoveryWeekLegacy(
  profile: OnboardingProfile,
  weekIndex: number,
  totalWeeks: number
): boolean {
  const prescription = refinedPrescription(profile);
  const phase = weekPhase(weekIndex, totalWeeks);
  const recoveryWeakness = profile.weaknesses.includes('recovery');

  if (prescription === 'never') return false;

  if (prescription === 'rare') {
    if (phase === 'taper') return true;
    if (profile.daysPerWeek === 5 && isAdvancedAthlete(profile) && recoveryWeakness) {
      return weekIndex % 4 === 3;
    }
    if (recoveryWeakness && profile.daysPerWeek <= 4 && weekIndex % 3 === 2) return true;
    if (profile.daysPerWeek === 4) return weekIndex > 0 && weekIndex % 4 === 3;
    return false;
  }

  if (prescription === 'moderate') {
    if (phase === 'taper') return true;
    if (recoveryWeakness) return weekIndex % 2 === 1;
    return weekIndex % 3 === 2;
  }

  if (phase === 'taper') return true;
  if (phase === 'base') return weekIndex % 3 === 2;
  if (recoveryWeakness) return weekIndex % 2 === 1;
  return weekIndex % 2 === 1;
}

/** Slot index where recovery is placed when the weekly template supports it. */
export function recoverySlotIndex(daysPerWeek: number): number {
  if (daysPerWeek >= 6) return 2;
  if (daysPerWeek === 5) return 2;
  if (daysPerWeek === 4) return 2; // replaces speed when prescribed
  return -1;
}

/**
 * Swap the recovery slot to a training type when recovery is not prescribed this week.
 */
export function trainingTypeForRecoverySlot(
  profile: OnboardingProfile,
  phase: WeekPhase
): WorkoutType {
  const days = profile.daysPerWeek;
  if (days === 5 && isBeginnerAthlete(profile)) return 'skills';
  if (days === 4) return 'speed';
  if (days >= 6) return phase === 'peak' ? 'conditioning' : 'skills';
  return 'skills';
}
