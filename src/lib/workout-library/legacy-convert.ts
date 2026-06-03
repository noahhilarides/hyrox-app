import type {
  LegacyLibraryWorkout,
  WorkoutCategory,
  WorkoutTemplateDraft,
} from '@/types/workout';
import type { WorkoutType } from '@/types';

function blocksFromLegacy(w: LegacyLibraryWorkout) {
  const mainLines = w.mainSet
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const blocks = [];

  if (w.warmup.trim()) {
    blocks.push({
      name: 'Warm-up',
      detail: w.warmup.replace(/\n/g, ' ').trim(),
    });
  }

  blocks.push(
    ...mainLines.map((line) => ({
      name: '',
      detail: line,
    }))
  );

  if (w.cooldown.trim()) {
    blocks.push({
      name: 'Cool-down',
      detail: w.cooldown.replace(/\n/g, ' ').trim(),
    });
  }

  return blocks;
}

function inferVariant(w: LegacyLibraryWorkout): string | undefined {
  const text = `${w.name} ${w.workoutType} ${w.description}`.toLowerCase();
  if (w.category === 'recovery') return undefined;
  if (w.category === 'speed') return 'speed';
  if (w.category === 'engine') return 'simulation';
  if (w.category === 'skills') return 'stations';
  if (text.includes('long') || text.includes('endurance') && w.duration >= 60) return 'long';
  if (text.includes('tempo') || text.includes('threshold')) return 'tempo';
  if (text.includes('easy') || text.includes('zone 2') || text.includes('recovery flush')) return 'easy';
  if (text.includes('simulation') || text.includes('race')) return 'simulation';
  if (text.includes('upper') || text.includes('bench') || text.includes('press') && !text.includes('leg')) {
    return 'upper';
  }
  if (text.includes('full body') || text.includes('foundation') || text.includes('circuit')) {
    return 'full_body';
  }
  if (w.category === 'strength') return 'lower';
  return undefined;
}

function mapCategory(w: LegacyLibraryWorkout): WorkoutCategory {
  const variant = inferVariant(w);
  switch (w.category) {
    case 'aerobic':
    case 'speed':
      return 'running';
    case 'strength':
      if (variant === 'upper') return 'strength_upper';
      if (variant === 'full_body') return 'full_body_strength';
      return 'strength_lower';
    case 'skills':
    case 'hybrid':
    case 'engine':
      return 'hyrox';
    case 'recovery':
      return 'recovery';
    default:
      return 'conditioning';
  }
}

function inferWorkoutType(w: LegacyLibraryWorkout, category: WorkoutCategory): WorkoutType {
  if (category === 'running') {
    const v = inferVariant(w);
    return v === 'speed' ? 'speed' : 'run';
  }
  if (category === 'recovery') return 'recovery';
  if (category === 'conditioning') return 'conditioning';
  if (category === 'hyrox') {
    return inferVariant(w) === 'simulation' ? 'race_sim' : 'hyrox';
  }
  if (category === 'strength_upper' || category === 'strength_lower' || category === 'full_body_strength') {
    return 'strength';
  }
  return 'conditioning';
}

export function convertLegacyWorkout(w: LegacyLibraryWorkout): WorkoutTemplateDraft {
  const category = mapCategory(w);
  return {
    id: w.id,
    name: w.name,
    category,
    description: w.description,
    difficulty: w.difficulty,
    duration: w.duration,
    equipment: w.equipment,
    focus: w.focusAreas,
    workoutBlocks: blocksFromLegacy(w),
    workoutType: inferWorkoutType(w, category),
    variant: inferVariant(w),
    tags: w.tags ?? [],
  };
}

export function convertLegacyCatalog(workouts: LegacyLibraryWorkout[]): WorkoutTemplateDraft[] {
  return workouts.map(convertLegacyWorkout);
}
