import type { HyroxStationKey } from '@/constants/hyrox-station-cues';

const TAG_TO_STATION: Record<string, HyroxStationKey> = {
  running: 'running',
  hyrox_run: 'running',
  compromised_running: 'running',
  ski_erg: 'ski_erg',
  rowing: 'row',
  sled_push: 'sled_push',
  sled_pull: 'sled_pull',
  wall_ball: 'wall_ball',
  burpees: 'burpee',
  farmer_carry: 'farmer_carry',
  carry: 'farmer_carry',
  lunges: 'lunge',
  walking: 'running',
};

/** Infer which HYROX station cue blocks apply from workout tags. */
export function inferStationKeysFromTags(tags: string[]): HyroxStationKey[] {
  const keys = new Set<HyroxStationKey>();
  for (const tag of tags) {
    const key = TAG_TO_STATION[tag];
    if (key) keys.add(key);
  }
  return [...keys];
}
