import { addDays, format, nextMonday, parseISO, startOfDay } from 'date-fns';

export type PlanStartPreset = 'today' | 'tomorrow' | 'next_monday' | 'in_one_week';

export interface PlanStartOption {
  value: PlanStartPreset;
  label: string;
  description: string;
}

export function resolvePlanStartDate(preset: PlanStartPreset, from = new Date()): string {
  const anchor = startOfDay(from);
  switch (preset) {
    case 'today':
      return format(anchor, 'yyyy-MM-dd');
    case 'tomorrow':
      return format(addDays(anchor, 1), 'yyyy-MM-dd');
    case 'next_monday':
      return format(nextMonday(anchor), 'yyyy-MM-dd');
    case 'in_one_week':
      return format(addDays(anchor, 7), 'yyyy-MM-dd');
  }
}

function describeDate(iso: string): string {
  return format(parseIsoSafe(iso), 'EEE, MMM d');
}

function parseIsoSafe(iso: string): Date {
  return startOfDay(parseISO(iso));
}

/** Preset options with human-readable dates for the current day. */
export function buildPlanStartOptions(from = new Date()): PlanStartOption[] {
  const presets: PlanStartPreset[] = ['today', 'tomorrow', 'next_monday', 'in_one_week'];
  const labels: Record<PlanStartPreset, string> = {
    today: 'Today',
    tomorrow: 'Tomorrow',
    next_monday: 'Next Monday',
    in_one_week: 'In one week',
  };

  return presets.map((value) => {
    const iso = resolvePlanStartDate(value, from);
    return {
      value,
      label: labels[value],
      description: describeDate(iso),
    };
  });
}
