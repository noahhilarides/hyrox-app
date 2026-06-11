export {
  ALL_WORKOUT_TEMPLATES,
  getAllWorkouts,
  getTemplateById,
  getWorkoutById,
  getWorkoutsByCategory,
  getWorkoutsByTag,
  WORKOUT_CATEGORIES,
  WORKOUT_LIBRARY,
} from './build-library';

export { GENERATOR_TEMPLATES } from './generator-templates';
export { LEGACY_CATALOG } from './legacy-catalog';

// Phase 1 module exports (legacy shape files — consumed via LEGACY_CATALOG)
export { STRENGTH_WORKOUTS } from './strength';
export { AEROBIC_WORKOUTS } from './aerobic';
export { SPEED_WORKOUTS } from './speed';
export { SKILLS_WORKOUTS } from './skills';
export { HYBRID_WORKOUTS } from './hybrid';
export { ENGINE_WORKOUTS } from './engine';
export { RECOVERY_WORKOUTS } from './recovery';

/** @deprecated Use ALL_WORKOUT_TEMPLATES */
export { ALL_WORKOUT_TEMPLATES as ALL_LIBRARY_WORKOUTS } from './build-library';
