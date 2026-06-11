import { isAdvancedRunner } from '@/lib/profile-levels';
import {
  applyWeekProgressionToTemplate,
  type WeekProgressionState,
} from '@/lib/plan-progression';
import type { OnboardingProfile } from '@/types';
import type { WorkoutTemplate } from '@/types/workout';

import type { TemplateSelectContext } from './select-template';

export interface TemplateProgressionOptions {
  weekProgression: WeekProgressionState;
  isLongRunSlot?: boolean;
}

/** Week-over-week tweaks for library templates using plan progression rules. */
export function applyTemplateProgression(
  template: WorkoutTemplate,
  profile: OnboardingProfile,
  weekIndex: number,
  _ctx: TemplateSelectContext,
  options: TemplateProgressionOptions
): WorkoutTemplate {
  return applyWeekProgressionToTemplate(template, options.weekProgression, {
    isLongRunSlot: options.isLongRunSlot,
    advancedRunner: isAdvancedRunner(profile),
  });
}
