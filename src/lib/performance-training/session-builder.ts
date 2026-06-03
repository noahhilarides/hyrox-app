import type { PerformanceSessionKind } from '@/constants/performance-training';
import { PERFORMANCE_PLAN_WEEKS } from '@/constants/performance-training';
import { assembleFromResolvedSlot, resolveSlot } from '@/lib/coaching-engine';
import { computeWeekProgression } from '@/lib/plan-progression';
import type { OnboardingProfile, Workout } from '@/types';

/** Builds a scheduled workout from WORKOUT_LIBRARY via the coaching engine. */
export function buildPerformanceSession(
  kind: PerformanceSessionKind,
  date: string,
  weekIndex: number,
  profile: OnboardingProfile,
  index: number
): Workout {
  const resolved = resolveSlot('strength', profile, {
    phase: 'build',
    isLongRun: false,
    forceRaceSim: false,
    strengthIndex: 0,
    performanceKind: kind,
  });

  return assembleFromResolvedSlot(resolved, profile, {
    date,
    index,
    weekIndex,
    dayIndex: index,
    phase: 'build',
    weekProgression: computeWeekProgression(weekIndex, PERFORMANCE_PLAN_WEEKS, profile),
    sessionDate: date,
    recentTemplateUsage: [],
    slotContext: {
      phase: 'build',
      isLongRun: kind === 'long_aerobic',
      forceRaceSim: false,
      strengthIndex: 0,
      performanceKind: kind,
    },
  });
}
