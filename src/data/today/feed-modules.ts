import type { TrainingPhase } from '@/lib/plan-insights';
import type { RaceCountdown } from '@/lib/plan-personalization';
import type { OnboardingProfile } from '@/types';

export type FeedModuleVariant = 'insight' | 'tip' | 'education' | 'recovery' | 'race';

export interface TodayFeedModule {
  id: string;
  variant: FeedModuleVariant;
  title: string;
  body: string;
  tag?: string;
  gradient: [string, string];
}

export function buildTodayFeedModules(
  profile: OnboardingProfile | null,
  phase: TrainingPhase,
  raceCountdown: RaceCountdown | null,
  focusAreas: string[]
): TodayFeedModule[] {
  const modules: TodayFeedModule[] = [];

  if (raceCountdown) {
    modules.push({
      id: 'race',
      variant: 'race',
      title: raceCountdown.label,
      body:
        raceCountdown.days > 0
          ? 'Stay disciplined on easy days. Race week is won in taper.'
          : 'Trust your prep. Warm up fully and control station transitions.',
      tag: 'Race prep',
      gradient: ['#2A2800', '#1A1A0A'],
    });
  }

  const primaryFocus = focusAreas[0];
  if (primaryFocus) {
    modules.push({
      id: 'focus',
      variant: 'insight',
      title: `Focus: ${primaryFocus}`,
      body: 'This block prioritizes station weaknesses while protecting your run legs.',
      tag: 'Insight',
      gradient: ['#1C1C1C', '#111111'],
    });
  }

  modules.push({
    id: 'phase',
    variant: 'insight',
    title: `${phase.charAt(0).toUpperCase() + phase.slice(1)} phase`,
    body:
      phase === 'taper'
        ? 'Reduce fatigue. Keep intensity sharp but volume down.'
        : phase === 'peak'
          ? 'Race-pace simulations should feel controlled, not reckless.'
          : 'Build consistency. Stack quality sessions before adding volume.',
    tag: 'Training',
    gradient: ['#1A1A1A', '#0D0D0D'],
  });

  if (profile?.weaknesses.includes('sleds')) {
    modules.push({
      id: 'sled-tip',
      variant: 'tip',
      title: 'Sled push pacing',
      body: 'Drive horizontal. Short steps off the start — don’t sprint the first 10m.',
      tag: 'HYROX tip',
      gradient: ['#252500', '#141410'],
    });
  }

  if (profile?.weaknesses.includes('running') || profile?.goal === 'hyrox_race') {
    modules.push({
      id: 'run-tip',
      variant: 'tip',
      title: 'Compromised running',
      body: 'Practice 400m–1km reps after stations. Hold form when legs are heavy.',
      tag: 'Pacing',
      gradient: ['#1E1E1E', '#121212'],
    });
  }

  modules.push({
    id: 'recovery',
    variant: 'recovery',
    title: 'Recovery check-in',
    body: 'Sleep and hydration move the needle more than an extra interval this week.',
    tag: 'Recovery',
    gradient: ['#151820', '#0E1014'],
  });

  modules.push({
    id: 'mobility',
    variant: 'education',
    title: 'Ankle & hip mobility',
    body: '10 minutes post-session: couch stretch, ankle rocks, thoracic rotations.',
    tag: 'Mobility',
    gradient: ['#1A1A1A', '#101010'],
  });

  modules.push({
    id: 'stations',
    variant: 'education',
    title: 'Station transitions',
    body: 'Treat the roxzone like a station — breathe, chalk, commit to the next effort.',
    tag: 'HYROX 101',
    gradient: ['#222200', '#141408'],
  });

  return modules.slice(0, 6);
}

export interface WorkoutTypeCard {
  id: string;
  label: string;
  subtitle: string;
  gradient: [string, string];
}

export const WORKOUT_TYPE_CARDS: WorkoutTypeCard[] = [
  { id: 'engine', label: 'Engine', subtitle: 'Mixed modal', gradient: ['#3D3A00', '#1A1900'] },
  { id: 'sim', label: 'HYROX Sim', subtitle: 'Race pace', gradient: ['#2A2A00', '#141400'] },
  { id: 'tempo', label: 'Tempo Run', subtitle: 'Threshold', gradient: ['#1E2428', '#101418'] },
  { id: 'threshold', label: 'Threshold', subtitle: 'Hard aerobic', gradient: ['#28201E', '#140F0E'] },
  { id: 'sled', label: 'Sled Push', subtitle: 'Station skill', gradient: ['#2A2800', '#161500'] },
  { id: 'ski', label: 'SkiErg', subtitle: 'Upper engine', gradient: ['#1A2228', '#0C1014'] },
  { id: 'recovery', label: 'Recovery', subtitle: 'Easy day', gradient: ['#1A1E1A', '#0E100E'] },
  { id: 'hybrid', label: 'Long Hybrid', subtitle: 'Durability', gradient: ['#222228', '#121218'] },
  { id: 'strength', label: 'Strength', subtitle: 'Force', gradient: ['#28241E', '#14120E'] },
  { id: 'mobility', label: 'Mobility', subtitle: 'Movement', gradient: ['#1E1E22', '#101014'] },
];
