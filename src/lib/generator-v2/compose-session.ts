import type { Block, HyroxStation, Movement, Session, SessionType, StrengthFocus } from '@/types/session';
import type { ExperienceLevel } from '@/types';
import type { WeekPhase } from '@/lib/recovery-prescription';
import { computeWeekProgression } from '@/lib/plan-progression';

import { strengthScheme, formatLiftPrescription } from './strength-progression';
import { getLiftMenu, pickAccessory } from './content/lifts';
import { pickConditioningPiece, pickStrengthHyroxPiece } from './content/conditioning';
import { easyRunPrescription, intervalRunPrescription } from './content/runs';
import { strengthWarmup, conditioningWarmup, runWarmup, beginnerRunWarmup } from './content/warmups';
import { pickCorePiece } from './content/core';
import { cooldown } from './content/cooldowns';

export interface ComposeContext {
  date: string;
  type: SessionType;
  strengthFocus?: StrengthFocus;
  phase: WeekPhase;
  weekIndex: number;
  runningExperience: ExperienceLevel;
  weakStations?: HyroxStation[];
}

/** Approximate session duration by type. */
const BASE_DURATION: Record<SessionType, number> = {
  aerobic: 50,
  run_speed: 40,
  express: 30,
  speed: 30,
  engine: 55,
  strong: 60,
  strength_hyrox: 60,
  ultra: 75,
};

const TYPE_TITLE: Record<SessionType, string> = {
  aerobic: 'Easy Aerobic Run',
  run_speed: 'Running Intervals',
  express: 'HYROX Express',
  speed: 'HYROX Speed',
  engine: 'HYROX Engine',
  strong: 'Strength',
  strength_hyrox: 'Strength + HYROX',
  ultra: 'HYROX Ultra',
};

const FOCUS_LABEL: Record<StrengthFocus, string> = {
  lower: 'Lower',
  upper: 'Upper',
  full_body: 'Full Body',
};

/** Scales a movement's prescription using week progression where applicable. */
function scaleMovement(
  m: Movement,
  weekIndex: number,
  weakStations: HyroxStation[] = []
): Movement {
  const repBump = Math.min(15, weekIndex);
  const distBump = Math.min(250, Math.floor(weekIndex / 2) * 50);

  const roundTo = (value: number, step: number) => Math.round(value / step) * step;

  // Reps that should progress and round to nearest 5.
  const repStations = ['wall_balls', 'burpee_broad_jump', 'lunges'];
  // Erg distances that progress and round to nearest 50m.
  const ergStations = ['ski_erg', 'row'];

  let scaled = m;

  if (m.station && repStations.includes(m.station)) {
    const match = m.prescription.match(/(\d+)\s*reps/);
    if (match) {
      const base = parseInt(match[1]!, 10);
      scaled = { ...m, prescription: `${roundTo(base + repBump, 5)} reps` };
    }
  } else if (m.station && ergStations.includes(m.station)) {
    const match = m.prescription.match(/(\d+)m/);
    if (match) {
      const base = parseInt(match[1]!, 10);
      scaled = { ...m, prescription: `${roundTo(base + distBump, 50)}m` };
    }
  } else if (m.station === 'farmers_carry') {
    const match = m.prescription.match(/(\d+)m/);
    if (match) {
      const base = parseInt(match[1]!, 10);
      const carryBump = Math.min(100, distBump);
      const progressed = roundTo(base + carryBump, 50);
      scaled = { ...m, prescription: `${Math.min(200, progressed)}m` };
    }
  }

  if (weakStations.length === 0 || !scaled.station || !weakStations.includes(scaled.station)) {
    return scaled;
  }

  const repMatch = scaled.prescription.match(/(\d+)\s*reps/);
  if (repMatch) {
    const reps = parseInt(repMatch[1]!, 10);
    return { ...scaled, prescription: `${roundTo(reps * 1.35, 5)} reps` };
  }

  const distMatch = scaled.prescription.match(/(\d+)m/);
  if (distMatch) {
    const dist = parseInt(distMatch[1]!, 10);
    const bumped = roundTo(dist * 1.35, 25);
    const capped = scaled.station === 'farmers_carry' ? Math.min(200, bumped) : bumped;
    return { ...scaled, prescription: `${capped}m` };
  }

  return scaled;
}

/** Builds the warm-up block for a session. */
function buildWarmup(
  type: SessionType,
  runningExperience: ExperienceLevel,
  focus?: StrengthFocus
): Block {
  if (type === 'strength_hyrox' || type === 'strong') {
    const w = strengthWarmup(focus ?? 'lower');
    return { kind: 'warmup', label: w.label, movements: w.movements };
  }
  if (type === 'aerobic' || type === 'run_speed') {
    const w = runningExperience === 'none' ? beginnerRunWarmup() : runWarmup();
    return { kind: 'warmup', label: w.label, movements: w.movements };
  }
  const w = conditioningWarmup();
  return { kind: 'warmup', label: w.label, movements: w.movements };
}

/** Builds the strength block (only for strength session types). */
function buildStrength(focus: StrengthFocus, phase: WeekPhase, weekIndex: number): Block {
  const scheme = strengthScheme(phase);
  const menu = getLiftMenu(focus);
  const accessory = pickAccessory(focus, weekIndex);
  const movements: Movement[] = [
    {
      name: menu.primary,
      prescription: `${formatLiftPrescription(scheme.sets, scheme.reps)} — ${scheme.effortCue}`,
    },
    {
      name: accessory,
      prescription: '3x10-12',
    },
  ];
  return { kind: 'strength', label: 'Strength', movements };
}

/** Builds a run block for aerobic / run_speed sessions. */
function buildRunConditioning(
  type: SessionType,
  weekIndex: number,
  phase: WeekPhase,
  runningExperience: ExperienceLevel
): Block {
  if (type === 'aerobic') {
    const r = easyRunPrescription(runningExperience, weekIndex);
    return {
      kind: 'conditioning',
      label: 'Run',
      format: 'steady',
      prescriptionNote: r.note,
      movements: [{ name: r.name, prescription: r.prescription }],
    };
  }
  // run_speed
  const r = intervalRunPrescription(runningExperience, weekIndex, phase);
  return {
    kind: 'conditioning',
    label: 'Intervals',
    format: 'intervals',
    prescriptionNote: r.note,
    movements: [{ name: r.name, prescription: r.prescription }],
  };
}

/** Conditioning block heading: HYROX finisher after a lift vs standalone conditioning. */
function conditioningLabel(type: SessionType): string {
  return type === 'strength_hyrox' ? 'HYROX' : 'Conditioning';
}

/** Builds the conditioning block from the piece menu, or a run block for run types. */
function buildConditioning(
  type: SessionType,
  weekIndex: number,
  phase: WeekPhase,
  runningExperience: ExperienceLevel,
  strengthFocus?: StrengthFocus,
  weakStations: HyroxStation[] = []
): Block {
  if (type === 'aerobic' || type === 'run_speed') {
    return buildRunConditioning(type, weekIndex, phase, runningExperience);
  }

  const piece =
    type === 'strength_hyrox' && strengthFocus
      ? pickStrengthHyroxPiece(strengthFocus, weekIndex, weakStations)
      : pickConditioningPiece(type, weekIndex, weakStations);

  if (!piece) {
    return {
      kind: 'conditioning',
      label: conditioningLabel(type),
      format: 'rounds',
      prescriptionNote: '4 rounds, steady',
      movements: [
        { name: 'Run', prescription: '400m' },
        { name: 'Wall Balls', prescription: '15 reps', station: 'wall_balls' },
      ],
    };
  }

  return {
    kind: 'conditioning',
    label: conditioningLabel(type),
    format: piece.format,
    prescriptionNote: piece.prescriptionNote,
    movements: piece.movements.map((m) => scaleMovement(m, weekIndex, weakStations)),
  };
}

/** True when this session type should include a core finisher. */
function hasCoreBlock(type: SessionType): boolean {
  return type === 'strength_hyrox' || type === 'strong';
}

function buildTitle(type: SessionType, focus?: StrengthFocus): string {
  if ((type === 'strength_hyrox' || type === 'strong') && focus) {
    return `${FOCUS_LABEL[focus]} Strength + HYROX`;
  }
  return TYPE_TITLE[type];
}

function buildCoachNote(type: SessionType, phase: WeekPhase, runningExperience: ExperienceLevel): string {
  if (type === 'strength_hyrox') {
    return phase === 'base'
      ? 'Build the lift first, then carry that strength into the workout. Focus on clean movement.'
      : 'Lift with intent, then push the workout. This is where HYROX races are won. Strength under fatigue.';
  }
  if (type === 'aerobic') {
    return runningExperience === 'none'
      ? 'Run/walk is the plan. Alternate as prescribed and keep the running easy. You are building toward continuous running.'
      : 'Keep this easy and conversational. Aerobic base is the engine everything else runs on.';
  }
  if (type === 'run_speed') {
    return runningExperience === 'none'
      ? 'Gentle speed exposure. Stay relaxed. This is about smooth turnover, not max effort.'
      : 'Controlled speed. Each rep should be repeatable. Build pace, finish strong.';
  }
  if (type === 'engine') {
    return 'Smooth and steady. Hold consistent splits rather than redlining early.';
  }
  if (type === 'speed') {
    return 'Short and sharp. Full effort in the work windows, real rest between.';
  }
  if (type === 'express') {
    return 'Quick session. Steady pace, clean technique on every station.';
  }
  return 'Execute with intent.';
}

/** Composes a full Session from a slot + phase + week. */
export function composeSession(ctx: ComposeContext): Session {
  const { type, strengthFocus, phase, weekIndex, date } = ctx;
  const blocks: Block[] = [];

  blocks.push(buildWarmup(type, ctx.runningExperience, strengthFocus));

  if ((type === 'strength_hyrox' || type === 'strong') && strengthFocus) {
    blocks.push(buildStrength(strengthFocus, phase, weekIndex));
  }

  blocks.push(
    buildConditioning(
      type,
      weekIndex,
      phase,
      ctx.runningExperience,
      strengthFocus,
      ctx.weakStations ?? []
    )
  );

  if (hasCoreBlock(type)) {
    blocks.push({ ...corePieceAsBlock(weekIndex) });
  }

  blocks.push(cooldownAsBlock());

  return {
    date,
    type,
    title: buildTitle(type, strengthFocus),
    phase,
    strengthFocus,
    blocks,
    coachNote: buildCoachNote(type, phase, ctx.runningExperience),
    durationMinutes: BASE_DURATION[type],
  };
}

function corePieceAsBlock(weekIndex: number): Block {
  const c = pickCorePiece(weekIndex);
  return { kind: 'core', label: c.label, prescriptionNote: c.prescriptionNote, movements: c.movements };
}

function cooldownAsBlock(): Block {
  const c = cooldown();
  return { kind: 'cooldown', label: c.label, movements: c.movements };
}
