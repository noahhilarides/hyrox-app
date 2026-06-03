import type { LongSessionDay } from '@/types/onboarding';

export interface DaysPerWeekOption {
  value: number;
  label: string;
  description: string;
}

export interface SessionDurationOption {
  value: number;
  label: string;
  description: string;
}

export interface LongSessionDayOption {
  value: LongSessionDay;
  label: string;
  short: string;
}

export const DAYS_PER_WEEK_OPTIONS: DaysPerWeekOption[] = [
  { value: 3, label: '3 days', description: 'Minimum effective dose' },
  { value: 4, label: '4 days', description: 'Balanced for most athletes' },
  { value: 5, label: '5 days', description: 'Higher volume block' },
  { value: 6, label: '6 days', description: 'Advanced commitment' },
];

export const LONG_SESSION_DAY_OPTIONS: LongSessionDayOption[] = [
  { value: 'mon', label: 'Monday', short: 'M' },
  { value: 'tue', label: 'Tuesday', short: 'T' },
  { value: 'wed', label: 'Wednesday', short: 'W' },
  { value: 'thu', label: 'Thursday', short: 'T' },
  { value: 'fri', label: 'Friday', short: 'F' },
  { value: 'sat', label: 'Saturday', short: 'S' },
  { value: 'sun', label: 'Sunday', short: 'S' },
];

export const SESSION_DURATION_OPTIONS: SessionDurationOption[] = [
  { value: 30, label: '30 min', description: 'Quick sessions' },
  { value: 45, label: '45 min', description: 'Most popular' },
  { value: 60, label: '60 min', description: 'Standard hybrid session' },
  { value: 75, label: '75 min', description: 'Longer race-prep blocks' },
];
