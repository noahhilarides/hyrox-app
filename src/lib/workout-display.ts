import { palette } from '@/constants/tokens';
import type { Workout } from '@/types';

export type WorkoutIntensityLabel = 'Easy' | 'Moderate' | 'Hard' | 'Simulation';

export type IntensityTone = 'easy' | 'moderate' | 'hard' | 'simulation';

/** UI-only intensity — derived from existing workout fields, not plan generation. */
export function getWorkoutIntensityDisplay(workout: Workout): {
  label: WorkoutIntensityLabel;
  tone: IntensityTone;
  color: string;
} {
  const title = workout.title.toLowerCase();

  if (workout.type === 'recovery') {
    return { label: 'Easy', tone: 'easy', color: palette.textSecondary };
  }
  if (workout.type === 'race_sim' || title.includes('simulation')) {
    return { label: 'Simulation', tone: 'simulation', color: palette.accent };
  }
  if (
    title.includes('easy') ||
    title.includes('aerobic') ||
    title.includes('run-walk') ||
    title.includes('maintenance')
  ) {
    return { label: 'Easy', tone: 'easy', color: '#7A9E8A' };
  }
  if (title.includes('heavy') || title.includes('race-pace') || workout.type === 'hyrox') {
    return { label: 'Hard', tone: 'hard', color: palette.accent };
  }
  if (
    workout.type === 'speed' ||
    title.includes('interval') ||
    title.includes('tempo')
  ) {
    return { label: 'Hard', tone: 'hard', color: palette.accent };
  }
  if (workout.type === 'skills') {
    return { label: 'Moderate', tone: 'moderate', color: '#D4D4D8' };
  }
  if (workout.type === 'conditioning' || title.includes('engine')) {
    return { label: 'Moderate', tone: 'moderate', color: '#D4D4D8' };
  }
  if (workout.type === 'strength') {
    return { label: 'Moderate', tone: 'moderate', color: '#D4D4D8' };
  }
  return { label: 'Moderate', tone: 'moderate', color: '#D4D4D8' };
}
