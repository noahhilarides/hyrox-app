import type { LegacyLibraryWorkout, WorkoutTemplateDraft } from '@/types/workout';

import { WORKOUT_TAG_REGISTRY } from './registry';

export function attachTagsToLegacy(workouts: LegacyLibraryWorkout[]): LegacyLibraryWorkout[] {
  return workouts.map((w) => ({
    ...w,
    tags: WORKOUT_TAG_REGISTRY[w.id] ?? [],
  }));
}

type TemplateInput = WorkoutTemplateDraft;

export function attachTagsToTemplates(templates: TemplateInput[]): WorkoutTemplateDraft[] {
  return templates.map((t) => ({
    ...t,
    tags: WORKOUT_TAG_REGISTRY[t.id] ?? t.tags ?? [],
  }));
}
