import type { Movement } from '@/types/session';

export interface CooldownPiece {
  label: string;
  movements: Movement[];
}

const COOLDOWN: CooldownPiece = {
  label: 'Cool-down',
  movements: [
    { name: 'Easy walk or row', prescription: '3-5 min' },
    { name: 'Static stretching', prescription: '5-10 min' },
  ],
};

export function cooldown(): CooldownPiece {
  return COOLDOWN;
}
