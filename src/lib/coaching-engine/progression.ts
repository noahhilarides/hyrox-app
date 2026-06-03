import { getPerformanceBlock } from '@/lib/performance-training/progression';
import { isPerformanceTrainingGoal } from '@/lib/performance-training';
import { isAdvancedRunner } from '@/lib/profile-levels';
import {
  applyWeekProgressionToTemplate,
  type WeekProgressionState,
} from '@/lib/plan-progression';
import type { OnboardingProfile } from '@/types';
import type { WorkoutTemplate } from '@/types/workout';

import type { TemplateSelectContext } from './select-template';

function cloneTemplate(template: WorkoutTemplate): WorkoutTemplate {
  return {
    ...template,
    focus: [...template.focus],
    workoutBlocks: template.workoutBlocks.map((b) => ({ ...b })),
  };
}

function replaceInBlocks(
  template: WorkoutTemplate,
  replacements: Record<string, string>
): WorkoutTemplate {
  const workoutBlocks = template.workoutBlocks.map((block) => {
    let detail = block.detail;
    for (const [key, value] of Object.entries(replacements)) {
      detail = detail.split(key).join(value);
    }
    return { ...block, detail };
  });
  return { ...template, workoutBlocks };
}

function applyPerformanceProgression(
  template: WorkoutTemplate,
  profile: OnboardingProfile,
  weekIndex: number,
  weekProgression: WeekProgressionState
): WorkoutTemplate {
  const block = getPerformanceBlock(weekIndex, profile);
  const barbell = profile.equipment.includes('full_gym');
  const rowPiece =
    profile.equipment.includes('rower') || profile.equipment.includes('full_gym')
      ? '500m row'
      : '2 min bike or 400m run';

  let name = template.name;
  if (block.isDeload && !name.includes('deload')) {
    name = `${name} — deload`;
  }

  const replacements: Record<string, string> = {
    '{{SETS}}': String(block.strengthWorkingSets),
    '{{LOAD_CUE}}': block.strengthLoadCue,
    '{{EASY_RUN_MINUTES}}': String(block.easyRunMinutes),
    '{{LONG_AEROBIC_MINUTES}}': String(block.longAerobicMinutes),
    '{{INTERVAL_MAIN}}': block.intervalMain,
    '{{CONDITIONING_ROUNDS}}': String(block.conditioningRounds),
    '{{ROW_PIECE}}': rowPiece,
    '{{SQUAT_PATTERN}}': barbell
      ? `Back Squat — ${block.strengthWorkingSets} × 5 @ ${block.strengthLoadCue}`
      : `Goblet Squat — ${block.strengthWorkingSets} × 8 @ ${block.strengthLoadCue}`,
    '{{PRIMARY_LIFT}}': barbell
      ? `Back Squat ${block.strengthWorkingSets}×5 + Bench ${block.strengthWorkingSets}×6 @ ${block.strengthLoadCue}`
      : `Goblet squat ${block.strengthWorkingSets}×8 + DB press ${block.strengthWorkingSets}×10`,
  };

  const progressed = replaceInBlocks(cloneTemplate(template), replacements);
  return applyWeekProgressionToTemplate(
    { ...progressed, name, duration: template.duration },
    weekProgression,
    { advancedRunner: isAdvancedRunner(profile) }
  );
}

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
  if (isPerformanceTrainingGoal(profile.goal)) {
    return applyPerformanceProgression(
      template,
      profile,
      weekIndex,
      options.weekProgression
    );
  }

  return applyWeekProgressionToTemplate(template, options.weekProgression, {
    isLongRunSlot: options.isLongRunSlot,
    advancedRunner: isAdvancedRunner(profile),
  });
}
