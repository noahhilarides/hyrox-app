import type { OnboardingWeakness } from '@/types/onboarding';
import type { HyroxStation } from '@/types/session';

const WEAKNESS_TO_STATION: Partial<Record<OnboardingWeakness, HyroxStation>> = {
  ski_erg: 'ski_erg',
  sled_push: 'sled_push',
  sled_pull: 'sled_pull',
  burpees: 'burpee_broad_jump',
  grip_fatigue: 'farmers_carry',
  wall_balls: 'wall_balls',
  lunges: 'lunges',
  rowing: 'row',
};

/** Maps onboarding weakness selections to HYROX station tags for conditioning bias. */
export function onboardingWeaknessesToStations(
  weaknesses: OnboardingWeakness[]
): HyroxStation[] {
  const seen = new Set<HyroxStation>();
  const stations: HyroxStation[] = [];

  for (const weakness of weaknesses) {
    const station = WEAKNESS_TO_STATION[weakness];
    if (station && !seen.has(station)) {
      seen.add(station);
      stations.push(station);
    }
  }

  return stations;
}
