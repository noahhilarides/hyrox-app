import { convertLegacyCatalog } from '@/lib/workout-library/legacy-convert';
import type { WorkoutCategory, WorkoutTemplate } from '@/types/workout';

import { GENERATOR_TEMPLATES } from './generator-templates';
import { LEGACY_CATALOG } from './legacy-catalog';
import { attachCoachingToTemplates } from './coaching-metadata';
import { attachTagsToTemplates } from './tags';

function dedupeById(templates: WorkoutTemplate[]): WorkoutTemplate[] {
  const map = new Map<string, WorkoutTemplate>();
  for (const t of templates) {
    if (!map.has(t.id)) map.set(t.id, t);
  }
  return [...map.values()];
}

const CONVERTED_LEGACY = attachCoachingToTemplates(convertLegacyCatalog(LEGACY_CATALOG));

const TAGGED_GENERATOR_TEMPLATES = attachCoachingToTemplates(
  attachTagsToTemplates(GENERATOR_TEMPLATES)
);

export const ALL_WORKOUT_TEMPLATES: WorkoutTemplate[] = dedupeById([
  ...CONVERTED_LEGACY,
  ...TAGGED_GENERATOR_TEMPLATES,
]);

const CATEGORIES: WorkoutCategory[] = [
  'running',
  'strength_upper',
  'strength_lower',
  'full_body_strength',
  'hyrox',
  'conditioning',
  'recovery',
];

export const WORKOUT_LIBRARY: Record<WorkoutCategory, WorkoutTemplate[]> = CATEGORIES.reduce(
  (acc, category) => {
    acc[category] = ALL_WORKOUT_TEMPLATES.filter((t) => t.category === category);
    return acc;
  },
  {} as Record<WorkoutCategory, WorkoutTemplate[]>
);

export { CATEGORIES as WORKOUT_CATEGORIES };

export function getTemplateById(id: string): WorkoutTemplate | undefined {
  return ALL_WORKOUT_TEMPLATES.find((t) => t.id === id);
}

export function getWorkoutsByCategory(category: WorkoutCategory): WorkoutTemplate[] {
  return WORKOUT_LIBRARY[category] ?? [];
}

/** All library templates that include the given tag (case-sensitive). */
export function getWorkoutsByTag(tag: string): WorkoutTemplate[] {
  return ALL_WORKOUT_TEMPLATES.filter((t) => t.tags.includes(tag));
}

/** @deprecated Use getTemplateById */
export const getWorkoutById = getTemplateById;
