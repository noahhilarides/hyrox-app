import { differenceInCalendarDays, format, parseISO, startOfDay } from 'date-fns';

export function getRaceCountdown(dateIso: string, from = new Date()): string {
  const target = startOfDay(parseISO(dateIso));
  const today = startOfDay(from);
  const days = differenceInCalendarDays(target, today);

  if (days <= 0) return '';
  if (days === 1) return '1 day to go';
  if (days < 7) return `${days} days to go`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? '1 week to go' : `${weeks} weeks to go`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return months === 1 ? '1 month to go' : `${months} months to go`;
  }
  return format(target, 'MMM d, yyyy');
}

export function formatRaceDate(dateIso: string): string {
  return format(parseISO(dateIso), 'EEEE, MMM d, yyyy');
}

/** Compact range for multi-day events, e.g. "Jun 18 – 21, 2026". */
export function formatRaceDateRange(dateIso: string, endDateIso?: string): string {
  if (!endDateIso || endDateIso === dateIso) {
    return formatRaceDate(dateIso);
  }

  const start = parseISO(dateIso);
  const end = parseISO(endDateIso);
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${format(start, 'MMM d')} – ${format(end, 'd, yyyy')}`;
  }
  if (sameYear) {
    return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
  }
  return `${format(start, 'MMM d, yyyy')} – ${format(end, 'MMM d, yyyy')}`;
}

/** True only when today is strictly before the event start date. */
export function isRaceUpcoming(dateIso: string, from = new Date()): boolean {
  const start = startOfDay(parseISO(dateIso));
  const today = startOfDay(from);
  return differenceInCalendarDays(start, today) > 0;
}
