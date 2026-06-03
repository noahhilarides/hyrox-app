import { differenceInCalendarDays, parseISO } from 'date-fns';

import { isHyroxRacePrepGoal } from '@/lib/coaching-engine/hyrox-simulation-exposure';
import type { OnboardingProfile, WorkoutType } from '@/types';

import { isPlannedLowerBodyDominant } from './fatigue-management';
import type { SlotResolveContext } from './slot-resolve';
import { resolveSlot } from './slot-resolve';
import { strengthSlotIsUpper } from './strength-assignment';

/** Target cadence: at least one upper-body session within this window. */
export const UPPER_BODY_INTERVAL_DAYS = 10;

/** Start steering strength slots toward upper once this many days have passed. */
export const UPPER_BODY_STEER_DAYS = 7;

export function isUpperBodyResolvedSlot(
  workoutType: WorkoutType,
  profile: OnboardingProfile,
  ctx: SlotResolveContext
): boolean {
  const resolved = resolveSlot(workoutType, profile, ctx);
  if (resolved.category === 'strength_upper') return true;
  if (resolved.variant === 'row') return true;
  if (resolved.variant === 'ski' || resolved.variant === 'ski_erg') return true;
  return false;
}

export function daysSinceLastUpperBody(
  sessionDate: string,
  lastUpperBodyDate: string | null
): number {
  if (!lastUpperBodyDate) return UPPER_BODY_INTERVAL_DAYS;
  return differenceInCalendarDays(parseISO(sessionDate), parseISO(lastUpperBodyDate));
}

/**
 * For HYROX race prep: ensure upper-body work at least every 7–10 days.
 * Prefers upper strength; does not change weekly template shape.
 */
export function applyUpperBodyMinimum(
  plannedType: WorkoutType,
  profile: OnboardingProfile,
  slotContext: SlotResolveContext,
  sessionDate: string,
  lastUpperBodyDate: string | null
): { type: WorkoutType; slotContext: SlotResolveContext; upperBodySteered: boolean } {
  if (plannedType === 'strength' && !strengthSlotIsUpper(slotContext)) {
    return { type: plannedType, slotContext, upperBodySteered: false };
  }

  if (
    !isHyroxRacePrepGoal(profile) ||
    plannedType === 'race_sim' ||
    slotContext.forceRaceSim
  ) {
    return { type: plannedType, slotContext, upperBodySteered: false };
  }

  const daysSince = daysSinceLastUpperBody(sessionDate, lastUpperBodyDate);
  if (daysSince < UPPER_BODY_STEER_DAYS) {
    return { type: plannedType, slotContext, upperBodySteered: false };
  }

  if (plannedType === 'strength') {
    return {
      type: 'strength',
      slotContext: {
        ...slotContext,
        isLongRun: false,
        forceRaceSim: false,
      },
      upperBodySteered: true,
    };
  }

  if (
    daysSince >= UPPER_BODY_STEER_DAYS &&
    isPlannedLowerBodyDominant(plannedType, profile, slotContext)
  ) {
    return {
      type: 'strength',
      slotContext: {
        ...slotContext,
        isLongRun: false,
        forceRaceSim: false,
        targetWeakness: undefined,
      },
      upperBodySteered: true,
    };
  }

  return { type: plannedType, slotContext, upperBodySteered: false };
}
