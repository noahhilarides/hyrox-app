import type { OnboardingProfile, Weakness, WorkoutType } from '@/types';

/** Weaknesses that steer hyrox / skills / conditioning slot variants. */
export const STATION_WEAKNESS_ORDER: readonly Weakness[] = [
  'sleds',
  'wall_balls',
  'burpees',
  'rowing',
] as const;

export type WeaknessExposureState = Partial<Record<Weakness, number>>;

/** Per-week station focus tracking (exposure counts + no duplicate focus). */
export type StationFocusWeekState = {
  exposure: WeaknessExposureState;
  /** Station weaknesses already targeted this calendar week — max once each. */
  focusUsedThisWeek: Weakness[];
};

export function createWeaknessExposureState(): WeaknessExposureState {
  return {};
}

export function createStationFocusWeekState(): StationFocusWeekState {
  return { exposure: createWeaknessExposureState(), focusUsedThisWeek: [] };
}

export function recordWeaknessExposure(
  state: WeaknessExposureState,
  weakness: Weakness
): void {
  state[weakness] = (state[weakness] ?? 0) + 1;
}

export function recordStationFocusForWeek(
  weekState: StationFocusWeekState,
  weakness: Weakness | undefined
): void {
  if (!weakness) return;
  recordWeaknessExposure(weekState.exposure, weakness);
  if (!weekState.focusUsedThisWeek.includes(weakness)) {
    weekState.focusUsedThisWeek.push(weakness);
  }
}

/** Max times one weakness may be targeted in a week (50% of station-focused slots). */
export function maxWeaknessExposurePerWeek(stationFocusSlotCount: number): number {
  if (stationFocusSlotCount <= 0) return 0;
  return Math.max(1, Math.ceil(stationFocusSlotCount * 0.5));
}

export function stationWeaknessCandidates(weaknesses: Weakness[]): Weakness[] {
  return STATION_WEAKNESS_ORDER.filter((w) => weaknesses.includes(w));
}

export function isStationWeaknessSlot(workoutType: WorkoutType): boolean {
  return workoutType === 'hyrox' || workoutType === 'skills' || workoutType === 'conditioning';
}

/** Count hyrox/skills/conditioning slots in the weekly template that rotate weaknesses. */
export function countStationWeaknessSlots(
  weeklyTypes: WorkoutType[],
  profile: OnboardingProfile
): number {
  if (stationWeaknessCandidates(profile.weaknesses).length === 0) return 0;
  return weeklyTypes.filter((t) => isStationWeaknessSlot(t)).length;
}

/**
 * Pick the weakness to target for this session — lowest exposure first, then rotate.
 * No weakness may exceed 50% of station-focused sessions in the week.
 */
export function pickStationTargetWeakness(
  profile: OnboardingProfile,
  weekState: StationFocusWeekState,
  stationFocusSlotCount: number,
  weekIndex: number,
  dayIndex: number
): Weakness | undefined {
  const candidates = stationWeaknessCandidates(profile.weaknesses);
  if (candidates.length === 0) return undefined;

  const exposure = weekState.exposure;
  const { focusUsedThisWeek } = weekState;

  if (candidates.length === 1) {
    if (focusUsedThisWeek.includes(candidates[0]!)) return undefined;
    return candidates[0];
  }

  const maxPer = maxWeaknessExposurePerWeek(stationFocusSlotCount);
  const eligible = candidates.filter((w) => (exposure[w] ?? 0) < maxPer);
  const pool = eligible.length > 0 ? eligible : candidates;

  const varietyPool = pool.filter((w) => !focusUsedThisWeek.includes(w));
  if (varietyPool.length === 0) {
    return undefined;
  }

  const rotateOffset = (weekIndex * 7 + dayIndex) % candidates.length;

  const sorted = [...varietyPool].sort((a, b) => {
    const countDiff = (exposure[a] ?? 0) - (exposure[b] ?? 0);
    if (countDiff !== 0) return countDiff;

    const ai = candidates.indexOf(a);
    const bi = candidates.indexOf(b);
    const aRot = (ai - rotateOffset + candidates.length) % candidates.length;
    const bRot = (bi - rotateOffset + candidates.length) % candidates.length;
    return aRot - bRot;
  });

  return sorted[0];
}

/** Maps a targeted weakness to hyrox/skills slot variant hints. */
export function weaknessToStationVariant(weakness: Weakness): string {
  switch (weakness) {
    case 'sleds':
      return 'sled';
    case 'wall_balls':
      return 'stations';
    case 'burpees':
      return 'burpee';
    case 'rowing':
      return 'row';
    default:
      return 'stations';
  }
}

/** Conditioning variant when rotating station weaknesses. */
export function weaknessToConditioningVariant(weakness: Weakness): string {
  return weakness === 'burpees' ? 'burpee' : 'standard';
}
