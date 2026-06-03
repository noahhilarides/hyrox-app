import { PERFORMANCE_BLOCK_WEEKS } from '@/constants/performance-training';
import type { OnboardingProfile } from '@/types';

export interface PerformanceBlock {
  /** 0–3 within a 4-week mesocycle */
  blockWeek: number;
  isDeload: boolean;
  easyRunMinutes: number;
  longAerobicMinutes: number;
  strengthWorkingSets: number;
  strengthLoadCue: string;
  intervalMain: string;
  conditioningRounds: number;
}

export function blockWeekIndex(weekIndex: number): number {
  return weekIndex % PERFORMANCE_BLOCK_WEEKS;
}

export function getPerformanceBlock(
  weekIndex: number,
  profile: OnboardingProfile
): PerformanceBlock {
  const blockWeek = blockWeekIndex(weekIndex);
  const isDeload = blockWeek === PERFORMANCE_BLOCK_WEEKS - 1;
  const sessionCap = Number(profile.workoutLength);

  const easyRunMinutes = isDeload
    ? 30 + blockWeek * 5
    : Math.min(sessionCap, 30 + blockWeek * 5);

  const longBase = sessionCap >= 75 ? 75 : sessionCap >= 60 ? 60 : 45;
  const longAerobicMinutes = isDeload
    ? longBase
    : Math.min(90, longBase + blockWeek * 8);

  const strengthWorkingSets = isDeload ? 3 : blockWeek === 0 ? 3 : 4;
  const strengthLoadCue = isDeload
    ? 'RPE 6–7 — leave 3 reps in reserve'
    : blockWeek === 2
      ? 'Add load from last week @ RPE 7–8'
      : 'RPE 7 — controlled tempo';

  const intervalPresets = [
    '6 × 400m @ 5K effort, 90 sec jog recovery',
    '8 × 400m @ 5K effort, 90 sec jog recovery',
    '5 × 800m @ 10K effort, 2 min jog recovery',
    '5 × 400m @ steady-hard, full walk-back recovery',
  ];
  const intervalMain = intervalPresets[blockWeek]!;

  const conditioningRounds = isDeload ? 3 : 4;

  return {
    blockWeek,
    isDeload,
    easyRunMinutes,
    longAerobicMinutes,
    strengthWorkingSets,
    strengthLoadCue,
    intervalMain,
    conditioningRounds,
  };
}
