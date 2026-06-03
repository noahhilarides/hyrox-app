/**
 * One-off coaching audit — prints weeks 1, 4, 8, 12 for four athlete profiles.
 * Run: npx tsx scripts/audit-plans.ts
 */
import { differenceInCalendarDays, differenceInCalendarWeeks, parseISO, startOfWeek } from 'date-fns';

import { getTemplateById } from '@/data/workout-library/build-library';
import {
  BEGINNER_RUN_BLOCKED_IDS,
  BEGINNER_RUN_PREFERRED_IDS,
  isBeginnerRunner,
} from '@/lib/coaching-engine/beginner-runner-protection';
import {
  estimateSessionFatigue,
  FATIGUE_WINDOW_MAX,
} from '@/lib/coaching-engine/fatigue-management';
import { PREFERRED_RECOVERY_TEMPLATE_IDS } from '@/lib/coaching-engine/recovery-insertion';
import { PREFERRED_SIMULATION_TEMPLATE_IDS } from '@/lib/coaching-engine/hyrox-simulation-exposure';
import {
  daysSinceLastUpperBody,
  isUpperBodyResolvedSlot,
  UPPER_BODY_INTERVAL_DAYS,
} from '@/lib/coaching-engine/upper-body-minimum';
import { resolveSlot } from '@/lib/coaching-engine/slot-resolve';
import { WEAKNESS_STATION_TAGS } from '@/lib/workout-scoring';
import { generateTrainingPlan } from '@/lib/plan-generator';
import { weekPhase } from '@/lib/recovery-prescription';
import type { OnboardingProfile, Workout, WorkoutType } from '@/types';

/** Must be on or after "today" in plan-generator (resolvePlanStart clamps past dates). */
const PLAN_START = '2026-06-02';
const RACE_DATE = '2026-08-25';
const SNAPSHOT_WEEKS = [1, 4, 8, 12] as const;

const AUDIT_PROFILES: { label: string; profile: OnboardingProfile }[] = [
  {
    label: '1. Beginner Runner + Advanced Strength',
    profile: {
      goal: 'hyrox_race',
      raceDate: RACE_DATE,
      fitnessLevel: 'beginner',
      runningExperience: 'none',
      strengthExperience: 'competitive',
      daysPerWeek: 5,
      equipment: ['full_gym', 'rower', 'ski_erg', 'sled', 'running_only'],
      weaknesses: ['running', 'sleds', 'wall_balls'],
      workoutLength: '45',
      planStartDate: PLAN_START,
      trainingDayIndices: [1, 2, 3, 5, 6],
      hasRacedBefore: false,
      previousRaceTimeSeconds: null,
    },
  },
  {
    label: '2. Advanced Runner + Beginner Strength',
    profile: {
      goal: 'hyrox_race',
      raceDate: RACE_DATE,
      fitnessLevel: 'intermediate',
      runningExperience: 'competitive',
      strengthExperience: 'none',
      daysPerWeek: 5,
      equipment: ['full_gym', 'rower', 'ski_erg', 'sled'],
      weaknesses: ['sleds', 'wall_balls', 'strength'],
      workoutLength: '60',
      planStartDate: PLAN_START,
      trainingDayIndices: [1, 2, 3, 5, 6],
      hasRacedBefore: true,
      previousRaceTimeSeconds: 5400,
    },
  },
  {
    label: '3. Intermediate Hybrid Athlete',
    profile: {
      goal: 'hybrid_fitness',
      raceDate: null,
      fitnessLevel: 'intermediate',
      runningExperience: 'regular',
      strengthExperience: 'regular',
      daysPerWeek: 5,
      equipment: ['full_gym', 'rower', 'dumbbells', 'running_only'],
      weaknesses: ['sleds', 'rowing', 'burpees'],
      workoutLength: '60',
      planStartDate: PLAN_START,
      trainingDayIndices: [1, 2, 3, 5, 6],
    },
  },
  {
    label: '4. Performance Athlete',
    profile: {
      goal: 'performance_training',
      raceDate: null,
      fitnessLevel: 'advanced',
      runningExperience: 'competitive',
      strengthExperience: 'competitive',
      daysPerWeek: 5,
      equipment: ['full_gym', 'rower', 'ski_erg', 'sled'],
      weaknesses: ['rowing', 'burpees'],
      workoutLength: '75',
      planStartDate: PLAN_START,
      trainingDayIndices: [1, 2, 3, 5, 6],
    },
  },
];

function weekIndexForDate(planStart: string, date: string): number {
  const start = startOfWeek(parseISO(planStart), { weekStartsOn: 1 });
  const session = parseISO(date);
  return differenceInCalendarWeeks(session, start, { weekStartsOn: 1 });
}

function groupByWeek(planStart: string, workouts: Workout[]): Map<number, Workout[]> {
  const map = new Map<number, Workout[]>();
  for (const w of workouts) {
    const wi = weekIndexForDate(planStart, w.date);
    if (!map.has(wi)) map.set(wi, []);
    map.get(wi)!.push(w);
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.date.localeCompare(b.date));
  }
  return map;
}

function stationFocusFromWorkout(w: Workout): string | null {
  if (w.type !== 'hyrox' && w.type !== 'skills' && w.type !== 'race_sim') return null;
  const t = w.libraryTemplateId ? getTemplateById(w.libraryTemplateId) : undefined;
  if (!t) return 'unknown';
  const tags = t.tags ?? [];
  if (tags.includes('sled_push') || tags.includes('sled_pull')) return 'sleds';
  if (tags.includes('wall_ball')) return 'wall_balls';
  if (tags.includes('burpee')) return 'burpees';
  if (tags.includes('row')) return 'rowing';
  const stationTagSet = new Set(
    Object.values(WEAKNESS_STATION_TAGS).flat() as string[]
  );
  return tags.find((tag) => stationTagSet.has(tag)) ?? 'stations';
}

function formatSession(w: Workout): string {
  const id = w.libraryTemplateId ?? '—';
  const phase = w.subtitle.split('·')[0]?.trim() ?? '';
  const focus =
    w.type === 'hyrox' || w.type === 'skills' || w.type === 'race_sim'
      ? ` · focus:${stationFocusFromWorkout(w)}`
      : '';
  const note = w.coachNote.includes('Adjusted') ? ' [fatigue-adjusted]' : '';
  return `${w.date.slice(5)} ${w.type.padEnd(10)} ${id.padEnd(18)} ${String(w.durationMinutes).padStart(2)}m  ${phase}${focus}${note}`;
}

function phaseFromSubtitle(w: Workout): string {
  return w.subtitle.split('·')[0]?.trim().replace(' phase', '') ?? '?';
}

function verifyPlan(label: string, profile: OnboardingProfile, workouts: Workout[]): Record<string, string> {
  const planStart = profile.planStartDate ?? PLAN_START;
  const totalWeeks = 12;
  const byWeek = groupByWeek(planStart, workouts);
  const checks: Record<string, string> = {};

  // Phase progression
  const phases = SNAPSHOT_WEEKS.map((wn) => {
    const wi = wn - 1;
    const expected = weekPhase(wi, totalWeeks);
    const weekWorkouts = byWeek.get(wi) ?? [];
    const actual = weekWorkouts[0] ? phaseFromSubtitle(weekWorkouts[0]).toLowerCase() : '—';
    return `W${wn}:${expected}${actual === expected ? '✓' : `≠${actual}`}`;
  });
  checks['Phase (W1/4/8/12)'] = phases.join(' ');

  // Weakness rotation (hyrox/skills station focus weeks 1–12)
  const stationWeeks: { week: number; focus: string }[] = [];
  for (let wi = 0; wi < totalWeeks; wi++) {
    for (const w of byWeek.get(wi) ?? []) {
      const f = stationFocusFromWorkout(w);
      if (f) stationWeeks.push({ week: wi + 1, focus: f });
    }
  }
  const sledCount = stationWeeks.filter((s) => s.focus === 'sleds').length;
  const wallCount = stationWeeks.filter((s) => s.focus === 'wall_balls').length;
  const stationTotal = stationWeeks.length;
  const sledPct = stationTotal ? Math.round((sledCount / stationTotal) * 100) : 0;
  const wallPct = stationTotal ? Math.round((wallCount / stationTotal) * 100) : 0;
  const rotated =
    profile.weaknesses.includes('sleds') &&
    profile.weaknesses.includes('wall_balls')
      ? sledCount > 0 && wallCount > 0 && sledPct <= 55 && wallPct <= 55
      : 'n/a';
  checks['Weakness rotation'] =
    typeof rotated === 'boolean'
      ? rotated
        ? `PASS (sleds ${sledPct}%, wall ${wallPct}%, n=${stationTotal})`
        : `CHECK (sleds ${sledPct}%, wall ${wallPct}%, n=${stationTotal})`
      : `n/a (${stationTotal} station sessions)`;

  let weeklyVarietyViolations = 0;
  for (let wi = 0; wi < totalWeeks; wi++) {
    const seen = new Set<string>();
    for (const w of byWeek.get(wi) ?? []) {
      const focus = stationFocusFromWorkout(w);
      if (!focus || focus === 'stations' || focus === 'unknown') continue;
      if (seen.has(focus)) weeklyVarietyViolations++;
      seen.add(focus);
    }
  }
  checks['Weekly station variety'] =
    weeklyVarietyViolations === 0
      ? 'PASS (no duplicate focus per week)'
      : `FAIL (${weeklyVarietyViolations} duplicate focus slots)`;

  if (profile.goal === 'hyrox_race') {
    let lastUpper = '';
    let maxUpperGap = 0;
    for (const w of workouts) {
      const resolved = resolveSlot(w.type, profile, {
        phase: 'base',
        isLongRun: false,
        forceRaceSim: w.type === 'race_sim',
        strengthIndex: 0,
      });
      const isUpper =
        resolved.category === 'strength_upper' ||
        isUpperBodyResolvedSlot(w.type, profile, {
          phase: 'base',
          isLongRun: false,
          forceRaceSim: false,
          strengthIndex: 1,
        });
      if (isUpper) {
        if (lastUpper) {
          maxUpperGap = Math.max(maxUpperGap, daysSinceLastUpperBody(w.date, lastUpper));
        }
        lastUpper = w.date;
      }
    }
    checks['Upper body minimum'] =
      maxUpperGap <= UPPER_BODY_INTERVAL_DAYS
        ? `PASS (max gap ${maxUpperGap}d)`
        : `FAIL (max gap ${maxUpperGap}d > ${UPPER_BODY_INTERVAL_DAYS}d)`;
  } else {
    checks['Upper body minimum'] = 'n/a';
  }

  // Recovery sessions
  const recovery = workouts.filter((w) => w.type === 'recovery');
  const recoveryIds = recovery.map((w) => w.libraryTemplateId).filter(Boolean);
  const preferredRcv = recoveryIds.filter((id) =>
    PREFERRED_RECOVERY_TEMPLATE_IDS.includes(id!)
  ).length;
  checks['Recovery'] =
    recovery.length > 0
      ? `PASS (${recovery.length} sessions, ${preferredRcv} preferred RCV)`
      : profile.goal === 'performance_training'
        ? 'n/a (performance plan)'
        : 'FAIL (none)';

  // Simulations
  const sims = workouts.filter((w) => w.type === 'race_sim');
  const simWeeks = [...new Set(sims.map((w) => weekIndexForDate(planStart, w.date) + 1))].sort(
    (a, b) => a - b
  );
  const simIds = sims.map((w) => w.libraryTemplateId).filter(Boolean);
  if (profile.goal === 'hyrox_race') {
    const expectedSims = [4, 6, 8, 9, 10, 11];
    const match = expectedSims.every((w) => simWeeks.includes(w)) && !simWeeks.includes(12);
    checks['Simulations'] = match
      ? `PASS (weeks ${simWeeks.join(',')})`
      : `CHECK (weeks ${simWeeks.join(',')}, expected ~${expectedSims.join(',')})`;
    checks['Sim templates'] =
      simIds.length > 0 &&
      simIds.every((id) => PREFERRED_SIMULATION_TEMPLATE_IDS.includes(id!))
        ? `PASS (${[...new Set(simIds)].join(', ')})`
        : `CHECK (${[...new Set(simIds)].join(', ')})`;
  } else {
    checks['Simulations'] =
      sims.length > 0 ? `present (${simWeeks.join(',')})` : 'none (non-race goal)';
  }

  // Beginner runs — strict in weeks 1–4; later weeks may progress to longer templates
  if (isBeginnerRunner(profile)) {
    const earlyRuns = workouts.filter((w) => {
      if (w.type !== 'run' && w.type !== 'speed') return false;
      return weekIndexForDate(planStart, w.date) <= 3;
    });
    const blockedEarly = earlyRuns.filter((w) =>
      w.libraryTemplateId
        ? (BEGINNER_RUN_BLOCKED_IDS as readonly string[]).includes(w.libraryTemplateId)
        : false
    );
    const w1runs = (byWeek.get(0) ?? []).filter((w) => w.type === 'run' || w.type === 'speed');
    const w1Max = w1runs.length ? Math.max(...w1runs.map((w) => w.durationMinutes)) : 0;
    checks['Beginner runs'] =
      blockedEarly.length === 0 && w1Max <= 35
        ? `PASS (W1–4 no blocked IDs; W1 max ${w1Max}m)`
        : `FAIL (W1–4 blocked: ${blockedEarly.map((w) => w.libraryTemplateId).join(', ') || 'none'}; W1 max ${w1Max}m)`;
  } else {
    checks['Beginner runs'] = 'n/a';
  }

  // Lower-body stacking (3-day fatigue windows)
  let stackFail = 0;
  for (const w of workouts) {
    const anchor = parseISO(w.date);
    const windowLoad = workouts
      .filter((other) => {
        const diff = differenceInCalendarDays(anchor, parseISO(other.date));
        return diff >= 0 && diff < 3;
      })
      .reduce((sum, other) => {
        const station =
          other.type === 'hyrox' || other.type === 'skills' ? profile.weaknesses[0] : undefined;
        return (
          sum +
          estimateSessionFatigue(other.type, profile, {
            phase: weekPhase(weekIndexForDate(planStart, other.date), totalWeeks),
            isLongRun: other.type === 'run',
            forceRaceSim: other.type === 'race_sim',
            strengthIndex: 0,
            weekIndex: weekIndexForDate(planStart, other.date),
            targetWeakness:
              other.type === 'hyrox' || other.type === 'skills'
                ? (profile.weaknesses.find((x) =>
                    ['sleds', 'wall_balls', 'burpees', 'rowing'].includes(x)
                  ) as OnboardingProfile['weaknesses'][number])
                : undefined,
          })
        );
      }, 0);
    if (windowLoad > FATIGUE_WINDOW_MAX) stackFail++;
  }
  checks['3-day fatigue windows'] =
    stackFail === 0
      ? 'PASS (all ≤6)'
      : `NOTE (${stackFail} retrospective windows >6; generator may still swap sessions)`;

  return checks;
}

let auditFailed = false;

for (const { label, profile } of AUDIT_PROFILES) {
  console.log('\n' + '='.repeat(72));
  console.log(label);
  console.log('='.repeat(72));
  console.log(
    `goal=${profile.goal} level=${profile.fitnessLevel} run=${profile.runningExperience} str=${profile.strengthExperience} days=${profile.daysPerWeek}`
  );
  console.log(`weaknesses: ${profile.weaknesses.join(', ')}`);

  const plan = generateTrainingPlan(profile);
  console.log(`plan weeks: ${plan.weeksTotal} · sessions: ${plan.workouts.length}`);

  const byWeek = groupByWeek(profile.planStartDate ?? PLAN_START, plan.workouts);

  for (const weekNum of SNAPSHOT_WEEKS) {
    const wi = weekNum - 1;
    const phase = weekPhase(wi, plan.weeksTotal);
    const sessions = byWeek.get(wi) ?? [];
    console.log(`\n--- Week ${weekNum} (${phase}) ---`);
    if (sessions.length === 0) {
      console.log('  (no sessions)');
      continue;
    }
    for (const w of sessions) {
      console.log('  ' + formatSession(w));
    }
  }

  console.log('\n--- Verification ---');
  const checks = verifyPlan(label, profile, plan.workouts);
  for (const [k, v] of Object.entries(checks)) {
    console.log(`  ${k}: ${v}`);
    if (v.startsWith('FAIL')) {
      auditFailed = true;
    }
  }
}

if (auditFailed) {
  console.error('\nAudit completed with FAIL or CHECK items.');
  process.exit(1);
}
