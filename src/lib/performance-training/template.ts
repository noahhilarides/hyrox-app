import type { PerformanceSessionKind } from '@/constants/performance-training';
import type { WorkoutType } from '@/types';

export interface PerformanceWeekSlot {
  kind: PerformanceSessionKind;
  type: WorkoutType;
}

const KIND_TO_TYPE: Record<PerformanceSessionKind, WorkoutType> = {
  full_body_strength: 'strength',
  upper_strength: 'strength',
  lower_strength: 'strength',
  easy_run: 'run',
  speed_work: 'speed',
  conditioning: 'conditioning',
  long_aerobic: 'run',
};

export function isPerformanceTrainingGoal(
  goal: string | null | undefined
): goal is 'performance_training' {
  return goal === 'performance_training';
}

/** Fixed weekly shapes — order matches training day indices. */
export function getPerformanceWeeklySlots(daysPerWeek: number): PerformanceWeekSlot[] {
  const kinds = templateKindsForDays(daysPerWeek);
  return kinds.map((kind) => ({ kind, type: KIND_TO_TYPE[kind] }));
}

function templateKindsForDays(days: number): PerformanceSessionKind[] {
  const d = Math.min(6, Math.max(3, days));
  switch (d) {
    case 3:
      return ['full_body_strength', 'conditioning', 'long_aerobic'];
    case 4:
      return ['upper_strength', 'easy_run', 'lower_strength', 'conditioning'];
    case 5:
      return ['upper_strength', 'easy_run', 'speed_work', 'lower_strength', 'conditioning'];
    case 6:
    default:
      return [
        'upper_strength',
        'easy_run',
        'speed_work',
        'lower_strength',
        'conditioning',
        'long_aerobic',
      ];
  }
}

export function performanceWeeklyStructureLines(daysPerWeek: number): string[] {
  const labels: Record<PerformanceSessionKind, string> = {
    full_body_strength: 'Full body strength',
    upper_strength: 'Upper strength',
    lower_strength: 'Lower strength',
    easy_run: 'Easy run',
    speed_work: 'Speed work',
    conditioning: 'Conditioning',
    long_aerobic: 'Long aerobic',
  };
  return templateKindsForDays(daysPerWeek).map((k) => labels[k]);
}
