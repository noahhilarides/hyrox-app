import {
  LONG_RUN_PROGRESSION,
  RECOVERY_WEEK_RULES,
  SKI_ERG_PROGRESSION,
  SLED_PROGRESSION,
  WALL_BALL_PROGRESSION,
} from '@/constants/workout-progression-rules';
import type { WeekPhase } from '@/lib/recovery-prescription';
import { weekPhase } from '@/lib/recovery-prescription';
import { isAdvancedRunner } from '@/lib/profile-levels';
import type { OnboardingProfile } from '@/types';

export interface WeekProgressionState {
  weekIndex: number;
  totalWeeks: number;
  phase: WeekPhase;
  isRecoveryWeek: boolean;
  /** 1.0 = normal; ~0.65 on recovery weeks (30–40% volume reduction). */
  volumeMultiplier: number;
  longRunMinutes: number;
  wallBallReps: number;
  skiErgMeters: number;
  skiErgRounds: number;
  sledSets: number;
  sledDistanceM: number;
  sledPhase: 'volume' | 'intensity';
}

export function isPlanRecoveryWeek(
  weekIndex: number,
  profile: OnboardingProfile
): boolean {
  if (weekIndex === 0) return false;

  // Only deload on plans long enough to need it, and not in the first 4 weeks
  if (weekIndex < 4) return false;
  return (weekIndex + 1) % RECOVERY_WEEK_RULES.cycleWeeks === 0;
}

function longRunMinutesForWeek(weekIndex: number, profile: OnboardingProfile): number {
  const { baseMinutes, incrementMinutesMin, incrementMinutesMax, cadenceWeeks, maxMinutes } =
    LONG_RUN_PROGRESSION;

  let minutes = baseMinutes;
  for (let w = 1; w <= weekIndex; w++) {
    const isMaxWeek = w % cadenceWeeks === 0;
    minutes += isMaxWeek ? incrementMinutesMax : incrementMinutesMin;
  }

  const cap = isAdvancedRunner(profile)
    ? maxMinutes
    : Math.min(maxMinutes, Number(profile.workoutLength) + 25);

  return Math.min(cap, minutes);
}

function wallBallRepsForWeek(weekIndex: number): number {
  const { baseReps, repsIncrement, incrementEveryWeeks, maxReps } = WALL_BALL_PROGRESSION;
  const steps = Math.floor(weekIndex / incrementEveryWeeks);
  return Math.min(maxReps, baseReps + steps * repsIncrement);
}

function skiErgForWeek(weekIndex: number): { meters: number; rounds: number } {
  const {
    baseMeters,
    metersIncrement,
    maxMeters,
    baseRounds,
    roundsIncrement,
    roundsIncrementEveryWeeks,
    maxRounds,
  } = SKI_ERG_PROGRESSION;

  const meterSteps = Math.floor(weekIndex / 2) + (weekIndex % 2 === 1 ? 1 : 0);
  const meters = Math.min(maxMeters, baseMeters + meterSteps * metersIncrement);

  const roundSteps = Math.floor(weekIndex / roundsIncrementEveryWeeks);
  const rounds = Math.min(maxRounds, baseRounds + roundSteps * roundsIncrement);

  return { meters, rounds };
}

function sledForWeek(weekIndex: number): {
  sets: number;
  distanceM: number;
  phase: 'volume' | 'intensity';
} {
  const {
    baseSets,
    maxSets,
    setIncrementEveryWeeks,
    baseDistanceM,
    distanceIncrementM,
    maxDistanceM,
    intensityAfterBlockWeek,
  } = SLED_PROGRESSION;

  const blockWeek = weekIndex % RECOVERY_WEEK_RULES.cycleWeeks;
  const setSteps = Math.floor(weekIndex / setIncrementEveryWeeks);
  const sets = Math.min(maxSets, baseSets + setSteps);

  const distanceSteps = Math.floor(weekIndex / setIncrementEveryWeeks);
  const distanceM = Math.min(maxDistanceM, baseDistanceM + distanceSteps * distanceIncrementM);

  const phase: 'volume' | 'intensity' =
    blockWeek >= intensityAfterBlockWeek ? 'intensity' : 'volume';

  return { sets, distanceM, phase };
}

/** Computes numeric targets for a plan week — used by plan-generator and template progression. */
export function computeWeekProgression(
  weekIndex: number,
  totalWeeks: number,
  profile: OnboardingProfile
): WeekProgressionState {
  const phase = weekPhase(weekIndex, totalWeeks);
  const isRecoveryWeek = isPlanRecoveryWeek(weekIndex, profile);
  const volumeMultiplier = isRecoveryWeek ? RECOVERY_WEEK_RULES.volumeMultiplier : 1;

  const ski = skiErgForWeek(weekIndex);
  const sled = sledForWeek(weekIndex);

  let longRunMinutes = longRunMinutesForWeek(weekIndex, profile);
  let wallBallReps = wallBallRepsForWeek(weekIndex);
  let skiErgMeters = ski.meters;
  let skiErgRounds = ski.rounds;
  let sledSets = sled.sets;
  let sledDistanceM = sled.distanceM;
  let sledPhase = isRecoveryWeek ? 'volume' : sled.phase;

  if (isRecoveryWeek) {
    longRunMinutes = Math.round(longRunMinutes * volumeMultiplier);
    wallBallReps = Math.max(
      WALL_BALL_PROGRESSION.baseReps,
      Math.round(wallBallReps * volumeMultiplier)
    );
    skiErgMeters = Math.max(
      SKI_ERG_PROGRESSION.baseMeters,
      Math.round(skiErgMeters * volumeMultiplier)
    );
    skiErgRounds = Math.max(3, Math.round(skiErgRounds * volumeMultiplier));
    sledSets = Math.max(SLED_PROGRESSION.baseSets, Math.round(sledSets * volumeMultiplier));
    sledDistanceM = Math.max(
      SLED_PROGRESSION.baseDistanceM,
      Math.round(sledDistanceM * volumeMultiplier)
    );
  }

  return {
    weekIndex,
    totalWeeks,
    phase,
    isRecoveryWeek,
    volumeMultiplier,
    longRunMinutes,
    wallBallReps,
    skiErgMeters,
    skiErgRounds,
    sledSets,
    sledDistanceM,
    sledPhase,
  };
}
