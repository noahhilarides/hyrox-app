import {
  beginnerRunnerMaxDurationMinutes,
  isBeginnerRunner,
} from '@/lib/coaching-engine/beginner-runner-protection';
import type { OnboardingProfile, Workout, WorkoutType, Weakness } from '@/types';
import type { WorkoutTemplate } from '@/types/workout';

import type { WeekPhase } from '@/lib/recovery-prescription';
import type { WeekProgressionState } from '@/lib/plan-progression';

import { applyTemplateProgression } from './progression';
import {
  selectWorkoutTemplate,
  type TemplateSelectContext,
  type TemplateUsage,
} from './select-template';
import type { ResolvedSlot, SlotResolveContext } from './slot-resolve';
import { resolveSlot } from './slot-resolve';

const PHASE_LABEL: Record<WeekPhase, string> = {
  base: 'Base',
  build: 'Build',
  peak: 'Peak',
  taper: 'Taper',
};

const WEAKNESS_FOCUS: Record<Weakness, string> = {
  running: 'Compromised running',
  sleds: 'Sled endurance',
  burpees: 'Burpee broad jump',
  rowing: 'Rowing power',
  wall_balls: 'Walking lunges',
  endurance: 'Race pacing',
  recovery: 'Session recovery',
  strength: 'Grip & carries',
};

export interface AssembleContext extends TemplateSelectContext {
  date: string;
  index: number;
  slotContext: SlotResolveContext;
  weekProgression: WeekProgressionState;
}

export type { TemplateUsage };

function focusTags(template: WorkoutTemplate, profile: OnboardingProfile): string[] {
  const boosted = profile.weaknesses
    .filter((w) => {
      const map: Partial<Record<Weakness, string[]>> = {
        running: ['running'],
        sleds: ['hyrox'],
        burpees: ['conditioning', 'hyrox'],
        rowing: ['hyrox'],
        wall_balls: ['strength_lower', 'hyrox'],
        endurance: ['running'],
        strength: ['strength_upper', 'strength_lower', 'full_body_strength'],
      };
      return map[w]?.includes(template.category);
    })
    .map((w) => WEAKNESS_FOCUS[w]);
  return [...new Set([...boosted, ...template.focus])].slice(0, 4);
}

function coachNoteFor(
  template: WorkoutTemplate,
  profile: OnboardingProfile,
  weekIndex: number,
  weekProgression: WeekProgressionState
): string {
  if (template.category === 'running' && template.variant === 'easy') {
    return isBeginnerRunner(profile)
      ? 'Walk breaks are part of the plan. Consistency beats hero miles.'
      : 'Keep this controlled. Hybrid training wins when easy days stay truly easy.';
  }
  if (template.category === 'hyrox' && template.variant === 'simulation') {
    return 'Treat this like a dress rehearsal — nail transitions, not hero splits.';
  }
  if (template.category === 'strength_lower') {
    return 'Stop 1–2 reps shy of failure. We need your legs fresh for tomorrow.';
  }
  if (template.category === 'recovery') {
    return 'Coach-prescribed recovery — absorb training stress so hard days stay productive.';
  }
  if (weekProgression?.isRecoveryWeek) {
    return 'Recovery week — volume is reduced 30–40% so you absorb recent training before the next build.';
  }
  if (template.category === 'conditioning') {
    return 'Smooth is fast. Focus on consistent splits, not redlining round one.';
  }
  return 'Execute with intent — this session fits the bigger picture of your block.';
}

function coachNoteForFatigueSwap(
  template: WorkoutTemplate,
  profile: OnboardingProfile,
  weekIndex: number,
  weekProgression: WeekProgressionState,
  ctx: AssembleContext
): string | undefined {
  if (!ctx.slotContext.fatigueAdjusted) return undefined;
  if (template.category === 'recovery') {
    return 'Adjusted for leg recovery — absorb load from the last few days so quality stays high.';
  }
  if (template.category === 'running' && template.variant === 'easy') {
    return 'Easy aerobic day — legs needed a break from stacked lower-body and station work.';
  }
  if (template.category === 'strength_upper') {
    return 'Upper-body focus today — keeps training momentum while legs recover.';
  }
  return coachNoteFor(template, profile, weekIndex, weekProgression);
}

function profileForTemplateSelection(
  profile: OnboardingProfile,
  targetWeakness?: Weakness
): OnboardingProfile {
  if (!targetWeakness) return profile;
  return { ...profile, weaknesses: [targetWeakness] };
}

export function assembleFromResolvedSlot(
  resolved: ResolvedSlot,
  profile: OnboardingProfile,
  ctx: AssembleContext
): Workout {
  const selectionProfile = profileForTemplateSelection(
    profile,
    ctx.slotContext.targetWeakness
  );
  const template = selectWorkoutTemplate(
    resolved.category,
    resolved.variant,
    selectionProfile,
    ctx
  );
  const progressed = applyTemplateProgression(template, profile, ctx.weekIndex, ctx, {
    weekProgression: ctx.weekProgression,
    isLongRunSlot: ctx.slotContext.isLongRun,
  });

  const phaseLabel = PHASE_LABEL[ctx.phase];

  return {
    id: `${ctx.date}-${resolved.workoutType}-${ctx.index}`,
    date: ctx.date,
    type: resolved.workoutType as WorkoutType,
    libraryTemplateId: progressed.id,
    title: progressed.name,
    subtitle: `${phaseLabel} phase · ${progressed.description}`,
    durationMinutes: (() => {
      const prefLen = Number(profile.workoutLength) || progressed.duration;
      let minutes =
        progressed.variant === 'long'
          ? Math.max(ctx.weekProgression.longRunMinutes, prefLen, progressed.duration)
          : Math.min(prefLen, progressed.duration);
      if (isBeginnerRunner(profile) && progressed.category === 'running') {
        minutes = Math.min(minutes, beginnerRunnerMaxDurationMinutes(ctx.weekIndex));
      }
      return minutes;
    })(),
    focus: focusTags(progressed, profile),
    exercises: progressed.workoutBlocks.map((b) => ({
      name: b.name,
      detail: b.detail,
    })),
    coachNote:
      coachNoteForFatigueSwap(progressed, profile, ctx.weekIndex, ctx.weekProgression, ctx) ??
      coachNoteFor(progressed, profile, ctx.weekIndex, ctx.weekProgression),
    completed: false,
    missed: false,
  };
}

export function assembleScheduledWorkout(
  workoutType: WorkoutType,
  profile: OnboardingProfile,
  ctx: AssembleContext
): Workout {
  const resolved = resolveSlot(workoutType, profile, ctx.slotContext);
  return assembleFromResolvedSlot(resolved, profile, ctx);
}
