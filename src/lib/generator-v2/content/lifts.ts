import type { StrengthFocus } from '@/types/session';

/** A liftable movement with accessory rotation options. */
export interface LiftMenu {
  /** Primary compound lift — repeats across the block so load climbs. */
  primary: string;
  /** Accessory lifts — rotate one per session for variety. */
  accessories: string[];
}

/**
 * Lift menus by strength focus. Primary lifts repeat (progressive load);
 * accessories rotate so sessions stay fresh without losing progression.
 */
const LIFT_MENUS: Record<StrengthFocus, LiftMenu> = {
  lower: {
    primary: 'Back Squat',
    accessories: [
      'Romanian Deadlift',
      'Walking Lunges',
      'Box Step-ups',
      'Bulgarian Split Squat',
      'Hip Thrust',
    ],
  },
  upper: {
    primary: 'Bench Press',
    accessories: [
      'Strict Pull-ups',
      'Overhead Press',
      'Bent-over Row',
      'Z-Press',
      'Dumbbell Floor Press',
    ],
  },
  full_body: {
    primary: 'Deadlift',
    accessories: [
      'Power Clean',
      'Push Press',
      'Front Squat',
      'Dumbbell Thruster',
    ],
  },
};

/** Returns the lift menu for a strength focus. */
export function getLiftMenu(focus: StrengthFocus): LiftMenu {
  return LIFT_MENUS[focus];
}

/**
 * Picks one accessory from the menu, rotating by week so it varies across the block.
 */
export function pickAccessory(focus: StrengthFocus, weekIndex: number): string {
  const menu = LIFT_MENUS[focus];
  return menu.accessories[weekIndex % menu.accessories.length]!;
}
