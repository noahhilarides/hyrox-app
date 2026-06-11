import type { SessionType, StrengthFocus } from '@/types/session';
import type { WeekPhase as Phase } from '@/lib/recovery-prescription';

/** One scheduled slot in a week — a session type plus optional strength focus. */
export interface WeekSlot {
  type: SessionType;
  strengthFocus?: StrengthFocus;
}

/**
 * Beginner / 5-day weekly structures by phase.
 * - Two strength_hyrox days (lower @ slot 0, upper @ slot 3) kept well separated
 * - Runs never on consecutive days
 * - Conditioning intensity ramps across phases (express -> engine -> speed)
 * - Taper pulls back to lighter session types
 */
const BEGINNER_5DAY: Record<Phase, WeekSlot[]> = {
  base: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'aerobic' },
    { type: 'express' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'run_speed' },
  ],
  build: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'express' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'engine' },
  ],
  peak: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'speed' },
  ],
  taper: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'aerobic' },
    { type: 'express' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'run_speed' },
  ],
};

const BEGINNER_3DAY: Record<Phase, WeekSlot[]> = {
  base: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
  ],
  build: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
  ],
  peak: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
  ],
  taper: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'aerobic' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
  ],
};

const BEGINNER_4DAY: Record<Phase, WeekSlot[]> = {
  base: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'aerobic' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'express' },
  ],
  build: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'engine' },
  ],
  peak: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'speed' },
  ],
  taper: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'aerobic' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'express' },
  ],
};

const BEGINNER_6DAY: Record<Phase, WeekSlot[]> = {
  base: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'aerobic' },
    { type: 'express' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'run_speed' },
    { type: 'aerobic' },
  ],
  build: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'express' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'aerobic' },
    { type: 'engine' },
  ],
  peak: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'aerobic' },
    { type: 'speed' },
  ],
  taper: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'aerobic' },
    { type: 'express' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'run_speed' },
    { type: 'aerobic' },
  ],
};

const INTERMEDIATE_3DAY: Record<Phase, WeekSlot[]> = {
  base: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
  ],
  build: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
  ],
  peak: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
  ],
  taper: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
  ],
};

const INTERMEDIATE_4DAY: Record<Phase, WeekSlot[]> = {
  base: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'engine' },
  ],
  build: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'engine' },
  ],
  peak: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'engine' },
  ],
  taper: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'aerobic' },
  ],
};

const INTERMEDIATE_5DAY: Record<Phase, WeekSlot[]> = {
  base: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'aerobic' },
  ],
  build: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'speed' },
  ],
  peak: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'speed' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'run_speed' },
  ],
  taper: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'aerobic' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'express' },
  ],
};

const INTERMEDIATE_6DAY: Record<Phase, WeekSlot[]> = {
  base: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'aerobic' },
    { type: 'express' },
  ],
  build: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'speed' },
    { type: 'aerobic' },
  ],
  peak: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'speed' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'run_speed' },
    { type: 'ultra' },
  ],
  taper: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'aerobic' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'express' },
    { type: 'aerobic' },
  ],
};

const ADVANCED_3DAY: Record<Phase, WeekSlot[]> = {
  base: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
  ],
  build: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
  ],
  peak: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
  ],
  taper: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
  ],
};

const ADVANCED_4DAY: Record<Phase, WeekSlot[]> = {
  base: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'engine' },
  ],
  build: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'engine' },
  ],
  peak: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'ultra' },
  ],
  taper: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'aerobic' },
  ],
};

const ADVANCED_5DAY: Record<Phase, WeekSlot[]> = {
  base: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'speed' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'run_speed' },
  ],
  build: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'speed' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'ultra' },
  ],
  peak: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'speed' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'ultra' },
  ],
  taper: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'aerobic' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'express' },
  ],
};

const ADVANCED_6DAY: Record<Phase, WeekSlot[]> = {
  base: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'speed' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'run_speed' },
    { type: 'aerobic' },
  ],
  build: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'speed' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'ultra' },
    { type: 'aerobic' },
  ],
  peak: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'speed' },
    { type: 'engine' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'ultra' },
    { type: 'run_speed' },
  ],
  taper: [
    { type: 'strength_hyrox', strengthFocus: 'lower' },
    { type: 'run_speed' },
    { type: 'aerobic' },
    { type: 'strength_hyrox', strengthFocus: 'upper' },
    { type: 'express' },
    { type: 'aerobic' },
  ],
};

/**
 * Returns the week's slot structure for a given level, days/week, and phase.
 * All levels support 3/4/5/6-day.
 */
export function getWeeklyStructure(
  level: 'beginner' | 'intermediate' | 'advanced',
  daysPerWeek: number,
  phase: Phase
): WeekSlot[] {
  if (level === 'beginner') {
    if (daysPerWeek <= 3) return BEGINNER_3DAY[phase];
    if (daysPerWeek === 4) return BEGINNER_4DAY[phase];
    if (daysPerWeek === 5) return BEGINNER_5DAY[phase];
    return BEGINNER_6DAY[phase];
  }
  if (level === 'intermediate') {
    if (daysPerWeek <= 3) return INTERMEDIATE_3DAY[phase];
    if (daysPerWeek === 4) return INTERMEDIATE_4DAY[phase];
    if (daysPerWeek === 5) return INTERMEDIATE_5DAY[phase];
    return INTERMEDIATE_6DAY[phase];
  }
  if (level === 'advanced') {
    if (daysPerWeek <= 3) return ADVANCED_3DAY[phase];
    if (daysPerWeek === 4) return ADVANCED_4DAY[phase];
    if (daysPerWeek === 5) return ADVANCED_5DAY[phase];
    return ADVANCED_6DAY[phase];
  }
  throw new Error(
    `weekly-structure: no structure yet for ${level}/${daysPerWeek}-day (Phase 2 work)`
  );
}
