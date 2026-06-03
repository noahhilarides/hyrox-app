import type { LongSessionDay } from '@/types/onboarding';

/** Plan generator weekday index (Mon=1 … Sat=6, Sun=0). */
const DAY_TO_PLAN_INDEX: Record<LongSessionDay, number> = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 0,
};

const DAY_LABELS: Record<LongSessionDay, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export function workoutDayToPlanIndex(day: LongSessionDay): number {
  return DAY_TO_PLAN_INDEX[day];
}

export function workoutDaysToPlanIndices(days: LongSessionDay[]): number[] {
  return [...days].map(workoutDayToPlanIndex).sort((a, b) => a - b);
}

export function formatWorkoutDaysShort(days: LongSessionDay[]): string {
  const order: LongSessionDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  return order
    .filter((d) => days.includes(d))
    .map((d) => DAY_LABELS[d].slice(0, 3))
    .join(', ');
}
