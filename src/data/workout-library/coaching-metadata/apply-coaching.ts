import type { WorkoutTemplate, WorkoutTemplateDraft } from '@/types/workout';

import { resolveCoaching } from './resolve';

type TemplateInput = WorkoutTemplateDraft &
  Partial<
    Pick<WorkoutTemplate, 'progressionNotes' | 'coachingCues' | 'substitutionGuidance' | 'rpeGuidance'>
  >;

function sessionTextFromTemplate(t: TemplateInput): string {
  return t.workoutBlocks.map((b) => b.detail).join('\n');
}

export function attachCoachingToTemplates(templates: TemplateInput[]): WorkoutTemplate[] {
  return templates.map((t) => {
    const sessionText = sessionTextFromTemplate(t);
    const coaching = resolveCoaching({
      id: t.id,
      category: t.category,
      difficulty: t.difficulty,
      variant: t.variant,
      tags: t.tags ?? [],
      duration: t.duration,
      equipment: t.equipment,
      sessionText,
    });

    const hasProgression = Boolean(t.progressionNotes?.trim());
    const hasSubs = Boolean(t.substitutionGuidance?.trim());
    const hasCues = (t.coachingCues?.length ?? 0) > 0;

    return {
      ...t,
      tags: t.tags ?? [],
      progressionNotes: hasProgression ? t.progressionNotes! : coaching.progressionNotes,
      coachingCues: hasCues ? t.coachingCues! : coaching.coachingCues,
      substitutionGuidance: hasSubs ? t.substitutionGuidance! : coaching.substitutionGuidance,
      rpeGuidance: t.rpeGuidance ?? coaching.rpeGuidance,
    };
  });
}
