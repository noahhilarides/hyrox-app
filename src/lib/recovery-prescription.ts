import type { RecoveryPrescription } from '@/constants/coaching-philosophy';
import { RECOVERY_BY_DAYS_PER_WEEK } from '@/constants/coaching-philosophy';
import { isPerformanceTrainingGoal } from '@/lib/performance-training';
import { isAdvancedAthlete, isBeginnerAthlete } from '@/lib/profile-levels';
import type { OnboardingProfile, WorkoutType } from '@/types';

export type WeekPhase = 'base' | 'build' | 'peak' | 'taper';

/**
 * Mesocycle phase for a plan week (0-based weekIndex).
 *
 * 12-week reference: weeks 1–3 base, 4–7 build, 8–10 peak, 11–12 taper.
 * Other lengths use the same proportions (3/12, 7/12, 10/12 of total weeks).
 */
export function weekPhase(weekIndex: number, totalWeeks: number): WeekPhase {
  const weekNumber = weekIndex + 1;
  const weeks = Math.max(1, totalWeeks);
  const baseEnd = Math.max(1, Math.round((3 / 12) * weeks));
  const buildEnd = Math.max(baseEnd, Math.round((7 / 12) * weeks));
  const peakEnd = Math.max(buildEnd, Math.round((10 / 12) * weeks));

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
