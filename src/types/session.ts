/**
 * Composed session model (generator v2).
 * A Session is built from ordered Blocks, unlike the single-template WorkoutTemplate.
 * Sessions are converted to the app's `Workout` shape by a thin adapter.
 */
import type { WeekPhase } from '@/lib/recovery-prescription';

/** The 8 fixed HYROX stations, in race order. */
export type HyroxStation =
  | 'ski_erg'
  | 'sled_push'
  | 'sled_pull'
  | 'burpee_broad_jump'
  | 'row'
  | 'farmers_carry'
  | 'lunges'
  | 'wall_balls';

/** A single movement inside a block. */
export interface Movement {
  /** Display name, e.g. "Back Squat", "Sled Push", "Wall Balls". */
  name: string;
  /** Prescription rendered as the detail line, e.g. "4x8", "50m", "20 reps". */
  prescription: string;
  /** Station tag for weekly coverage tracking (only for HYROX station movements). */
  station?: HyroxStation;
}

export type BlockKind = 'warmup' | 'strength' | 'conditioning' | 'core' | 'cooldown';

export type ConditioningFormat =
  | 'for_time'
  | 'amrap'
  | 'emom'
  | 'rounds'
  | 'intervals'
  | 'steady';

/** An ordered section of a session. */
export interface Block {
  kind: BlockKind;
  /** Section heading, e.g. "Warm-up", "Strength", "Workout", "Core", "Cool-down". */
  label: string;
  /** Only set for conditioning blocks. */
  format?: ConditioningFormat;
  movements: Movement[];
  /** Top-line instruction, e.g. "For time, 15 min cap" or "Every 2 min x5". */
  prescriptionNote?: string;
}

export type SessionType =
  | 'aerobic'
  | 'run_speed'
  | 'express'
  | 'speed'
  | 'engine'
  | 'strong'
  | 'strength_hyrox'
  | 'ultra';

export type StrengthFocus = 'upper' | 'lower' | 'full_body';

/** A fully composed training day. */
export interface Session {
  date: string; // yyyy-MM-dd
  type: SessionType;
  title: string;
  phase: WeekPhase;
  strengthFocus?: StrengthFocus;
  /** Ordered blocks: warmup → [strength] → conditioning → [core] → cooldown. */
  blocks: Block[];
  coachNote: string;
  durationMinutes: number;
}
