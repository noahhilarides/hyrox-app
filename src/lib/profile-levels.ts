import type { OnboardingProfile } from '@/types';

export function isBeginnerRunner(profile: OnboardingProfile): boolean {
  return profile.runningExperience === 'none' || profile.fitnessLevel === 'beginner';
}

export function isAdvancedStrength(profile: OnboardingProfile): boolean {
  return (
    profile.strengthExperience === 'regular' || profile.strengthExperience === 'competitive'
  );
}

export function isAdvancedRunner(profile: OnboardingProfile): boolean {
  return (
    profile.runningExperience === 'regular' || profile.runningExperience === 'competitive'
  );
}

/** Overall training age — used for recovery prescription and weekly shape. */
export function isBeginnerAthlete(profile: OnboardingProfile): boolean {
  return profile.fitnessLevel === 'beginner' || isBeginnerRunner(profile);
}

export function isAdvancedAthlete(profile: OnboardingProfile): boolean {
  return isAdvancedRunner(profile) && isAdvancedStrength(profile);
}
