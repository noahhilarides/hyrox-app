import { differenceInCalendarDays, parseISO } from 'date-fns';

import type { WorkoutTemplate } from '@/types/workout';

import type { TemplateUsage } from './select-template';

export type HyroxStationType =
  | 'ski_erg'
  | 'sled_push'
  | 'sled_pull'
  | 'row_erg'
  | 'wall_ball'
  | 'burpee'
  | 'lunge'
  | 'carry';

const STATION_ROTATION_WINDOW_DAYS = 7;
export const STATION_ROTATION_BONUS = 18;

const TAG_TO_STATION: Array<[string, HyroxStationType]> = [
  ['ski_erg', 'ski_erg'],
  ['sled_push', 'sled_push'],
  ['sled_pull', 'sled_pull'],
  ['rowing', 'row_erg'],
  ['wall_ball', 'wall_ball'],
  ['burpees', 'burpee'],
  ['lunges', 'lunge'],
  ['farmer_carry', 'carry'],
];

export function inferStationType(template: WorkoutTemplate): HyroxStationType | undefined {
  for (const [tag, station] of TAG_TO_STATION) {
    if (template.tags.includes(tag)) return station;
  }
  return undefined;
}

export function buildRecentStationMap(
  usage: TemplateUsage[],
  allTemplates: WorkoutTemplate[],
  sessionDate: string
): Map<HyroxStationType, number> {
  const session = parseISO(sessionDate);
  const templateById = new Map(allTemplates.map((t) => [t.id, t]));
  const lastUsed = new Map<HyroxStationType, number>();
  for (const entry of usage) {
    const template = templateById.get(entry.templateId);
    if (!template) continue;
    const station = inferStationType(template);
    if (!station) continue;
    const daysAgo = differenceInCalendarDays(session, parseISO(entry.date));
    if (daysAgo < 0 || daysAgo > STATION_ROTATION_WINDOW_DAYS) continue;
    const existing = lastUsed.get(station);
    if (existing === undefined || daysAgo < existing) lastUsed.set(station, daysAgo);
  }
  return lastUsed;
}

export function stationRotationBonus(
  template: WorkoutTemplate,
  recentStations: Map<HyroxStationType, number>
): number {
  const station = inferStationType(template);
  if (!station) return 0;
  const daysAgo = recentStations.get(station);
  if (daysAgo === undefined) return STATION_ROTATION_BONUS * 2;
  if (daysAgo >= 5) return STATION_ROTATION_BONUS;
  return 0;
}
