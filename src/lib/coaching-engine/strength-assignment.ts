import { differenceInCalendarDays, parseISO } from 'date-fns';

import type { OnboardingProfile, WorkoutType } from '@/types';

import { isPlannedLowerBodyDominant } from './fatigue-management';
import type { SlotResolveContext } from './slot-resolve';
import { resolveSlot } from './slot-resolve';

/**
 * Even plan weeks (0, 2, 4…) → upper-first strength; odd weeks → lower-first.
 * Multiple strength slots in one week alternate from that anchor.
 */
export function strengthSlotIsUpper(ctx: SlotResolveContext): boolean {
  const weekStartsUpper = (ctx.weekIndex ?? 0) % 2 === 0;
  return weekStartsUpper
    ? ctx.strengthIndex % 2 === 0
    : ctx.strengthIndex % 2 === 1;
}

/** strengthIndex for the Nth strength session in a plan week (0-based occurrence). */
export function strengthIndexForWeekOccurrence(
  _weekIndex: number,
  occurrence: number
): number {
  return occurrence % 2 === 0 ? 0 : 1;
}

/** Applies week-based upper/lower polarity for the Nth strength session in a week. */
export function applyStrengthIndexForWeek(
  slotContext: SlotResolveContext,
  weekIndex: number,
  occurrence: number,
  options?: { preferUpper?: boolean }
): SlotResolveContext {
  const strengthIndex = options?.preferUpper
    ? strengthIndexForUpperBody({ ...slotContext, weekIndex })
    : strengthIndexForWeekOccurrence(weekIndex, occurrence);
  return {
    ...slotContext,
    strengthIndex,
    weekIndex,
    forceUpperStrength: options?.preferUpper ? true : undefined,
  };
}

/** Minimum strengthIndex that resolves to upper body for this plan week. */
export function strengthIndexForUpperBody(ctx: SlotResolveContext): number {
  const weekStartsUpper = (ctx.weekIndex ?? 0) % 2 === 0;
  return weekStartsUpper ? 0 : 1;
}

export function isLowerBodyStrengthSlot(
  profile: OnboardingProfile,
  ctx: SlotResolveContext
): boolean {
  if (ctx.performanceKind) return false;
  const resolved = resolveSlot('strength', profile, ctx);
  return resolved.category === 'strength_lower';
}

export interface PriorTrainingDay {
  sessionDate: string;
  plannedType: WorkoutType;
  slotContext: SlotResolveContext;
}

/**
 * When strength follows a lower-dominant session on the previous calendar day,
 * steer to upper body without changing template day order.
 */
export function applyConsecutiveLowerBodyGuard(
  plannedType: WorkoutType,
  profile: OnboardingProfile,
  slotContext: SlotResolveContext,
  sessionDate: string,
  priorDay: PriorTrainingDay | null
): SlotResolveContext {
  if (plannedType !== 'strength' || !priorDay) {
    return slotContext;
  }

  const dayGap = differenceInCalendarDays(
    parseISO(sessionDate),
    parseISO(priorDay.sessionDate)
  );
  if (dayGap !== 1) {
    return slotContext;
  }

  if (
    !isPlannedLowerBodyDominant(
      priorDay.plannedType,
      profile,
      priorDay.slotContext
    )
  ) {
    return slotContext;
  }

  if (!isLowerBodyStrengthSlot(profile, slotContext)) {
    return slotContext;
  }

  // Keep the week's planned lower-body strength even after a lower-dominant prior day.
  if (!strengthSlotIsUpper(slotContext)) {
    return slotContext;
  }

  return slotContext;
}
