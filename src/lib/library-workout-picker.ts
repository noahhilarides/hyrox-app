import { getWorkoutsByCategory } from '@/data/workout-library';
import type { WorkoutTemplate } from '@/types/workout';

/** Picks a recovery library template for plan sessions (generator-controlled). */
export function pickRecoveryLibraryWorkout(weekIndex: number): WorkoutTemplate {
  const pool = getWorkoutsByCategory('recovery');
  return pool[weekIndex % pool.length] ?? pool[0]!;
}
