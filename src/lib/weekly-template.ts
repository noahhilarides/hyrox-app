import { weekPhase, type WeekPhase } from '@/lib/recovery-prescription';
import {
  isAdvancedAthlete,
  isBeginnerAthlete,
} from '@/lib/profile-levels';
import type { OnboardingProfile, WorkoutType } from '@/types';

/**
 * Builds the weekly session-type template before weakness sorting and load tweaks.
 * Recovery is not scheduled as a training day — see applyRecoveryToTemplate.
 */
export function buildBaseWeeklyTemplate(
  profile: OnboardingProfile,
  weekIndex: number,
  totalWeeks: number
): WorkoutType[] {
  const days = profile.daysPerWeek;
  const phase = weekPhase(weekIndex, totalWeeks);
  const goal = profile.goal;

  if (goal === 'endurance') {
    return templateForEndurance(days);
  }
  if (goal === 'strength') {
    return templateForStrengthGoal(days);
  }
  if (goal === 'return_to_fitness') {
    return templateForReturnToFitness(days);
  }

  if (days <= 3) {
    return ['strength', 'run', 'hyrox'];
  }
  if (days === 4) {
    return ['strength', 'run', 'hyrox', 'skills'];
  }
  if (days === 5) {
    return templateForFiveDays(profile, weekIndex);
  }
  return templateForSixDays(profile, phase);
}

function templateForEndurance(days: number): WorkoutType[] {
  if (days <= 3) return ['run', 'run', 'hyrox'];
  if (days === 4) return ['run', 'speed', 'run', 'hyrox'];
  if (days === 5) return ['run', 'speed', 'run', 'hyrox', 'run'];
  return ['run', 'speed', 'run', 'hyrox', 'skills', 'run'];
}

function templateForStrengthGoal(days: number): WorkoutType[] {
  if (days <= 3) return ['strength', 'strength', 'hyrox'];
  if (days === 4) return ['strength', 'strength', 'run', 'hyrox'];
  if (days === 5) return ['strength', 'strength', 'run', 'hyrox', 'skills'];
  return ['strength', 'strength', 'speed', 'hyrox', 'skills', 'run'];
}

function templateForReturnToFitness(days: number): WorkoutType[] {
  if (days <= 3) return ['run', 'strength', 'hyrox'];
  if (days === 4) return ['strength', 'run', 'hyrox', 'skills'];
  if (days === 5) return ['strength', 'run', 'skills', 'hyrox', 'run'];
  return ['strength', 'run', 'skills', 'hyrox', 'run', 'skills'];
}

function templateForFiveDays(profile: OnboardingProfile, weekIndex: number): WorkoutType[] {
  if (isBeginnerAthlete(profile)) {
    const evenWeek = weekIndex % 2 === 0;
    return evenWeek
      ? ['strength', 'run', 'skills', 'run', 'hyrox']
      : ['strength', 'run', 'hyrox', 'run', 'skills'];
  }
  if (isAdvancedAthlete(profile)) {
    return ['strength', 'speed', 'hyrox', 'skills', 'run'];
  }
  return ['strength', 'run', 'speed', 'hyrox', 'skills'];
}

function templateForSixDays(
  profile: OnboardingProfile,
  phase: WeekPhase
): WorkoutType[] {
  if (isBeginnerAthlete(profile)) {
    return ['strength', 'run', 'skills', 'hyrox', 'run', 'strength'];
  }
  if (isAdvancedAthlete(profile)) {
    const sixthSlot: WorkoutType =
      phase === 'peak' || phase === 'taper' ? 'race_sim' : 'hyrox';
    return ['strength', 'speed', 'hyrox', 'skills', 'run', sixthSlot];
  }
  return ['strength', 'run', 'speed', 'hyrox', 'skills', 'run'];
}

/**
 * Converts any recovery placeholders to skills — recovery is never a training day.
 */
export function applyRecoveryToTemplate(
  template: WorkoutType[],
  profile: OnboardingProfile,
  _weekIndex: number,
  _totalWeeks: number
): WorkoutType[] {
  return template.map((type) => (type === 'recovery' ? 'skills' : type));
}
