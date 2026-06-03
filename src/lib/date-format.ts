import { format, isValid, parseISO } from 'date-fns';

/** Parse MM, DD, YYYY into ISO `yyyy-MM-dd` for storage. */
export function monthDayYearToIso(month: string, day: string, year: string): string | null {
  const m = Number(month);
  const d = Number(day);
  const y = Number(year);
  if (!month || !day || year.length !== 4 || m < 1 || m > 12 || d < 1 || d > 31) {
    return null;
  }
  const date = new Date(y, m - 1, d);
  if (!isValid(date) || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null;
  }
  return format(date, 'yyyy-MM-dd');
}

export function isoToMonthDayYear(iso: string | null): {
  month: string;
  day: string;
  year: string;
} {
  if (!iso) return { month: '', day: '', year: '' };
  try {
    const date = parseISO(iso);
    if (!isValid(date)) return { month: '', day: '', year: '' };
    return {
      month: format(date, 'MM'),
      day: format(date, 'dd'),
      year: format(date, 'yyyy'),
    };
  } catch {
    return { month: '', day: '', year: '' };
  }
}

/** Display stored ISO date as MM/DD/YYYY. */
export function formatRaceDateDisplay(iso: string): string {
  const { month, day, year } = isoToMonthDayYear(iso);
  if (!month || !day || !year) return iso;
  return `${month}/${day}/${year}`;
}
