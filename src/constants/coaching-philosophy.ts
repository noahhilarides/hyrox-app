/**
 * Coach-like training engine rules.
 *
 * The app decides workout types, intensity, progression, and recovery placement.
 * Users provide goal, abilities, weaknesses, availability, duration, and equipment only.
 */

export const COACHING_PHILOSOPHY = {
  principle:
    'Users choose how often they can train; the engine programs everything else.',
  userProvides: [
    'goal',
    'running ability',
    'strength ability',
    'weaknesses',
    'training availability',
    'long session day',
    'workout duration',
    'equipment',
  ],
  engineDecides: [
    'workout types',
    'intensity',
    'progression',
    'recovery placement',
  ],
  neverAskUserFor: [
    'recovery preference',
    'recovery day selection',
    'deload preference',
    'training split selection',
  ],
} as const;

/** How often the generator may schedule a dedicated recovery session. */
export type RecoveryPrescription = 'never' | 'rare' | 'moderate' | 'often';

export const RECOVERY_BY_DAYS_PER_WEEK: Record<number, RecoveryPrescription> = {
  3: 'never',
  4: 'rare',
  5: 'moderate', // refined per athlete level in prescription logic
  6: 'often', // not every week — see shouldScheduleRecoveryWeek
};

export const PLAN_SHAPE_BY_DAYS = {
  threeDay: {
    dedicatedRecovery: false,
    focus: ['strength', 'aerobic', 'hybrid'],
    note: 'Recovery comes from rest days between training days.',
  },
  fourDay: {
    dedicatedRecovery: 'rare',
    focus: ['strength', 'aerobic', 'speed', 'hybrid'],
    note: 'Most weeks are training-only; recovery from off days.',
  },
  fiveDay: {
    beginner: ['strength', 'aerobic', 'recovery_optional', 'hybrid', 'long_aerobic'],
    intermediate: ['strength', 'speed', 'hybrid', 'skills', 'long_aerobic'],
    advanced: ['strength', 'speed', 'hybrid', 'skills', 'long_aerobic'],
    note: 'Five meaningful sessions. Recovery only when coaching logic prescribes it.',
  },
  sixDay: {
    typical: ['strength', 'speed', 'recovery_optional', 'hybrid', 'skills', 'long_aerobic'],
    note: 'Recovery sessions appear on some weeks, not every week.',
  },
} as const;
