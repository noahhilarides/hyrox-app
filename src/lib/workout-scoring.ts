import type { WeekPhase } from '@/lib/recovery-prescription';
import type { Goal, OnboardingProfile, Weakness } from '@/types';
import type { WorkoutTemplate } from '@/types/workout';

/** Points awarded per scoring criterion (max 140). */
export const WORKOUT_SCORE_WEIGHTS = {
  equipment: 50,
  weakStation: 30,
  goal: 25,
  phase: 20,
  duration: 15,
} as const;

/** Maps athlete weaknesses to library tags for station matching. */
export const WEAKNESS_STATION_TAGS: Record<Weakness, readonly string[]> = {
  running: ['running', 'hyrox_run', 'compromised_running'],
  sleds: ['sled_push', 'sled_pull'],
  burpees: ['burpees', 'burpee'],
  rowing: ['rowing', 'row'],
  wall_balls: ['wall_ball'],
  endurance: ['endurance', 'zone2', 'aerobic', 'long_run'],
  recovery: ['recovery', 'mobility', 'active_recovery'],
  strength: ['strength', 'legs', 'upper_body', 'full_body'],
};

/** Tags that align with each training goal. */
export const GOAL_TAGS: Record<Goal, readonly string[]> = {
  hyrox_race: ['hyrox_simulation', 'race_specific', 'hyrox_run', 'hyrox_station'],
  hybrid_fitness: ['hybrid', 'conditioning', 'hyrox_station', 'work_capacity'],
  endurance: ['running', 'aerobic', 'zone2', 'endurance', 'long_run'],
  strength: ['strength', 'legs', 'upper_body', 'full_body', 'squat', 'deadlift'],
  return_to_fitness: ['base_phase', 'beginner', 'foundation', 'walk_run'],
};

const PHASE_TAGS: Record<WeekPhase, string> = {
  base: 'base_phase',
  build: 'build_phase',
  peak: 'peak_phase',
  taper: 'taper_phase',
};

/** Athlete profile used by the coaching engine (onboarding shape). */
export type AthleteProfile = OnboardingProfile;

/** True when the athlete can perform every equipment requirement on the template. */
export function templateEquipmentMatches(
  template: WorkoutTemplate,
  profile: OnboardingProfile
): boolean {
  if (profile.equipment.includes('full_gym')) return true;
  if (profile.equipment.includes('running_only')) {
    return (
      template.category === 'running' ||
      template.category === 'recovery' ||
      template.equipment.every((e) => e === 'bodyweight' || e === 'running')
    );
  }

  if (template.equipment.length === 0) return true;

  return template.equipment.every((need) => {
    if (need === 'full_gym') return profile.equipment.includes('full_gym');
    if (need === 'dumbbells') {
      return profile.equipment.includes('dumbbells') || profile.equipment.includes('full_gym');
    }
    if (need === 'sled' || need === 'sled_optional') {
      return profile.equipment.includes('sled') || profile.equipment.includes('full_gym');
    }
    if (need === 'rower') {
      return profile.equipment.includes('rower') || profile.equipment.includes('full_gym');
    }
    if (need === 'ski_erg') {
      return profile.equipment.includes('ski_erg') || profile.equipment.includes('full_gym');
    }
    if (need === 'running' || need === 'bodyweight' || need === 'bike') return true;
    if (need === 'wall_ball' || need === 'sandbag' || need === 'sandbag_optional') {
      return profile.equipment.includes('full_gym') || profile.equipment.includes('dumbbells');
    }
    if (need === 'kettlebell' || need === 'kettlebell_optional') {
      return (
        profile.equipment.includes('kettlebells') || profile.equipment.includes('full_gym')
      );
    }
    if (need === 'barbell' || need === 'rack' || need === 'trap_bar' || need === 'bench') {
      return profile.equipment.includes('full_gym');
    }
    if (need === 'pull-up bar') return profile.equipment.includes('full_gym');
    if (need === 'bike_optional') return true;
    return profile.equipment.includes('full_gym');
  });
}

function matchesWeakStation(workout: WorkoutTemplate, profile: OnboardingProfile): boolean {
  if (profile.weaknesses.length === 0) return false;

  const workoutTags = new Set(workout.tags);
  return profile.weaknesses.some((weakness) =>
    WEAKNESS_STATION_TAGS[weakness].some((tag) => workoutTags.has(tag))
  );
}

function matchesGoal(workout: WorkoutTemplate, profile: OnboardingProfile): boolean {
  const goalTags = GOAL_TAGS[profile.goal];
  return goalTags.some((tag) => workout.tags.includes(tag));
}

function matchesPhase(workout: WorkoutTemplate, phase: WeekPhase): boolean {
  return workout.tags.includes(PHASE_TAGS[phase]);
}

/** Session length within ±15 min of the athlete's preferred workout length. */
function matchesDuration(workout: WorkoutTemplate, profile: OnboardingProfile): boolean {
  const target = Number(profile.workoutLength);
  if (!Number.isFinite(target)) return false;
  return Math.abs(workout.duration - target) <= 15;
}

export interface WorkoutScoreBreakdown {
  equipment: number;
  weakStation: number;
  goal: number;
  phase: number;
  duration: number;
  total: number;
}

/** Score components for inspection and tests. */
export function scoreWorkoutBreakdown(
  workout: WorkoutTemplate,
  athleteProfile: AthleteProfile,
  phase: WeekPhase
): WorkoutScoreBreakdown {
  const equipment = templateEquipmentMatches(workout, athleteProfile)
    ? WORKOUT_SCORE_WEIGHTS.equipment
    : 0;
  const weakStation = matchesWeakStation(workout, athleteProfile)
    ? WORKOUT_SCORE_WEIGHTS.weakStation
    : 0;
  const goal = matchesGoal(workout, athleteProfile) ? WORKOUT_SCORE_WEIGHTS.goal : 0;
  const phaseScore = matchesPhase(workout, phase) ? WORKOUT_SCORE_WEIGHTS.phase : 0;
  const duration = matchesDuration(workout, athleteProfile) ? WORKOUT_SCORE_WEIGHTS.duration : 0;

  return {
    equipment,
    weakStation,
    goal,
    phase: phaseScore,
    duration,
    total: equipment + weakStation + goal + phaseScore + duration,
  };
}

/**
 * Scores a library template for plan selection (higher = better fit).
 * Does not modify plans — selection wiring comes later.
 */
export function scoreWorkout(
  workout: WorkoutTemplate,
  athleteProfile: AthleteProfile,
  phase: WeekPhase
): number {
  return scoreWorkoutBreakdown(workout, athleteProfile, phase).total;
}
