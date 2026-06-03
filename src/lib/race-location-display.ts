import { format, parseISO } from 'date-fns';

import { formatRaceDateRange } from '@/lib/race-countdown';

/** ISO 3166-1 alpha-2 codes for countries used in race locations. */
const COUNTRY_ISO: Record<string, string> = {
  Argentina: 'AR',
  Australia: 'AU',
  Belgium: 'BE',
  Brazil: 'BR',
  Canada: 'CA',
  China: 'CN',
  Finland: 'FI',
  France: 'FR',
  Germany: 'DE',
  Greece: 'GR',
  India: 'IN',
  Indonesia: 'ID',
  Ireland: 'IE',
  Italy: 'IT',
  Japan: 'JP',
  Mexico: 'MX',
  Netherlands: 'NL',
  Norway: 'NO',
  Poland: 'PL',
  Singapore: 'SG',
  'South Africa': 'ZA',
  'South Korea': 'KR',
  Spain: 'ES',
  Sweden: 'SE',
  Switzerland: 'CH',
  Thailand: 'TH',
  Turkey: 'TR',
  'United Kingdom': 'GB',
  'United States': 'US',
};

const US_STATE_SUFFIX = /, [A-Z]{2}$/;
const US_STATE_ONLY = /^[A-Z]{2}$/;

export function resolveRaceCountry(location: string): string {
  const segment = location.split(' · ').pop()?.trim() ?? location;
  if (US_STATE_SUFFIX.test(segment) || US_STATE_ONLY.test(segment)) {
    return 'United States';
  }
  return segment;
}

export function countryFlagEmoji(country: string): string {
  const iso = COUNTRY_ISO[country];
  if (!iso || iso.length !== 2) return '';
  const upper = iso.toUpperCase();
  return String.fromCodePoint(
    ...[...upper].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65),
  );
}

/** Card date label, e.g. "Jun 27 – 28, 2026" or "Jun 13, 2026". */
export function formatRaceCardDate(dateIso: string, endDateIso?: string): string {
  if (endDateIso && endDateIso !== dateIso) {
    return formatRaceDateRange(dateIso, endDateIso);
  }
  return format(parseISO(dateIso), 'MMM d, yyyy');
}

export function formatRaceCityCountryLine(
  city: string,
  location: string,
): string {
  const country = resolveRaceCountry(location);
  const flag = countryFlagEmoji(country);
  const prefix = flag ? `${flag} ` : '';
  return `${prefix}${city} · ${country}`;
}
