import type { Goal } from '@/types';

export type AbilityLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export type OnboardingWeakness =
  | 'running_endurance'
  | 'ski_erg'
  | 'sled_push'
  | 'sled_pull'
  | 'burpees'
  | 'grip_fatigue'
  | 'recovery'
  | 'pacing'
  | 'lunges'
  | 'wall_balls'
  | 'rowing';

/** Route names under `app/(onboarding)/`. */
export type OnboardingStepId =
  | 'goal'
  | 'race'
  | 'running-level'
  | 'strength-level'
  | 'weaknesses'
  | 'availability'
  | 'equipment'
  | 'interests'
  | 'plan-start'
  | 'summary';

export type OnboardingInterest =
  | 'mobility'
  | 'recovery'
  | 'sleep'
  | 'nutrition'
  | 'vo2_max'
  | 'mental_toughness'
  | 'fat_loss'
  | 'injury_prevention';

export interface OnboardingRace {
  eventId: string | null;
  date: string | null;
  name: string | null;
  city: string | null;
  location: string | null;
  /** null until answered on the race step */
  hasRacedBefore: boolean | null;
  /** Total finish time in seconds (when hasRacedBefore is true) */
  previousTimeSeconds: number | null;
}

export type LongSessionDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type OnboardingEquipment =
  | 'full_gym'
  | 'home_gym'
  | 'dumbbells_only'
  | 'bodyweight_only'
  | 'hyrox_gym';

export interface OnboardingAvailability {
  daysPerWeek: number | null;
  /** Weekdays the athlete wants to train (should match daysPerWeek). */
  workoutDays: LongSessionDay[];
  longSessionDay: LongSessionDay | null;
  preferredSessionMinutes: number | null;
}

/** Zustand onboarding draft — maps to `OnboardingProfile` on completion. */
export interface OnboardingDraft {
  goal: Goal | null;
  race: OnboardingRace;
  runningLevel: AbilityLevel | null;
  strengthLevel: AbilityLevel | null;
  weaknesses: OnboardingWeakness[];
  availability: OnboardingAvailability;
  equipmentAccess: OnboardingEquipment | null;
  interests: OnboardingInterest[];
  /** ISO date (yyyy-MM-dd) for the first day of the generated plan. */
  planStartDate: string | null;
}

export const initialOnboardingDraft: OnboardingDraft = {
  goal: null,
  race: {
    eventId: null,
    date: null,
    name: null,
    city: null,
    location: null,
    hasRacedBefore: null,
    previousTimeSeconds: null,
  },
  runningLevel: null,
  strengthLevel: null,
  weaknesses: [],
  availability: {
    daysPerWeek: null,
    workoutDays: [],
    longSessionDay: null,
    preferredSessionMinutes: 45,
  },
  equipmentAccess: null,
  interests: [],
  planStartDate: null,
};
