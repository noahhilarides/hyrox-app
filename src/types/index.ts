export type Goal =
  | 'hyrox_race'
  | 'hybrid_fitness'
  | 'endurance'
  | 'strength'
  | 'return_to_fitness';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type ExperienceLevel = 'none' | 'some' | 'regular' | 'competitive';

export type WorkoutLength = '30' | '45' | '60' | '75';

export type Weakness =
  | 'running'
  | 'sleds'
  | 'burpees'
  | 'rowing'
  | 'wall_balls'
  | 'endurance'
  | 'recovery'
  | 'strength';

export type Equipment =
  | 'full_gym'
  | 'dumbbells'
  | 'kettlebells'
  | 'sled'
  | 'rower'
  | 'ski_erg'
  | 'running_only';

export type WorkoutType =
  | 'run'
  | 'strength'
  | 'speed'
  | 'skills'
  | 'conditioning'
  | 'recovery'
  | 'hyrox'
  | 'race_sim';

export interface OnboardingProfile {
  goal: Goal;
  raceDate: string | null;
  raceName?: string | null;
  raceCity?: string | null;
  hasRacedBefore?: boolean;
  /** Prior HYROX finish time in seconds */
  previousRaceTimeSeconds?: number | null;
  fitnessLevel: FitnessLevel;
  runningExperience: ExperienceLevel;
  strengthExperience: ExperienceLevel;
  daysPerWeek: number;
  /** Weekday indices for plan placement (Mon=1 … Sat=6, Sun=0). */
  trainingDayIndices?: number[];
  equipment: Equipment[];
  weaknesses: Weakness[];
  workoutLength: WorkoutLength;
  /** ISO date (yyyy-MM-dd) — first scheduled session. Defaults to today if omitted. */
  planStartDate?: string | null;
}

export interface Exercise {
  name: string;
  detail: string;
}

export interface Workout {
  id: string;
  date: string;
  type: WorkoutType;
  /** Source template id from WORKOUT_LIBRARY */
  libraryTemplateId?: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  focus: string[];
  exercises: Exercise[];
  coachNote: string;
  completed: boolean;
  missed: boolean;
}

export interface TrainingPlan {
  id: string;
  createdAt: string;
  raceDate: string | null;
  weeksTotal: number;
  workouts: Workout[];
}

/** Saved snapshot for "recent plans" — mock-friendly archive, no server. */
export interface PlanHistoryEntry {
  id: string;
  title: string;
  createdAt: string;
  weeksTotal: number;
  completedWorkouts: number;
  profile: OnboardingProfile;
}

export interface ProgressStats {
  currentStreak: number;
  longestStreak: number;
  completedThisWeek: number;
  plannedThisWeek: number;
  totalCompleted: number;
}
