import type { LegacyLibraryWorkout } from '@/types/workout';

import { AEROBIC_WORKOUTS } from './aerobic';
import { ENGINE_WORKOUTS } from './engine';
import { HYBRID_WORKOUTS } from './hybrid';
import { RECOVERY_WORKOUTS } from './recovery';
import { SKILLS_WORKOUTS } from './skills';
import { SPEED_WORKOUTS } from './speed';
import { STRENGTH_WORKOUTS } from './strength';
import { attachTagsToLegacy } from './tags';

/** Flat Phase 1 catalog — converted to WorkoutTemplate at library build time. */
export const LEGACY_CATALOG: LegacyLibraryWorkout[] = attachTagsToLegacy([
  ...STRENGTH_WORKOUTS,
  ...AEROBIC_WORKOUTS,
  ...SPEED_WORKOUTS,
  ...SKILLS_WORKOUTS,
  ...HYBRID_WORKOUTS,
  ...ENGINE_WORKOUTS,
  ...RECOVERY_WORKOUTS,
]);
