import type { WorkoutCategory } from '@/types/workout';

const CATEGORY_LABELS: Record<WorkoutCategory, string> = {
  running: 'Running',
  strength_upper: 'Strength — upper',
  strength_lower: 'Strength — lower',
  full_body_strength: 'Full body strength',
  hyrox: 'HYROX',
  conditioning: 'Conditioning',
  recovery: 'Recovery',
};

export function formatLibraryCategory(category: WorkoutCategory): string {
  return CATEGORY_LABELS[category] ?? category;
}
