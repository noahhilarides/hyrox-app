import type { WorkoutTemplate } from '@/types/workout';

import type { WeekProgressionState } from './week-progression';

function cloneTemplate(template: WorkoutTemplate): WorkoutTemplate {
  return {
    ...template,
    focus: [...template.focus],
    workoutBlocks: template.workoutBlocks.map((b) => ({ ...b })),
  };
}

function scaleRounded(value: number, multiplier: number): number {
  return Math.max(1, Math.round(value * multiplier));
}

/** Replace first N×Mm or N x Mm sled patterns. */
function applySledProgression(detail: string, state: WeekProgressionState): string {
  let out = detail;

  out = out.replace(/(\d+)\s*×\s*(\d+)\s*m\s*sled/gi, (_, sets: string) => {
    const n = state.isRecoveryWeek
      ? scaleRounded(Number(sets), state.volumeMultiplier)
      : state.sledSets;
    return `${n} × ${state.sledDistanceM}m sled`;
  });

  out = out.replace(/(\d+)\s*×\s*(\d+(?:\.\d+)?)\s*m\s*sled/gi, (_, sets: string) => {
    const n = state.isRecoveryWeek
      ? scaleRounded(Number(sets), state.volumeMultiplier)
      : state.sledSets;
    return `${n} × ${state.sledDistanceM}m sled`;
  });

  if (state.sledPhase === 'volume') {
    out = out.replace(/@ race (?:load|weight|pace)/gi, '@ moderate — build volume before intensity');
  }

  return out;
}

function applyWallBallProgression(detail: string, state: WeekProgressionState): string {
  return detail.replace(/(\d+)\s*wall\s*balls?/gi, () => `${state.wallBallReps} wall balls`);
}

function applySkiErgProgression(detail: string, state: WeekProgressionState): string {
  let out = detail;

  out = out.replace(/(\d+)\s*rounds?:\s*\n?(\d+)m\s*ski\s*erg/gi, () => {
    return `${state.skiErgRounds} rounds:\n${state.skiErgMeters}m Ski Erg`;
  });

  out = out.replace(/(\d+)m\s*ski\s*erg/gi, () => `${state.skiErgMeters}m Ski Erg`);

  out = out.replace(
    /(\d+)\s*×\s*(\d+)m\s*ski/gi,
    () => `${state.skiErgRounds} × ${state.skiErgMeters}m ski`
  );

  out = out.replace(
    /(\d+)\s*×\s*(\d+)m\s*@/gi,
    (match, rounds: string, meters: string) => {
      if (!/ski/i.test(match)) return match;
      return `${state.skiErgRounds} × ${state.skiErgMeters}m @`;
    }
  );

  return out;
}

function applyLongRunProgression(
  detail: string,
  state: WeekProgressionState,
  advanced: boolean
): string {
  const min = state.longRunMinutes;
  const max = state.isRecoveryWeek ? min : min + (advanced ? 10 : 8);
  const range = `${min}–${max} min`;

  if (/\d+–\d+\s*min/.test(detail)) {
    return detail.replace(/\d+–\d+\s*min/, range);
  }
  if (/\d+\s*min/.test(detail)) {
    return detail.replace(/\d+\s*min/, `${min} min`);
  }
  return `${range} steady — ${detail}`;
}

function blockNeedsSled(detail: string): boolean {
  return /sled/i.test(detail);
}

function blockNeedsWallBall(detail: string): boolean {
  return /wall\s*ball/i.test(detail);
}

function blockNeedsSki(detail: string): boolean {
  return /ski\s*erg|ski erg/i.test(detail);
}

/**
 * Applies category progression rules to a library template for the given plan week.
 */
export function applyWeekProgressionToTemplate(
  template: WorkoutTemplate,
  state: WeekProgressionState,
  options?: { isLongRunSlot?: boolean; advancedRunner?: boolean }
): WorkoutTemplate {
  const t = cloneTemplate(template);
  const advanced = options?.advancedRunner ?? false;

  t.workoutBlocks = t.workoutBlocks.map((block) => {
    let detail = block.detail;

    if (t.category === 'running' && t.variant === 'long') {
      detail = applyLongRunProgression(detail, state, advanced);
    } else if (options?.isLongRunSlot && t.category === 'running') {
      detail = applyLongRunProgression(detail, state, advanced);
    }

    if (blockNeedsWallBall(detail)) {
      detail = applyWallBallProgression(detail, state);
    }
    if (blockNeedsSki(detail)) {
      detail = applySkiErgProgression(detail, state);
    }
    if (blockNeedsSled(detail)) {
      detail = applySledProgression(detail, state);
    }

    return { ...block, detail };
  });

  if (t.category === 'running' && t.variant === 'long') {
    t.duration = Math.max(t.duration, state.longRunMinutes + 15);
    if (state.isRecoveryWeek) {
      t.name = t.name.includes('deload') ? t.name : `${t.name} — recovery week`;
    }
  }

  if (state.isRecoveryWeek && t.category !== 'recovery' && !t.name.includes('deload')) {
    t.name = `${t.name} — deload`;
  }

  return t;
}
