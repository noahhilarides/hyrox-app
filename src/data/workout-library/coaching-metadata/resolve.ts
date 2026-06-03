import { HYROX_STATION_CUES } from '@/constants/hyrox-station-cues';
import {
  CATEGORY_SUBSTITUTION_DEFAULTS,
  STATION_SUBSTITUTIONS,
  SUBSTITUTION_PREAMBLE,
} from '@/constants/workout-substitution-guidance';
import type { WorkoutCategory, WorkoutDifficulty } from '@/types/workout';

import { COACHING_OVERRIDES } from './overrides';
import { buildProgressionNotes } from './progression';
import { buildRpeGuidance } from './rpe';
import { inferStationKeysFromTags } from './station-keys';

export interface ResolvedCoaching {
  progressionNotes: string;
  rpeGuidance?: string;
  coachingCues: string[];
  substitutionGuidance: string;
}

export interface CoachingResolveInput {
  id: string;
  category: WorkoutCategory;
  difficulty: WorkoutDifficulty;
  variant?: string;
  tags: string[];
  duration: number;
  equipment: string[];
  /** Full session text for RPE detection (main set + blocks). */
  sessionText: string;
}

function buildSubstitutionGuidance(tags: string[], category: WorkoutCategory): string {
  const lines: string[] = [SUBSTITUTION_PREAMBLE];
  const stationKeys = inferStationKeysFromTags(tags);
  for (const key of stationKeys) {
    lines.push(STATION_SUBSTITUTIONS[key]);
  }
  const catDefault = CATEGORY_SUBSTITUTION_DEFAULTS[category];
  if (catDefault && !lines.some((l) => l === catDefault)) {
    lines.push(catDefault);
  }
  if (tags.includes('multi_modal')) {
    lines.push('Rotate modalities in order prescribed — do not shorten one segment to rush another.');
  }
  return lines.join('\n\n');
}

function buildCoachingCues(tags: string[], extraCues?: string[]): string[] {
  const keys = inferStationKeysFromTags(tags);
  const cues: string[] = [];
  for (const key of keys) {
    cues.push(...HYROX_STATION_CUES[key]);
  }
  if (extraCues?.length) {
    cues.push(...extraCues);
  }
  return [...new Set(cues)];
}

export function resolveCoaching(input: CoachingResolveInput): ResolvedCoaching {
  const override = COACHING_OVERRIDES[input.id];
  const ctx = {
    id: input.id,
    category: input.category,
    difficulty: input.difficulty,
    variant: input.variant,
    tags: input.tags,
    duration: input.duration,
  };

  const progressionNotes =
    override?.progressionNotes ??
    buildProgressionNotes(ctx);

  const rpeGuidance =
    override?.rpeGuidance ??
    buildRpeGuidance(
      {
        category: input.category,
        difficulty: input.difficulty,
        variant: input.variant,
        tags: input.tags,
      },
      input.sessionText
    );

  const coachingCues = buildCoachingCues(input.tags, override?.extraCues);

  const substitutionGuidance =
    override?.substitutionGuidance ??
    buildSubstitutionGuidance(input.tags, input.category);

  return {
    progressionNotes,
    rpeGuidance,
    coachingCues,
    substitutionGuidance,
  };
}
