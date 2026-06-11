import type { ExperienceLevel } from '@/types';
import type { AbilityLevel, OnboardingWeakness } from '@/types/onboarding';
import type { Weakness } from '@/types';

const ABILITY_TO_EXPERIENCE: Record<AbilityLevel, ExperienceLevel> = {
  beginner: 'none',
  intermediate: 'some',
  advanced: 'regular',
  elite: 'competitive',
};

export function abilityToExperience(level: AbilityLevel | null): ExperienceLevel {
  if (!level) return 'some';
  return ABILITY_TO_EXPERIENCE[level];
}

const WEAKNESS_TO_PROFILE: Record<OnboardingWeakness, Weakness> = {
  running_endurance: 'running',
  ski_erg: 'rowing',
  sled_push: 'sleds',
  sled_pull: 'sleds',
  burpees: 'burpees',
  grip_fatigue: 'strength',
  recovery: 'recovery',
  pacing: 'endurance',
  lunges: 'wall_balls',
  wall_balls: 'wall_balls',
  rowing: 'rowing',
};

export function onboardingWeaknessesToProfile(weaknesses: OnboardingWeakness[]): Weakness[] {
  const mapped = weaknesses.map((w) => WEAKNESS_TO_PROFILE[w]);
  return [...new Set(mapped)];
}
