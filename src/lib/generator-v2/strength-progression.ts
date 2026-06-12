import type { WeekPhase } from '@/lib/recovery-prescription';

/**
 * Strength load/rep scheme by phase — core lifts climb across a block.
 * Beginners get rep+effort cues; percentages introduced once working weights exist.
 */
export interface StrengthScheme {
  sets: number;
  reps: string;        // e.g. "8", "6", "3-5"
  effortCue: string;   // beginner-friendly load guidance
}

const SCHEME_BY_PHASE: Record<WeekPhase, StrengthScheme> = {
  base: { sets: 4, reps: '8', effortCue: 'Hard but smooth, leave 2 reps in reserve' },
  build: { sets: 4, reps: '6', effortCue: 'Heavier than last block, 1-2 reps in reserve' },
  peak: { sets: 5, reps: '3-5', effortCue: 'Near max for the rep range, stay technical' },
  taper: { sets: 3, reps: '5', effortCue: 'Moderate, keep the pattern sharp, no grinding' },
};

/** Returns the sets/reps/effort scheme for a core lift in the given phase. */
export function strengthScheme(phase: WeekPhase): StrengthScheme {
  return SCHEME_BY_PHASE[phase];
}

/** Formats a lift prescription, e.g. "Back Squat 4x8". */
export function formatLiftPrescription(sets: number, reps: string): string {
  return `${sets}x${reps}`;
}
