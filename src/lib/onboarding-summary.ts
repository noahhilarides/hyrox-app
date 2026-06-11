import {
  addDays,
  differenceInCalendarDays,
  format,
  isBefore,
  parseISO,
  startOfDay,
} from 'date-fns';

import { GOAL_OPTIONS } from '@/data/onboarding/goals';
import { INTEREST_OPTIONS } from '@/data/onboarding/interests';
import { RUNNING_ABILITY_OPTIONS, STRENGTH_ABILITY_OPTIONS } from '@/data/onboarding/abilities';
import { WEAKNESS_OPTIONS } from '@/data/onboarding/weaknesses';
import { formatHyroxFinishTime } from '@/lib/hyrox-race-time';
import { computePlanWeeks, getWeeklyStructureLines } from '@/lib/plan-generator';
import { draftToOnboardingProfile } from '@/lib/onboarding-profile-mapper';
import type { OnboardingDraft, OnboardingWeakness } from '@/types/onboarding';

const WEAKNESS_SUMMARY_LABEL: Record<OnboardingWeakness, string> = {
  running_endurance: 'compromised running',
  ski_erg: 'ski erg efficiency',
  sled_push: 'sled endurance',
  sled_pull: 'sled pull strength',
  burpees: 'burpee broad jump',
  grip_fatigue: 'grip under fatigue',
  recovery: 'between-session recovery',
  pacing: 'pacing',
  lunges: 'walking lunges',
  wall_balls: 'wall balls under fatigue',
  rowing: 'rowing power',
};

export interface RaceCountdown {
  days: number;
  label: string;
  urgent: boolean;
}

export interface OnboardingPlanSummary {
  title: string;
  weeksLabel: string;
  startLabel: string;
  countdown: RaceCountdown | null;
  runnerLabel: string;
  strengthLabel: string;
  focusAreas: string[];
  weeklyStructure: string[];
  interestTags: string[];
  goalBadge: string;
  /** Shown on race plans when experience was captured */
  raceExperienceLabel: string | null;
}

function abilityTitle(
  level: OnboardingDraft['runningLevel'],
  options: typeof RUNNING_ABILITY_OPTIONS,
  suffix: string
): string {
  const match = options.find((o) => o.value === level);
  if (!match) return `Intermediate ${suffix}`;
  return `${match.title} ${suffix}`;
}

function buildPlanTitle(draft: OnboardingDraft): string {
  if (draft.goal === 'hyrox_race') {
    const raceName = draft.race.name?.trim();
    const city = draft.race.city?.trim();
    if (raceName) return `${raceName} Plan`;
    if (city) return `HYROX ${city} Race Plan`;
    return 'HYROX Race Plan';
  }

  const goalOption = GOAL_OPTIONS.find((g) => g.value === draft.goal);
  if (goalOption) return `${goalOption.title} Plan`;
  return 'Hybrid Training Plan';
}

function buildCountdown(raceDateIso: string | null): RaceCountdown | null {
  if (!raceDateIso) return null;
  const today = startOfDay(new Date());
  const raceDay = startOfDay(parseISO(raceDateIso));
  if (!isBefore(today, raceDay) && raceDay.getTime() !== today.getTime()) return null;

  const days = Math.max(0, differenceInCalendarDays(raceDay, today));
  if (days === 0) return { days: 0, label: 'Race day', urgent: true };
  if (days === 1) return { days: 1, label: '1 day to race', urgent: true };
  if (days < 7) return { days, label: `${days} days to race`, urgent: true };
  if (days < 14) return { days, label: `${days} days to race`, urgent: false };
  const weeks = Math.floor(days / 7);
  if (weeks >= 8) {
    return { days, label: `${weeks} weeks to race`, urgent: false };
  }
  return { days, label: `${days} days to race`, urgent: false };
}

function buildFocusAreas(draft: OnboardingDraft): string[] {
  if (draft.weaknesses.length === 0) {
    return ['pacing', 'hybrid conditioning', 'race-ready strength'];
  }
  return draft.weaknesses.map((w) => WEAKNESS_SUMMARY_LABEL[w]);
}

function buildRaceExperienceLabel(draft: OnboardingDraft): string | null {
  if (draft.goal !== 'hyrox_race' || draft.race.hasRacedBefore == null) return null;
  if (draft.race.hasRacedBefore === false) return 'First HYROX race';
  if (draft.race.previousTimeSeconds != null) {
    return `Previous finish · ${formatHyroxFinishTime(draft.race.previousTimeSeconds)}`;
  }
  return null;
}

export function buildOnboardingPlanSummary(draft: OnboardingDraft): OnboardingPlanSummary {
  const profile = draftToOnboardingProfile(draft);
  const weeks = computePlanWeeks(profile);
  const goalOption = GOAL_OPTIONS.find((g) => g.value === draft.goal);

  const interestTags = draft.interests
    .map((id) => INTEREST_OPTIONS.find((o) => o.value === id)?.label)
    .filter((label): label is string => Boolean(label));

  const focusFromWeaknesses = buildFocusAreas(draft);
  const focusAreas =
    focusFromWeaknesses.length > 0
      ? focusFromWeaknesses
      : WEAKNESS_OPTIONS.slice(0, 3).map((w) => w.label.toLowerCase());

  const startIso =
    draft.planStartDate ?? format(startOfDay(new Date()), 'yyyy-MM-dd');

  return {
    title: buildPlanTitle(draft),
    weeksLabel: `${weeks} week${weeks === 1 ? '' : 's'}`,
    startLabel: formatRaceDateSubtitle(startIso) ?? 'Today',
    countdown: buildCountdown(draft.race.date),
    runnerLabel: abilityTitle(draft.runningLevel, RUNNING_ABILITY_OPTIONS, 'Runner'),
    strengthLabel: abilityTitle(draft.strengthLevel, STRENGTH_ABILITY_OPTIONS, 'Strength'),
    focusAreas: focusAreas.slice(0, 5),
    weeklyStructure: getWeeklyStructureLines(profile),
    interestTags,
    goalBadge: goalOption?.title ?? 'Hybrid training',
    raceExperienceLabel: buildRaceExperienceLabel(draft),
  };
}

export function formatRaceDateSubtitle(dateIso: string | null): string | null {
  if (!dateIso) return null;
  try {
    return format(parseISO(dateIso), 'EEEE, MMM d, yyyy');
  } catch {
    return null;
  }
}
