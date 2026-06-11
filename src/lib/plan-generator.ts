import {
  addDays,
  differenceInCalendarWeeks,
  format,
  isBefore,
  parseISO,
  startOfDay,
  startOfWeek,
} from 'date-fns';

import {
  PLAN_WEEKS_ABSOLUTE_MIN,
  PLAN_WEEKS_DEFAULT,
  PLAN_WEEKS_MAX,
  PLAN_WEEKS_MIN,
} from '@/constants/plan-generation';
import {
  assembleScheduledWorkout,
  type SlotResolveContext,
  type TemplateUsage,
} from '@/lib/coaching-engine';
import {
  buildFatigueHistoryEntry,
  resolveFatigueSafeSessionForDate,
  type FatigueHistoryEntry,
} from '@/lib/coaching-engine/fatigue-management';
import { applyHyroxSimulationExposure } from '@/lib/coaching-engine/hyrox-simulation-exposure';
import { ensureRecoverySlotInTemplate } from '@/lib/coaching-engine/recovery-insertion';
import {
  applyUpperBodyMinimum,
  isUpperBodyResolvedSlot,
} from '@/lib/coaching-engine/upper-body-minimum';
import {
  applyConsecutiveLowerBodyGuard,
  applyStrengthIndexForWeek,
  type PriorTrainingDay,
} from '@/lib/coaching-engine/strength-assignment';
import {
  countStationWeaknessSlots,
  createStationFocusWeekState,
  isStationWeaknessSlot,
  pickStationTargetWeakness,
  recordStationFocusForWeek,
} from '@/lib/coaching-engine/weakness-balancing';
import { computeWeekProgression } from '@/lib/plan-progression';
import { weekPhase } from '@/lib/recovery-prescription';
import {
  generateTrainingPlanV2,
  v2SupportsProfile,
} from '@/lib/generator-v2/to-training-plan';
import {
  applyRecoveryToTemplate,
  buildBaseWeeklyTemplate,
} from '@/lib/weekly-template';
import type {
  OnboardingProfile,
  TrainingPlan,
  Weakness,
  Workout,
  WorkoutType,
} from '@/types';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

function pickTrainingDays(daysPerWeek: number, preferredIndices?: number[]): number[] {
  if (preferredIndices?.length) {
    return preferredIndices.slice(0, daysPerWeek);
  }
  const patterns: Record<number, number[]> = {
    3: [1, 3, 5],
    4: [1, 2, 4, 6],
    5: [1, 2, 3, 5, 6],
    6: [1, 2, 3, 4, 5, 6],
  };
  return patterns[Math.min(6, Math.max(3, daysPerWeek))] ?? patterns[4];
}

function weaknessBoost(weaknesses: Weakness[], type: WorkoutType): number {
  const map: Partial<Record<Weakness, WorkoutType[]>> = {
    running: ['run', 'speed'],
    endurance: ['run', 'conditioning', 'speed'],
    sleds: ['hyrox', 'strength'],
    burpees: ['hyrox', 'conditioning', 'skills'],
    rowing: ['hyrox', 'conditioning', 'skills'],
    wall_balls: ['hyrox', 'strength', 'skills'],
    recovery: ['recovery'],
    strength: ['strength'],
  };
  let score = 0;
  for (const w of weaknesses) {
    if (map[w]?.includes(type)) score += 1;
  }
  return score;
}

function capWorkoutType(
  types: WorkoutType[],
  target: WorkoutType,
  max: number,
  replacement: WorkoutType
): WorkoutType[] {
  let count = 0;
  return types.map((t) => {
    if (t !== target) return t;
    count += 1;
    return count > max ? replacement : t;
  });
}

function adjustTemplateForProfile(
  types: WorkoutType[],
  profile: OnboardingProfile,
  phase: ReturnType<typeof weekPhase>
): WorkoutType[] {
  let template = [...types];

  if (profile.fitnessLevel === 'beginner' || profile.runningExperience === 'none') {
    const maxRuns =
      profile.goal === 'endurance' || profile.goal === 'hyrox_race' ? 2 : 1;
    template = capWorkoutType(template, 'run', maxRuns, 'skills');
  }

  if (
    profile.goal !== 'hyrox_race' &&
    (profile.strengthExperience === 'regular' || profile.strengthExperience === 'competitive') &&
    phase !== 'taper'
  ) {
    template = template.map((t) => (t === 'conditioning' ? 'hyrox' : t));
    if (phase === 'peak' || phase === 'build') {
      const hyroxIdx = template.lastIndexOf('hyrox');
      if (hyroxIdx >= 0) template[hyroxIdx] = 'race_sim';
    }
  }

  if (
    (profile.runningExperience === 'regular' || profile.runningExperience === 'competitive') &&
    profile.goal === 'hyrox_race' &&
    phase === 'build'
  ) {
    template = capWorkoutType(template, 'run', 3, 'conditioning');
  }

  return template;
}

function weeklyTemplate(
  weekIndex: number,
  totalWeeks: number,
  profile: OnboardingProfile
): WorkoutType[] {
  const base = buildBaseWeeklyTemplate(profile, weekIndex, totalWeeks);
  const withRecoverySlot = ensureRecoverySlotInTemplate(
    base,
    profile,
    weekIndex,
    totalWeeks
  );
  return applyRecoveryToTemplate(withRecoverySlot, profile, weekIndex, totalWeeks);
}

function sortTypesByWeakness(types: WorkoutType[], weaknesses: Weakness[]): WorkoutType[] {
  // First pass: stable sort by weakness boost (preserves original order for ties)
  const sorted = types
    .map((type, i) => ({ type, i }))
    .sort((a, b) => {
      const boost = weaknessBoost(weaknesses, b.type) - weaknessBoost(weaknesses, a.type);
      return boost !== 0 ? boost : a.i - b.i;
    })
    .map((x) => x.type);

  // Second pass: de-cluster — if a session type matches the previous day,
  // swap it with the next different-typed session to break the streak
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1]) {
      const swapWith = sorted.findIndex((t, j) => j > i && t !== sorted[i - 1]);
      if (swapWith !== -1) {
        [sorted[i], sorted[swapWith]] = [sorted[swapWith], sorted[i]];
      }
    }
  }
  return sorted;
}

/** First day sessions are scheduled — never before today. */
function resolvePlanStart(profile: OnboardingProfile): Date {
  const today = startOfDay(new Date());
  if (!profile.planStartDate) return today;
  const chosen = startOfDay(parseISO(profile.planStartDate));
  return isBefore(chosen, today) ? today : chosen;
}

export function computePlanWeeks(profile: OnboardingProfile): number {
  const planStart = resolvePlanStart(profile);
  const raceDate = profile.raceDate ? startOfDay(parseISO(profile.raceDate)) : null;

  if (raceDate && isBefore(planStart, raceDate)) {
    const weeksToRace =
      differenceInCalendarWeeks(raceDate, planStart, { weekStartsOn: 1 }) + 1;
    if (weeksToRace < PLAN_WEEKS_MIN) {
      return Math.max(PLAN_WEEKS_ABSOLUTE_MIN, weeksToRace);
    }
    return Math.min(PLAN_WEEKS_MAX, Math.max(PLAN_WEEKS_MIN, weeksToRace));
  }

  return PLAN_WEEKS_DEFAULT;
}

export function getWeeklyStructureLines(profile: OnboardingProfile): string[] {
  const totalWeeks = computePlanWeeks(profile);
  const weekIndex = Math.floor(totalWeeks * 0.45);
  const template = adjustTemplateForProfile(
    weeklyTemplate(weekIndex, totalWeeks, profile),
    profile,
    weekPhase(weekIndex, totalWeeks, profile.fitnessLevel)
  );

  const counts = {
    run: 0,
    strength: 0,
    speed: 0,
    skills: 0,
    hybrid: 0,
    recovery: 0,
  };
  for (const type of template) {
    if (type === 'run') counts.run += 1;
    else if (type === 'strength') counts.strength += 1;
    else if (type === 'speed') counts.speed += 1;
    else if (type === 'skills') counts.skills += 1;
    else if (type === 'recovery') counts.recovery += 1;
    else if (type === 'hyrox' || type === 'conditioning' || type === 'race_sim') counts.hybrid += 1;
  }

  const lines: string[] = [];
  if (counts.strength > 0) {
    lines.push(`${counts.strength} strength ${counts.strength === 1 ? 'session' : 'sessions'}`);
  }
  if (counts.run > 0) {
    const label =
      counts.run === 1 ? '1 aerobic run' : `${counts.run} aerobic ${counts.run === 2 ? 'runs' : 'sessions'}`;
    lines.push(label);
  }
  if (counts.speed > 0) {
    lines.push(`${counts.speed} speed ${counts.speed === 1 ? 'session' : 'sessions'}`);
  }
  if (counts.skills > 0) {
    lines.push(`${counts.skills} skills ${counts.skills === 1 ? 'session' : 'sessions'}`);
  }
  if (counts.hybrid > 0) {
    lines.push(
      counts.hybrid === 1 ? '1 hybrid session' : `${counts.hybrid} hybrid sessions`
    );
  }
  if (counts.recovery > 0) {
    lines.push(
      `${counts.recovery} recovery ${counts.recovery === 1 ? 'session' : 'sessions'} (when prescribed)`
    );
  }
  return lines;
}

/**
 * Builds a full training calendar from WORKOUT_LIBRARY via the coaching engine.
 *
 * Flow: weekly slot template → resolve slot (category + variant + phase) →
 * select library template → apply week progression → calendar Workout.
 */
export function generateTrainingPlan(profile: OnboardingProfile): TrainingPlan {
  if (v2SupportsProfile(profile)) {
    const planStartV2 = resolvePlanStart(profile);
    const totalWeeksV2 = computePlanWeeks(profile);
    return generateTrainingPlanV2(profile, totalWeeksV2, planStartV2);
  }

  const today = startOfDay(new Date());
  const planStart = resolvePlanStart(profile);
  const raceDate =
    profile.raceDate ? startOfDay(parseISO(profile.raceDate)) : null;

  const totalWeeks = computePlanWeeks(profile);

  let endDate = addDays(planStart, totalWeeks * 7 - 1);
  if (raceDate && isBefore(planStart, raceDate) && isBefore(raceDate, endDate)) {
    endDate = raceDate;
  }

  const trainingDayIndices = pickTrainingDays(
    profile.daysPerWeek,
    profile.trainingDayIndices
  );
  const workouts: Workout[] = [];
  const recentTemplateUsage: TemplateUsage[] = [];
  const fatigueHistory: FatigueHistoryEntry[] = [];
  let lastUpperBodyDate: string | null = null;
  let priorTrainingDay: PriorTrainingDay | null = null;
  let cursor = planStart;
  let weekIndex = 0;
  let workoutIndex = 0;

  while (!isBefore(endDate, cursor) && weekIndex < totalWeeks) {
    const weekStart = startOfWeek(cursor, { weekStartsOn: 1 });
    const phase = weekPhase(weekIndex, totalWeeks, profile.fitnessLevel);
    const weekProgression = computeWeekProgression(weekIndex, totalWeeks, profile);
    const template = applyHyroxSimulationExposure(
      adjustTemplateForProfile(
        sortTypesByWeakness(
          weeklyTemplate(weekIndex, totalWeeks, profile),
          profile.weaknesses
        ),
        profile,
        phase
      ),
      weekIndex,
      totalWeeks,
      profile
    );

    const lastRunSlot = template.lastIndexOf('run');
    let strengthOccurrenceInWeek = 0;
    const stationFocusWeek = createStationFocusWeekState();
    const stationWeaknessSlotCount = countStationWeaknessSlots(template, profile);

    for (let i = 0; i < trainingDayIndices.length; i++) {
      const dayOffset = trainingDayIndices[i];
      const sessionDate = addDays(weekStart, dayOffset === 0 ? 6 : dayOffset - 1);
      if (isBefore(sessionDate, planStart) || isBefore(endDate, sessionDate)) continue;

      const dateStr = format(sessionDate, 'yyyy-MM-dd');
      const plannedType = template[i % template.length]!;
      const isLongRun =
        plannedType === 'run' && i === lastRunSlot && profile.daysPerWeek >= 5;

      let targetWeakness: Weakness | undefined;
      if (isStationWeaknessSlot(plannedType)) {
        targetWeakness = pickStationTargetWeakness(
          profile,
          stationFocusWeek,
          stationWeaknessSlotCount,
          weekIndex,
          i
        );
        recordStationFocusForWeek(stationFocusWeek, targetWeakness);
      }

      let baseSlotContext: SlotResolveContext = {
          phase,
          isLongRun,
          forceRaceSim: plannedType === 'race_sim',
          strengthIndex: 0,
          weekIndex,
          targetWeakness,
        };

      baseSlotContext = applyConsecutiveLowerBodyGuard(
        plannedType,
        profile,
        baseSlotContext,
        dateStr,
        priorTrainingDay
      );

      const upperSteered = applyUpperBodyMinimum(
        plannedType,
        profile,
        baseSlotContext,
        dateStr,
        lastUpperBodyDate
      );
      let sessionType = upperSteered.type;
      baseSlotContext = upperSteered.slotContext;

      if (sessionType === 'strength') {
        baseSlotContext = applyStrengthIndexForWeek(
          baseSlotContext,
          weekIndex,
          strengthOccurrenceInWeek++,
          { preferUpper: upperSteered.upperBodySteered }
        );
      }

      const fatigueSafe = resolveFatigueSafeSessionForDate(
        sessionType,
        profile,
        baseSlotContext,
        fatigueHistory,
        dateStr
      );

      const session = assembleScheduledWorkout(fatigueSafe.type, profile, {
        date: dateStr,
        index: workoutIndex++,
        weekIndex,
        dayIndex: i,
        phase,
        weekProgression,
        sessionDate: dateStr,
        recentTemplateUsage,
        slotContext: fatigueSafe.slotContext,
      });

      fatigueHistory.push(
        buildFatigueHistoryEntry(
          dateStr,
          fatigueSafe.type,
          profile,
          fatigueSafe.slotContext,
          fatigueSafe.fatigueScore
        )
      );

      if (
        isUpperBodyResolvedSlot(
          fatigueSafe.type,
          profile,
          fatigueSafe.slotContext
        )
      ) {
        lastUpperBodyDate = dateStr;
      }

      priorTrainingDay = {
        sessionDate: dateStr,
        plannedType: fatigueSafe.type,
        slotContext: fatigueSafe.slotContext,
      };

      workouts.push(session);
      if (session.libraryTemplateId) {
        recentTemplateUsage.push({
          templateId: session.libraryTemplateId,
          date: dateStr,
        });
      }
    }

    weekIndex += 1;
    cursor = addDays(weekStart, 7);
  }

  return {
    id: `plan-${format(planStart, 'yyyyMMdd')}`,
    createdAt: today.toISOString(),
    raceDate: profile.raceDate,
    weeksTotal: totalWeeks,
    workouts,
  };
}

export function applyMissedWorkoutAdaptation(
  plan: TrainingPlan,
  profile: OnboardingProfile,
  missedDate: string
): TrainingPlan {
  const missed = plan.workouts.find((w) => w.date === missedDate && !w.completed);
  if (!missed) return plan;

  const updated = plan.workouts.map((w) =>
    w.date === missedDate ? { ...w, missed: true } : w
  );

  const nextIdx = updated.findIndex(
    (w) => w.date > missedDate && !w.completed && w.type === 'recovery'
  );
  if (nextIdx === -1) return { ...plan, workouts: updated };

  const weekProgression = computeWeekProgression(0, plan.weeksTotal, profile);
  const replacementDate = updated[nextIdx]!.date;
  const replacement = assembleScheduledWorkout(missed.type, profile, {
    date: replacementDate,
    index: 999,
    weekIndex: 0,
    dayIndex: 0,
    phase: 'base',
    weekProgression,
    sessionDate: replacementDate,
    recentTemplateUsage: plan.workouts
      .filter((w) => w.libraryTemplateId)
      .map((w) => ({ templateId: w.libraryTemplateId!, date: w.date })),
    slotContext: {
      phase: 'base',
      isLongRun: false,
      forceRaceSim: false,
      strengthIndex: 0,
    },
  });
  replacement.title = `${missed.title} (moved)`;
  replacement.coachNote =
    'We shifted this session after a missed day — slightly reduced volume to protect recovery.';

  const workouts = updated.map((w, i) => (i === nextIdx ? replacement : w));
  return { ...plan, workouts };
}

export function getWorkoutTypeLabel(type: WorkoutType): string {
  const labels: Record<WorkoutType, string> = {
    run: 'Aerobic',
    strength: 'Strength',
    speed: 'Speed',
    skills: 'Skills',
    conditioning: 'Conditioning',
    recovery: 'Recovery',
    hyrox: 'Hybrid',
    race_sim: 'Race sim',
  };
  return labels[type];
}

export { DAY_NAMES };

/** Progression rule constants — edit in `src/constants/workout-progression-rules.ts`. */
export {
  LONG_RUN_PROGRESSION,
  RECOVERY_WEEK_RULES,
  SKI_ERG_PROGRESSION,
  SLED_PROGRESSION,
  WALL_BALL_PROGRESSION,
} from '@/constants/workout-progression-rules';
export {
  computeWeekProgression,
  isPlanRecoveryWeek,
  type WeekProgressionState,
} from '@/lib/plan-progression';
