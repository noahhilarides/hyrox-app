/**
 * Performance Training — year-round hybrid performance (not race prep).
 */

export const PERFORMANCE_TRAINING_PHILOSOPHY = {
  objective: [
    'Strength',
    'Aerobic fitness',
    'Speed',
    'Work capacity',
    'Recovery',
    'Longevity',
  ],
  avoid: [
    'Random workouts',
    'Consecutive high-fatigue days',
    'Excessive race simulations',
    'Over-specialization',
  ],
  prioritize: [
    'Consistency',
    'Progressive overload',
    'Balanced development',
    'Sustainable training',
  ],
  recovery: {
    scheduledSessions: false,
    recommendationOnly: true,
    byDaysPerWeek: {
      3: 'none',
      4: 'none',
      5: 'optional_off_day',
      6: 'optional_off_day',
    },
  },
} as const;

export type PerformanceSessionKind =
  | 'full_body_strength'
  | 'upper_strength'
  | 'lower_strength'
  | 'easy_run'
  | 'speed_work'
  | 'conditioning'
  | 'long_aerobic';

export const PERFORMANCE_BLOCK_WEEKS = 4;

/** Default plan length when not racing. */
export const PERFORMANCE_PLAN_WEEKS = 12;
