import type { Movement, StrengthFocus } from '@/types/session';

/** A short warm-up appropriate to the day's focus. */
export interface WarmupPiece {
  label: string;
  movements: Movement[];
}

const STRENGTH_WARMUP_LOWER: WarmupPiece = {
  label: 'Warm-up',
  movements: [
    { name: 'Easy bike or row', prescription: '3 min' },
    { name: 'Air squats', prescription: '2x10' },
    { name: 'Walking lunges', prescription: '2x10' },
    { name: 'Leg swings', prescription: '30s each side' },
  ],
};

const STRENGTH_WARMUP_UPPER: WarmupPiece = {
  label: 'Warm-up',
  movements: [
    { name: 'Easy ski or row', prescription: '3 min' },
    { name: 'Push-ups', prescription: '2x10' },
    { name: 'Band pull-aparts', prescription: '2x15' },
    { name: 'Shoulder circles', prescription: '30s each direction' },
  ],
};

const CONDITIONING_WARMUP: WarmupPiece = {
  label: 'Warm-up',
  movements: [
    { name: 'Easy jog', prescription: '5 min' },
    { name: 'Dynamic leg swings', prescription: '30s each' },
    { name: 'Strides', prescription: '3x50m' },
  ],
};

const RUN_WARMUP: WarmupPiece = {
  label: 'Warm-up',
  movements: [
    { name: 'Easy jog', prescription: '1km' },
    { name: 'Leg swings', prescription: '30s each side' },
    { name: 'Strides', prescription: '3x50m build' },
  ],
};

const BEGINNER_RUN_WARMUP: WarmupPiece = {
  label: 'Warm-up',
  movements: [
    { name: 'Brisk walk', prescription: '5 min' },
    { name: 'Leg swings', prescription: '30s each side' },
    { name: 'Ankle circles & easy skips', prescription: '1 min' },
  ],
};

export function beginnerRunWarmup(): WarmupPiece {
  return BEGINNER_RUN_WARMUP;
}

/** Returns a warm-up for a strength session by focus. */
export function strengthWarmup(focus: StrengthFocus): WarmupPiece {
  return focus === 'upper' ? STRENGTH_WARMUP_UPPER : STRENGTH_WARMUP_LOWER;
}

export function conditioningWarmup(): WarmupPiece {
  return CONDITIONING_WARMUP;
}

export function runWarmup(): WarmupPiece {
  return RUN_WARMUP;
}
