import type {
  ConditioningFormat,
  HyroxStation,
  Movement,
  SessionType,
  StrengthFocus,
} from '@/types/session';

/** A conditioning piece template — movements scale via progression at compose time. */
export interface ConditioningPiece {
  id: string;
  format: ConditioningFormat;
  /** Top-line instruction, e.g. "4 rounds for time" or "Every 2 min x5". */
  prescriptionNote: string;
  /** Movements with base prescriptions; reps/distance scaled later. */
  movements: Movement[];
  /** Session types this piece is appropriate for. */
  fitsTypes: SessionType[];
}

/**
 * Conditioning piece menu. Pieces rotate by week for variety; the composer scales
 * reps/distance using the existing progression engine. Station tags drive weekly
 * coverage so ski/sled/row/wall ball/burpee/lunge/carry all appear across a week.
 */
export const CONDITIONING_PIECES: ConditioningPiece[] = [
  // --- EXPRESS (short, steady, 20-30 min) ---
  {
    id: 'cond-express-run-ski',
    format: 'rounds',
    prescriptionNote: '4 rounds, steady pace',
    movements: [
      { name: 'Run', prescription: '400m' },
      { name: 'SkiErg', prescription: '250m', station: 'ski_erg' },
    ],
    fitsTypes: ['express'],
  },
  {
    id: 'cond-express-row-wallball',
    format: 'rounds',
    prescriptionNote: '4 rounds, steady pace',
    movements: [
      { name: 'Row', prescription: '250m', station: 'row' },
      { name: 'Wall Balls', prescription: '15 reps', station: 'wall_balls' },
    ],
    fitsTypes: ['express'],
  },
  {
    id: 'cond-express-run-lunge',
    format: 'rounds',
    prescriptionNote: '4 rounds, steady pace',
    movements: [
      { name: 'Run', prescription: '300m' },
      { name: 'Walking Lunges', prescription: '20 reps', station: 'lunges' },
    ],
    fitsTypes: ['express'],
  },
  // --- ENGINE (longer, for-time, 40-60 min) ---
  {
    id: 'cond-engine-classic',
    format: 'for_time',
    prescriptionNote: 'For time',
    movements: [
      { name: 'Run', prescription: '800m' },
      { name: 'Sled Push', prescription: '50m', station: 'sled_push' },
      { name: 'Run', prescription: '800m' },
      { name: 'Sled Pull', prescription: '50m', station: 'sled_pull' },
      { name: 'Wall Balls', prescription: '40 reps', station: 'wall_balls' },
    ],
    fitsTypes: ['engine'],
  },
  {
    id: 'cond-engine-carry-burpee',
    format: 'for_time',
    prescriptionNote: 'For time',
    movements: [
      { name: 'Run', prescription: '600m' },
      { name: 'Farmers Carry', prescription: '100m', station: 'farmers_carry' },
      { name: 'Burpee Broad Jumps', prescription: '20 reps', station: 'burpee_broad_jump' },
      { name: 'Row', prescription: '500m', station: 'row' },
    ],
    fitsTypes: ['engine'],
  },
  // --- SPEED (intervals, work:rest, 20-30 min) ---
  {
    id: 'cond-speed-station-intervals',
    format: 'intervals',
    prescriptionNote: '6 rounds: 90s work / 60s rest',
    movements: [
      { name: 'SkiErg', prescription: 'max meters', station: 'ski_erg' },
      { name: 'Burpee Broad Jumps', prescription: 'max reps', station: 'burpee_broad_jump' },
    ],
    fitsTypes: ['speed'],
  },
  {
    id: 'cond-speed-row-wallball',
    format: 'intervals',
    prescriptionNote: '5 rounds: 60s work / 60s rest',
    movements: [
      { name: 'Row', prescription: 'max meters', station: 'row' },
      { name: 'Wall Balls', prescription: 'max reps', station: 'wall_balls' },
    ],
    fitsTypes: ['speed'],
  },
  // --- STRENGTH_HYROX: LOWER-focused finishers (legs/posterior under fatigue) ---
  {
    id: 'cond-sh-lower-sled',
    format: 'for_time',
    prescriptionNote: 'For time',
    movements: [
      { name: 'Run', prescription: '600m' },
      { name: 'Sled Push', prescription: '50m', station: 'sled_push' },
      { name: 'Walking Lunges', prescription: '20 reps', station: 'lunges' },
    ],
    fitsTypes: ['strength_hyrox'],
  },
  {
    id: 'cond-sh-lower-wallball',
    format: 'rounds',
    prescriptionNote: '3 rounds for time',
    movements: [
      { name: 'Run', prescription: '400m' },
      { name: 'Wall Balls', prescription: '20 reps', station: 'wall_balls' },
      { name: 'Sled Pull', prescription: '50m', station: 'sled_pull' },
    ],
    fitsTypes: ['strength_hyrox'],
  },
  // --- STRENGTH_HYROX: UPPER-focused finishers (pull/push/ski/row) ---
  {
    id: 'cond-sh-upper-ski-row',
    format: 'for_time',
    prescriptionNote: 'For time',
    movements: [
      { name: 'SkiErg', prescription: '500m', station: 'ski_erg' },
      { name: 'Farmers Carry', prescription: '100m', station: 'farmers_carry' },
      { name: 'Row', prescription: '500m', station: 'row' },
    ],
    fitsTypes: ['strength_hyrox'],
  },
  {
    id: 'cond-sh-upper-burpee',
    format: 'rounds',
    prescriptionNote: '3 rounds for time',
    movements: [
      { name: 'Row', prescription: '400m', station: 'row' },
      { name: 'Burpee Broad Jumps', prescription: '15 reps', station: 'burpee_broad_jump' },
      { name: 'Farmers Carry', prescription: '100m', station: 'farmers_carry' },
    ],
    fitsTypes: ['strength_hyrox'],
  },
  // --- ULTRA (60+ min, high volume, lots of running) ---
  {
    id: 'cond-ultra-full-grind',
    format: 'for_time',
    prescriptionNote: 'For time — pace it, this is long',
    movements: [
      { name: 'Run', prescription: '1000m' },
      { name: 'Wall Balls', prescription: '50 reps', station: 'wall_balls' },
      { name: 'Run', prescription: '1000m' },
      { name: 'Sled Push', prescription: '50m', station: 'sled_push' },
      { name: 'Sled Pull', prescription: '50m', station: 'sled_pull' },
      { name: 'Run', prescription: '1000m' },
      { name: 'Burpee Broad Jumps', prescription: '40 reps', station: 'burpee_broad_jump' },
    ],
    fitsTypes: ['ultra'],
  },
  {
    id: 'cond-ultra-station-tour',
    format: 'for_time',
    prescriptionNote: 'For time — steady, consistent splits',
    movements: [
      { name: 'Run', prescription: '800m' },
      { name: 'SkiErg', prescription: '500m', station: 'ski_erg' },
      { name: 'Run', prescription: '800m' },
      { name: 'Row', prescription: '500m', station: 'row' },
      { name: 'Run', prescription: '800m' },
      { name: 'Farmers Carry', prescription: '200m', station: 'farmers_carry' },
      { name: 'Walking Lunges', prescription: '50 reps', station: 'lunges' },
    ],
    fitsTypes: ['ultra'],
  },
  {
    id: 'cond-ultra-rounds',
    format: 'rounds',
    prescriptionNote: '4 rounds for time',
    movements: [
      { name: 'Run', prescription: '800m' },
      { name: 'Wall Balls', prescription: '25 reps', station: 'wall_balls' },
      { name: 'Burpee Broad Jumps', prescription: '15 reps', station: 'burpee_broad_jump' },
      { name: 'Walking Lunges', prescription: '30 reps', station: 'lunges' },
    ],
    fitsTypes: ['ultra'],
  },
];

/** Pieces that fit a session type. */
export function piecesForType(type: SessionType): ConditioningPiece[] {
  return CONDITIONING_PIECES.filter((p) => p.fitsTypes.includes(type));
}

/** Picks a conditioning piece for a type, rotating by week for variety. */
export function pickConditioningPiece(type: SessionType, weekIndex: number): ConditioningPiece | undefined {
  const options = piecesForType(type);
  if (options.length === 0) return undefined;
  return options[weekIndex % options.length];
}

/** Picks a strength_hyrox conditioning piece matched to focus, rotated by week. */
export function pickStrengthHyroxPiece(
  focus: StrengthFocus,
  weekIndex: number
): ConditioningPiece | undefined {
  const lowerIds = ['cond-sh-lower-sled', 'cond-sh-lower-wallball'];
  const upperIds = ['cond-sh-upper-ski-row', 'cond-sh-upper-burpee'];
  const ids = focus === 'upper' ? upperIds : lowerIds;
  const pool = CONDITIONING_PIECES.filter((p) => ids.includes(p.id));
  if (pool.length === 0) return undefined;
  return pool[weekIndex % pool.length];
}
