import type { Block, Movement, Session } from '@/types/session';
import type { OnboardingEquipment } from '@/types/onboarding';

/** Dumbbell/kettlebell substitutions keyed by the original movement name. */
const DB_SUBS: Record<string, string> = {
  'Back Squat': 'Goblet Squat',
  'Bench Press': 'DB Bench Press',
  'Deadlift': 'DB Romanian Deadlift',
  'Wall Balls': 'DB Thrusters',
  'SkiErg': 'Banded Pulldown',
  'Row': 'DB Bent-over Row',
  'Sled Push': 'DB Walking Lunges',
  'Sled Pull': 'See-Saw Rows',
  'Farmers Carry': 'DB Farmers Carry',
  'Sandbag Lunges': 'DB Walking Lunges',
};

/**
 * Rep-based prescriptions for substituted movements that can't be measured in
 * meters. Keyed by the *substituted* name. (DB Farmers Carry is intentionally
 * absent — carries still work for distance.)
 */
const DB_PRESCRIPTION_OVERRIDES: Record<string, string> = {
  'Banded Pulldown': '20 reps',
  'DB Bent-over Row': '20 reps',
  'DB Walking Lunges': '20 reps',
  'See-Saw Rows': '20 reps (10/side)',
};

function substitutePrescription(original: string, newName: string): string {
  // Time-based "max meters" pieces: keep the time/max structure, swap the unit.
  if (/meters/i.test(original)) {
    return original.replace(/meters/gi, 'reps');
  }
  // Distance-based erg/sled movements (e.g. "500m", "50m"): use a rep override.
  const override = DB_PRESCRIPTION_OVERRIDES[newName];
  if (override && original.includes('m')) {
    return override;
  }
  return original;
}

function substituteMovement(movement: Movement): Movement {
  const swapped = DB_SUBS[movement.name];
  if (!swapped) return movement;
  return {
    ...movement,
    name: swapped,
    prescription: substitutePrescription(movement.prescription, swapped),
  };
}

function substituteBlock(block: Block): Block {
  const substituted = block.movements.map(substituteMovement);
  return { ...block, movements: dedupeBlockMovements(substituted) };
}

/** Strip leading "DB " so Walking Lunges and DB Walking Lunges compare equal. */
function normalizeMovementName(name: string): string {
  return name.startsWith('DB ') ? name.slice(3) : name;
}

function parseSimpleReps(prescription: string): number | null {
  const match = prescription.match(/^(\d+)\s*reps$/i);
  return match ? parseInt(match[1]!, 10) : null;
}

function roundTo5(value: number): number {
  return Math.round(value / 5) * 5;
}

function preferDbName(a: string, b: string): string {
  if (a.startsWith('DB ')) return a;
  if (b.startsWith('DB ')) return b;
  return a;
}

function mergeMovements(existing: Movement, duplicate: Movement): Movement {
  const repsA = parseSimpleReps(existing.prescription);
  const repsB = parseSimpleReps(duplicate.prescription);
  const name = preferDbName(existing.name, duplicate.name);
  const station = existing.station ?? duplicate.station;

  if (repsA != null && repsB != null && repsA === repsB) {
    const merged = roundTo5(repsA * 1.5);
    return { ...existing, name, station, prescription: `${merged} reps` };
  }

  // Different prescriptions or not simple reps — keep one, drop the duplicate.
  return { ...existing, name, station };
}

/** Within-block de-dupe after substitutions (dumbbells_only only). */
function dedupeBlockMovements(movements: Movement[]): Movement[] {
  const result: Movement[] = [];

  for (const movement of movements) {
    const norm = normalizeMovementName(movement.name);
    const existingIdx = result.findIndex((m) => normalizeMovementName(m.name) === norm);

    if (existingIdx === -1) {
      result.push(movement);
    } else {
      result[existingIdx] = mergeMovements(result[existingIdx]!, movement);
    }
  }

  return result;
}

/**
 * Swaps movement names for dumbbell/kettlebell-only athletes. Full gym and
 * HYROX-equipped gyms keep the session unchanged.
 */
export function applyEquipmentSubstitutions(
  session: Session,
  equipment: OnboardingEquipment
): Session {
  if (equipment !== 'dumbbells_only') return session;
  return { ...session, blocks: session.blocks.map(substituteBlock) };
}
