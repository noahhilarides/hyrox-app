import type { PerformanceSessionKind } from '@/constants/performance-training';
import { beginnerRunnerRunVariant } from '@/lib/coaching-engine/beginner-runner-protection';
import { isBeginnerRunner } from '@/lib/profile-levels';
import { isPerformanceTrainingGoal } from '@/lib/performance-training';
import type { WeekPhase } from '@/lib/recovery-prescription';
import type { OnboardingProfile, WorkoutType, Weakness } from '@/types';
import type { WorkoutCategory } from '@/types/workout';

import {
  weaknessToConditioningVariant,
  weaknessToStationVariant,
} from './weakness-balancing';
import { strengthSlotIsUpper } from './strength-assignment';

export interface SlotResolveContext {
  phase: WeekPhase;
  isLongRun: boolean;
  forceRaceSim: boolean;
  /** 0-based count of strength sessions already placed this week */
  strengthIndex: number;
  /** Plan week index — beginner run caps and variant guards. */
  weekIndex?: number;
  performanceKind?: PerformanceSessionKind;
  /** Rotated weakness target for this session (limits scoring + variant). */
  targetWeakness?: Weakness;
  /** Set when fatigue management swapped this session to a lighter option. */
  fatigueAdjusted?: boolean;
  /** Set when consecutive-day or load rules require upper strength. */
  forceUpperStrength?: boolean;
}

export interface ResolvedSlot {
  category: WorkoutCategory;
  variant?: string;
  workoutType: WorkoutType;
}

const PERFORMANCE_KIND_MAP: Record<PerformanceSessionKind, ResolvedSlot> = {
  upper_strength: { category: 'strength_upper', variant: 'performance', workoutType: 'strength' },
  lower_strength: { category: 'strength_lower', variant: 'performance', workoutType: 'strength' },
  full_body_strength: {
    category: 'full_body_strength',
    variant: 'performance',
    workoutType: 'strength',
  },
  easy_run: { category: 'running', variant: 'easy', workoutType: 'run' },
  long_aerobic: { category: 'running', variant: 'long', workoutType: 'run' },
  speed_work: { category: 'running', variant: 'speed', workoutType: 'speed' },
  conditioning: { category: 'conditioning', variant: 'performance', workoutType: 'conditioning' },
};

export function resolveSlot(
  workoutType: WorkoutType,
  profile: OnboardingProfile,
  ctx: SlotResolveContext
): ResolvedSlot {
  if (ctx.performanceKind) {
    return PERFORMANCE_KIND_MAP[ctx.performanceKind];
  }

  if (workoutType === 'recovery') {
    return { category: 'recovery', workoutType: 'recovery' };
  }

  if (workoutType === 'race_sim') {
    return { category: 'hyrox', variant: 'simulation', workoutType: 'race_sim' };
  }

  if (workoutType === 'hyrox') {
    const variant = ctx.targetWeakness
      ? weaknessToStationVariant(ctx.targetWeakness)
      : legacyHyroxVariant(profile.weaknesses);
    return { category: 'hyrox', variant, workoutType: 'hyrox' };
  }

  if (workoutType === 'skills') {
    const variant = ctx.targetWeakness
      ? weaknessToStationVariant(ctx.targetWeakness)
      : legacySkillVariant(profile.weaknesses);
    return { category: 'hyrox', variant, workoutType: 'skills' };
  }

  if (workoutType === 'conditioning') {
    const variant = ctx.targetWeakness
      ? weaknessToConditioningVariant(ctx.targetWeakness)
      : profile.weaknesses.includes('burpees')
        ? 'burpee'
        : 'standard';
    return { category: 'conditioning', variant, workoutType: 'conditioning' };
  }

  if (workoutType === 'speed') {
    const beginner = isBeginnerRunner(profile);
    if (beginner) return { category: 'running', variant: 'speed', workoutType: 'speed' };
    if (ctx.phase === 'taper') return { category: 'running', variant: 'speed', workoutType: 'speed' };
    return { category: 'running', variant: 'speed', workoutType: 'speed' };
  }

  if (workoutType === 'run') {
    const beginner = isBeginnerRunner(profile);
    const weekIndex = ctx.weekIndex ?? 0;

    if (ctx.isLongRun) {
      const variant = beginner
        ? beginnerRunnerRunVariant('long', true, weekIndex)
        : 'long';
      return {
        category: 'running',
        variant,
        workoutType: 'run',
      };
    }
    if (beginner) {
      const phaseVariant =
        ctx.phase === 'taper' || ctx.phase === 'base'
          ? 'easy'
          : ctx.phase === 'peak'
            ? 'tempo'
            : 'tempo';
      return {
        category: 'running',
        variant: beginnerRunnerRunVariant(phaseVariant, false, weekIndex),
        workoutType: 'run',
      };
    }
    if (ctx.phase === 'taper') {
      return { category: 'running', variant: 'easy', workoutType: 'run' };
    }
    if (ctx.phase === 'base') {
      return { category: 'running', variant: 'easy', workoutType: 'run' };
    }
    if (ctx.phase === 'build') {
      return { category: 'running', variant: 'tempo', workoutType: 'run' };
    }
    if (ctx.phase === 'peak') {
      return { category: 'running', variant: 'tempo', workoutType: 'run' };
    }
    return { category: 'running', variant: 'easy', workoutType: 'run' };
  }

  if (workoutType === 'strength') {
    if (isPerformanceTrainingGoal(profile.goal)) {
      return { category: 'strength_lower', variant: 'performance', workoutType: 'strength' };
    }
    const upper = strengthSlotIsUpper(ctx) || ctx.forceUpperStrength === true;
    if (ctx.phase === 'taper' && !ctx.forceUpperStrength) {
      return { category: 'strength_lower', variant: 'maintenance', workoutType: 'strength' };
    }
    if (ctx.phase === 'taper' && ctx.forceUpperStrength) {
      return { category: 'strength_upper', variant: 'maintenance', workoutType: 'strength' };
    }
    return {
      category: upper ? 'strength_upper' : 'strength_lower',
      variant: 'standard',
      workoutType: 'strength',
    };
  }

  return { category: 'conditioning', variant: 'standard', workoutType: 'conditioning' };
}

function legacyHyroxVariant(weaknesses: Weakness[]): string {
  if (weaknesses.includes('sleds')) return 'sled';
  return 'stations';
}

function legacySkillVariant(weaknesses: Weakness[]): string {
  if (weaknesses.includes('sleds')) return 'sled';
  if (weaknesses.includes('rowing')) return 'row';
  if (weaknesses.includes('burpees')) return 'burpee';
  return 'stations';
}

/** Picks generator template variant for strength_lower from profile context. */
export function strengthLowerVariant(
  profile: OnboardingProfile,
  phase: WeekPhase
): string {
  if (phase === 'taper') return 'maintenance';
  if (phase === 'peak' && profile.strengthExperience !== 'none') {
    return profile.strengthExperience === 'regular' || profile.strengthExperience === 'competitive'
      ? 'heavy'
      : 'standard';
  }
  if (profile.strengthExperience === 'none' || profile.fitnessLevel === 'beginner') {
    return 'standard';
  }
  return 'standard';
}

export function runVariantForContext(
  profile: OnboardingProfile,
  ctx: SlotResolveContext
): string {
  const slot = resolveSlot('run', profile, ctx);
  return slot.variant ?? 'easy';
}

export function speedVariantForContext(
  profile: OnboardingProfile,
  ctx: SlotResolveContext
): string {
  if (isBeginnerRunner(profile)) return 'speed';
  if (ctx.phase === 'taper') return 'speed';
  if (ctx.phase === 'peak') return 'speed';
  return 'speed';
}

export function hyroxSimulationVariant(profile: OnboardingProfile): string {
  return profile.strengthExperience === 'regular' || profile.strengthExperience === 'competitive'
    ? 'simulation'
    : 'simulation';
}
