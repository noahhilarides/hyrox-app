import type { HyroxStationKey } from '@/constants/hyrox-station-cues';

/** Shared opener — every workout gets this unless overridden. */
export const SUBSTITUTION_PREAMBLE =
  'Match the written effort, rest, and rep scheme. Substitutions are for missing equipment, not to make the session easier.';

export const STATION_SUBSTITUTIONS: Record<HyroxStationKey, string> = {
  running:
    'No treadmill needed outdoors. Treadmill: set 1% incline for easy/tempo work. Bike or row: use 1 min hard ≈ 200 m run as a rough swap in mixed sessions.',
  ski_erg:
    'No SkiErg: row the same distance/time at the same RPE. Bike: 2 min moderate ≈ 500 m ski in conditioning blocks.',
  row:
    'No rower: SkiErg same distance/time, or bike 90 sec moderate per 500 m row in metcons.',
  sled_push:
    'No sled: heavy walking lunges (20–24 steps) or plate push on turf. Match leg burn, not exact meters.',
  sled_pull:
    'No sled: heavy bent-over row or chest-supported row, 3×8–10 @ RPE 8, same rest as written sled pulls.',
  wall_ball:
    'No wall ball: sandbag thrusters or goblet squat to press, same reps, controlled tempo.',
  burpee:
    'Step-back burpees or box burpees count. Keep full range of motion and the same rep total.',
  farmer_carry:
    'No implements: suitcase carry (DB/KB) same distance each hand, or sandbag bear-hug carry.',
  lunge:
    'Walking or reverse lunges with bodyweight or DBs. Count total steps to match prescribed lunge volume.',
};

export const CATEGORY_SUBSTITUTION_DEFAULTS: Record<string, string> = {
  recovery:
    'Any easy modality (walk, bike, row, swim) at the same duration and RPE 3–4 is fine.',
  strength:
    'Barbell ↔ dumbbells at similar RPE. No rack: goblet or DB variants for squats and presses.',
  conditioning:
    'In AMRAPs/EMOMs, swap stations but keep work/rest intervals identical.',
};
