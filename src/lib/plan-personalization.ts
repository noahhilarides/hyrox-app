import { differenceInCalendarDays, format, isBefore, parseISO, startOfDay } from 'date-fns';

import { HYROX_RACE_EVENTS } from '@/data/onboarding/races';
import { getWeeklyStructureLines } from '@/lib/plan-generator';
import { getPhaseLabel, getTrainingPhase } from '@/lib/plan-insights';
import type { TrainingPhase } from '@/lib/plan-insights';
import { isAdvancedStrength, isBeginnerRunner } from '@/lib/profile-levels';
import type { OnboardingProfile, TrainingPlan, Weakness } from '@/types';

const WEAKNESS_LABELS: Record<Weakness, string> = {
  running: 'Compromised running',
  sleds: 'Sled endurance',
  burpees: 'Burpee broad jump',
  rowing: 'Rowing power',
  wall_balls: 'Walking lunges',
  endurance: 'Race pacing',
  recovery: 'Recovery between sessions',
  strength: 'Grip & carry strength',
};

const RUNNER_LEVEL_LABEL: Record<OnboardingProfile['runningExperience'], string> = {
  none: 'Beginner runner',
  some: 'Intermediate runner',
  regular: 'Advanced runner',
  competitive: 'Elite runner',
};

const STRENGTH_LEVEL_LABEL: Record<OnboardingProfile['strengthExperience'], string> = {
  none: 'Beginner strength',
  some: 'Intermediate strength',
  regular: 'Advanced strength',
  competitive: 'Elite strength',
};

export interface RaceCountdown {
  days: number;
  label: string;
  urgent: boolean;
}

export function getRaceCountdown(profile: OnboardingProfile | null): RaceCountdown | null {
  if (!profile?.raceDate) return null;
  const today = startOfDay(new Date());
  const raceDay = startOfDay(parseISO(profile.raceDate));
  if (!isBefore(today, raceDay) && raceDay.getTime() !== today.getTime()) return null;

  const days = Math.max(0, differenceInCalendarDays(raceDay, today));
  if (days === 0) return { days: 0, label: 'Race day', urgent: true };
  if (days === 1) return { days: 1, label: '1 day to race', urgent: true };
  if (days < 7) return { days, label: `${days} days to race`, urgent: true };
  if (days < 14) return { days, label: `${days} days to race`, urgent: false };
  const weeks = Math.floor(days / 7);
  if (weeks >= 8) return { days, label: `${weeks} weeks to race`, urgent: false };
  return { days, label: `${days} days to race`, urgent: false };
}

/** Returns the hero image URL for the user's selected race event, if known. */
export function getRaceImageUrl(profile: OnboardingProfile | null): string | null {
  const eventId = profile?.eventId;
  if (!eventId) return null;
  return HYROX_RACE_EVENTS.find((race) => race.id === eventId)?.imageUrl ?? null;
}

export function getPersonalizedPlanTitle(
  profile: OnboardingProfile | null,
  plan: TrainingPlan | null
): string {
  if (!profile) return 'Your training plan';

  if (profile.goal === 'hyrox_race') {
    const name = profile.raceName?.trim();
    const city = profile.raceCity?.trim();
    if (name) return name;
    if (city) return `HYROX ${city}`;
    return 'HYROX race prep';
  }

  if (profile.goal === 'hybrid_fitness') return 'Hybrid performance';
  if (profile.goal === 'endurance') return 'Endurance block';
  if (profile.goal === 'strength') return 'Strength & engine';
  if (profile.goal === 'return_to_fitness') return 'Return to fitness';

  if (plan?.weeksTotal) return `${plan.weeksTotal}-week block`;
  return 'Training plan';
}

export function getFocusAreaLabels(profile: OnboardingProfile | null, limit = 4): string[] {
  if (!profile?.weaknesses?.length) {
    return ['Pacing', 'Hybrid conditioning', 'Race-ready strength'];
  }
  return profile.weaknesses
    .map((w) => WEAKNESS_LABELS[w])
    .filter(Boolean)
    .slice(0, limit);
}

export function getWeeklyStructure(profile: OnboardingProfile | null): string[] {
  if (!profile) return [];
  return getWeeklyStructureLines(profile);
}

export function getAbilitySummary(profile: OnboardingProfile | null): {
  runner: string;
  strength: string;
} {
  return {
    runner: RUNNER_LEVEL_LABEL[profile?.runningExperience ?? 'some'],
    strength: STRENGTH_LEVEL_LABEL[profile?.strengthExperience ?? 'some'],
  };
}

export function getProgressionNarrative(
  profile: OnboardingProfile | null,
  plan: TrainingPlan | null
): string {
  const phase = getTrainingPhase(plan);
  const phaseLabel = getPhaseLabel(phase).toLowerCase();
  const weaknesses = profile?.weaknesses ?? [];
  const focusHint =
    weaknesses.includes('sleds') || weaknesses.includes('burpees')
      ? 'Station work ramps as you approach race pace.'
      : weaknesses.includes('running') || weaknesses.includes('endurance')
        ? 'Run volume stays controlled while hybrid density increases.'
        : 'Volume builds steadily. Recovery is placed only when your block needs it.';

  if (profile?.goal === 'hyrox_race') {
    return `You're in ${phaseLabel}. ${focusHint} Simulations sharpen closer to race day.`;
  }
  if (profile?.goal === 'endurance') {
    return `Aerobic emphasis in ${phaseLabel}. ${focusHint}`;
  }
  if (profile?.goal === 'strength') {
    return `Strength-first block in ${phaseLabel}. Conditioning supports, never steals, your lifts.`;
  }
  return `${getPhaseLabel(phase)}. ${focusHint}`;
}

export function formatRaceDateLabel(profile: OnboardingProfile | null): string | undefined {
  if (!profile?.raceDate) return undefined;
  try {
    return `Race · ${format(parseISO(profile.raceDate), 'MMMM d, yyyy')}`;
  } catch {
    return undefined;
  }
}

export function getTodaySessionHeadline(
  profile: OnboardingProfile | null,
  phase: TrainingPhase
): string | null {
  if (!profile) return null;
  const countdown = getRaceCountdown(profile);
  if (countdown?.urgent && countdown.days <= 7) {
    return countdown.days === 0 ? 'Race day. Trust the prep' : 'Race week. Stay sharp, stay fresh';
  }
  if (phase === 'taper') return 'Taper week. Quality over quantity';
  if (isBeginnerRunner(profile)) return 'Building your hybrid base';
  if (isAdvancedStrength(profile)) return 'Strength-led hybrid block';
  return null;
}
