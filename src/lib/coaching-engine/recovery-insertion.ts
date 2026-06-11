import { isBeginnerAthlete } from '@/lib/profile-levels';
import { scheduleRecoveryWeekLegacy } from '@/lib/recovery-prescription';
import type { OnboardingProfile, WorkoutType } from '@/types';
import type { WorkoutTemplate } from '@/types/workout';

/** Proactive recovery templates — mobility, flush, and easy movement. */
export const PREFERRED_RECOVERY_TEMPLATE_IDS: readonly string[] = [
  'RCV-001',
  'RCV-002',
  'RCV-003',
  'RCV-004',
  'RCV-006',
] as const;

const PREFERRED_RECOVERY_SET = new Set<string>(PREFERRED_RECOVERY_TEMPLATE_IDS);

/**
 * Proactive recovery cadence (not only deload weeks).
 * Advanced: every 4th week (4, 8, 12…).
 * Intermediate: every 3rd week (3, 6, 9…).
 */
export function isProactiveRecoveryWeek(
  weekIndex: number,
  profile: OnboardingProfile
): boolean {
  if (profile.daysPerWeek <= 3) return false;
  if (isBeginnerAthlete(profile)) return false;

  const weekNumber = weekIndex + 1;
  if (weekNumber < 3) return false;

  if (profile.fitnessLevel === 'advanced') {
    return weekNumber % 4 === 0;
  }

  return weekNumber % 3 === 0;
}

/** Combines taper/deload rules with proactive 3rd/4th-week recovery. */
export function shouldScheduleRecoveryWeek(
  profile: OnboardingProfile,
  weekIndex: number,
  totalWeeks: number
): boolean {
  if (isProactiveRecoveryWeek(weekIndex, profile)) {
    return true;
  }
  return scheduleRecoveryWeekLegacy(profile, weekIndex, totalWeeks);
}

/** Ensures the weekly template has a recovery slot when this week is prescribed. */
export function ensureRecoverySlotInTemplate(
  template: WorkoutType[],
  profile: OnboardingProfile,
  weekIndex: number,
  totalWeeks: number
): WorkoutType[] {
  if (profile.daysPerWeek < 6) {
    return template;
  }

  if (!shouldScheduleRecoveryWeek(profile, weekIndex, totalWeeks)) {
    return template;
  }
  if (template.includes('recovery')) {
    return template;
  }

  const replacePriority: WorkoutType[] =
    profile.daysPerWeek >= 6 ? ['skills', 'conditioning'] : ['skills', 'speed'];

  for (const slotType of replacePriority) {
    const idx = template.lastIndexOf(slotType);
    if (idx >= 0) {
      const next = [...template];
      next[idx] = 'recovery';
      return next;
    }
  }

  return template;
}

export function recoveryTemplateBonus(
  template: WorkoutTemplate,
  weekIndex: number
): number {
  if (!PREFERRED_RECOVERY_SET.has(template.id)) return 0;
  const rotate =
    PREFERRED_RECOVERY_TEMPLATE_IDS[
      weekIndex % PREFERRED_RECOVERY_TEMPLATE_IDS.length
    ]!;
  if (template.id === rotate) return 25;
  if (template.id === 'RCV-001' || template.id === 'RCV-006') return 18;
  if (template.id === 'RCV-002') return 16;
  return 14;
}

export function preferProactiveRecoveryCandidates(
  candidates: WorkoutTemplate[]
): WorkoutTemplate[] {
  const preferred = candidates.filter((t) => PREFERRED_RECOVERY_SET.has(t.id));
  return preferred.length > 0 ? preferred : candidates;
}
