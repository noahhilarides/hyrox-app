import type { Movement } from '@/types/session';

/** A core finisher block. */
export interface CorePiece {
  label: string;
  prescriptionNote: string;
  movements: Movement[];
}

const CORE_PIECES: CorePiece[] = [
  {
    label: 'Core',
    prescriptionNote: '3 rounds',
    movements: [
      { name: 'Hanging leg raises', prescription: '10 reps' },
      { name: 'Plank', prescription: '45s' },
      { name: 'Dead bug', prescription: '30s' },
    ],
  },
  {
    label: 'Core',
    prescriptionNote: '3 rounds',
    movements: [
      { name: 'Pallof press', prescription: '12 each side' },
      { name: 'Hollow hold', prescription: '30s' },
      { name: 'Side plank', prescription: '30s each side' },
    ],
  },
  {
    label: 'Core',
    prescriptionNote: '3 rounds',
    movements: [
      { name: 'Sit-ups', prescription: '15 reps' },
      { name: 'Russian twists', prescription: '20 reps' },
      { name: 'Superman hold', prescription: '30s' },
    ],
  },
];

/** Picks a core piece, rotating by week. */
export function pickCorePiece(weekIndex: number): CorePiece {
  return CORE_PIECES[weekIndex % CORE_PIECES.length]!;
}
