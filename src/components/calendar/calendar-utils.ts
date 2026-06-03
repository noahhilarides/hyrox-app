import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import type { Workout } from '@/types';

/** Sun–Sat week; Sunday is the 1st column. */
export const CALENDAR_WEEK_STARTS_ON = 0;

export function buildMonthGridDays(month: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: CALENDAR_WEEK_STARTS_ON }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: CALENDAR_WEEK_STARTS_ON }),
  });
}

export function buildWorkoutMap(workouts: Workout[]): Map<string, Workout> {
  const map = new Map<string, Workout>();
  for (const w of workouts) map.set(w.date, w);
  return map;
}

export const CALENDAR_WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
