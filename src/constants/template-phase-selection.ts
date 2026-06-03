import type { WeekPhase } from '@/lib/recovery-prescription';
import type { WorkoutCategory } from '@/types/workout';

/**
 * Phase-aware template selection — which library variants fit each training phase.
 * Kept separate from workout definitions in `src/data/workout-library/`.
 */
export const PHASE_PREFERRED_VARIANTS: Record<
  WeekPhase,
  Partial<Record<WorkoutCategory, readonly string[]>>
> = {
  base: {
    running: ['easy', 'long'],
    strength_lower: ['standard'],
    strength_upper: ['standard', 'upper'],
    full_body_strength: ['standard', 'full_body'],
    hyrox: ['stations', 'sled'],
    conditioning: ['standard'],
    recovery: [],
  },
  build: {
    running: ['tempo', 'long'],
    strength_lower: ['standard', 'heavy'],
    strength_upper: ['standard', 'upper'],
    hyrox: ['stations', 'sled', 'burpee'],
    conditioning: ['standard', 'burpee'],
    recovery: [],
  },
  peak: {
    running: ['tempo', 'speed', 'long'],
    strength_lower: ['heavy', 'standard'],
    strength_upper: ['standard', 'upper'],
    hyrox: ['simulation', 'stations'],
    conditioning: ['standard', 'burpee'],
    recovery: [],
  },
  taper: {
    running: ['easy', 'speed'],
    strength_lower: ['maintenance', 'standard'],
    strength_upper: ['standard', 'upper'],
    hyrox: ['simulation', 'stations'],
    conditioning: ['standard'],
    recovery: [],
  },
};

/** Variants deprioritized during a given phase (still allowed if nothing else matches). */
export const PHASE_AVOID_VARIANTS: Record<
  WeekPhase,
  Partial<Record<WorkoutCategory, readonly string[]>>
> = {
  base: {
    hyrox: ['simulation'],
    strength_lower: ['heavy', 'maintenance'],
  },
  build: {
    strength_lower: ['maintenance'],
  },
  peak: {},
  taper: {
    strength_lower: ['heavy'],
    hyrox: ['sled'],
  },
};
