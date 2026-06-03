import { isBeginnerRunner } from '@/lib/profile-levels';
import type { OnboardingProfile } from '@/types';
import type { WorkoutTemplate } from '@/types/workout';

/** Preferred library templates for new runners (weeks 1–4). */
export const BEGINNER_RUN_PREFERRED_IDS: readonly string[] = [
  'AER-004',
  'AER-010',
  'GEN-RUN-BEG-EASY',
  'AER-001',
  'GEN-RUN-SPD-BEG',
  'SPD-003',
] as const;

/** Blocked until later progression milestones. */
export const BEGINNER_RUN_BLOCKED_IDS: readonly string[] = [
  'AER-002',
  'AER-008',
  'AER-012',
  'GEN-RUN-LONG-MID',
  'GEN-RUN-LONG-ADV',
  'GEN-RUN-SPD-1K',
  'GEN-RUN-SPD-400',
  'GEN-RUN-TEMPO',
  'SPD-001',
  'SPD-004',
  'SPD-005',
  'SPD-006',
  'SPD-008',
  'SPD-010',
] as const;

const BLOCKED_ID_SET = new Set<string>(BEGINNER_RUN_BLOCKED_IDS);
const PREFERRED_ID_SET = new Set<string>(BEGINNER_RUN_PREFERRED_IDS);

export { isBeginnerRunner };

/** Max run session length by plan week (0-based weekIndex). */
export function beginnerRunnerMaxDurationMinutes(weekIndex: number): number {
  if (weekIndex <= 1) return 35;
  if (weekIndex <= 3) return 45;
  if (weekIndex <= 5) return 50;
  if (weekIndex <= 7) return 55;
  return 60;
}

/** Long-run variant allowed from week 5 onward (weekIndex >= 4). */
export function beginnerRunnerAllowsLongVariant(weekIndex: number): boolean {
  return weekIndex >= 4;
}

/** Easy / walk-run variants for early long-run slots. */
export function beginnerRunnerRunVariant(
  requestedVariant: string | undefined,
  isLongRunSlot: boolean,
  weekIndex: number
): string {
  if (isLongRunSlot && !beginnerRunnerAllowsLongVariant(weekIndex)) {
    return 'easy';
  }
  if (requestedVariant === 'long' && !beginnerRunnerAllowsLongVariant(weekIndex)) {
    return 'easy';
  }
  if (requestedVariant === 'tempo' && weekIndex <= 3) {
    return 'easy';
  }
  return requestedVariant ?? 'easy';
}

function hasLongRunTag(template: WorkoutTemplate): boolean {
  return template.tags.includes('long_run') || template.variant === 'long';
}

function isAdvancedIntervalRun(template: WorkoutTemplate): boolean {
  if (template.difficulty === 'advanced') return true;
  if (BLOCKED_ID_SET.has(template.id)) return true;
  const intense =
    template.tags.includes('vo2max') ||
    template.tags.includes('race_pace') ||
    (template.tags.includes('intervals') &&
      !template.tags.includes('beginner') &&
      !template.tags.includes('strides') &&
      !template.tags.includes('walk_run'));
  return intense;
}

export function isTemplateAllowedForBeginnerRunner(
  template: WorkoutTemplate,
  weekIndex: number,
  variantHint?: string
): boolean {
  const maxMin = beginnerRunnerMaxDurationMinutes(weekIndex);

  if (template.duration > maxMin) return false;
  if (template.difficulty === 'advanced') return false;
  if (BLOCKED_ID_SET.has(template.id)) return false;

  if (!beginnerRunnerAllowsLongVariant(weekIndex)) {
    if (hasLongRunTag(template)) return false;
    if (template.variant === 'long') return false;
  }

  if (variantHint === 'speed' && isAdvancedIntervalRun(template)) {
    return false;
  }

  if (variantHint === 'speed') {
    const okSpeed =
      template.tags.includes('beginner') ||
      template.tags.includes('strides') ||
      template.tags.includes('walk_run') ||
      template.difficulty === 'beginner' ||
      PREFERRED_ID_SET.has(template.id);
    if (!okSpeed) return false;
  }

  return true;
}

/** Extra selection score so beginner templates beat endurance-tagged long runs. */
export function beginnerRunnerSelectionBonus(
  template: WorkoutTemplate,
  weekIndex: number
): number {
  let bonus = 0;
  if (PREFERRED_ID_SET.has(template.id)) bonus += 28;
  if (template.tags.includes('beginner')) bonus += 12;
  if (template.tags.includes('walk_run')) bonus += 10;
  if (template.difficulty === 'beginner') bonus += 8;

  const maxMin = beginnerRunnerMaxDurationMinutes(weekIndex);
  if (template.duration <= maxMin) bonus += 6;

  return bonus;
}

export function filterBeginnerRunningCandidates(
  candidates: WorkoutTemplate[],
  profile: OnboardingProfile,
  weekIndex: number,
  variantHint?: string
): WorkoutTemplate[] {
  if (!isBeginnerRunner(profile)) return candidates;

  const filtered = candidates.filter((t) =>
    isTemplateAllowedForBeginnerRunner(t, weekIndex, variantHint)
  );
  if (filtered.length > 0) return filtered;

  const withoutBlocked = candidates.filter((t) => !BLOCKED_ID_SET.has(t.id));
  return withoutBlocked.length > 0 ? withoutBlocked : candidates;
}
