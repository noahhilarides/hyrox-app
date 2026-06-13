import { format, startOfDay } from 'date-fns';

import { abilityToExperience, onboardingWeaknessesToProfile } from '@/lib/ability-mapper';
import { equipmentAccessToProfile } from '@/lib/equipment-mapper';
import { workoutDaysToPlanIndices } from '@/lib/training-days';
import type { OnboardingProfile, WorkoutLength } from '@/types';
import type { OnboardingDraft } from '@/types/onboarding';

const MINUTES_TO_LENGTH: Record<number, WorkoutLength> = {
  30: '30',
  45: '45',
  60: '60',
  75: '75',
};

/** Maps Zustand onboarding draft → persisted app profile. */
export function draftToOnboardingProfile(draft: OnboardingDraft): OnboardingProfile {
  const minutes = draft.availability.preferredSessionMinutes ?? 45;
  const workoutLength =
    MINUTES_TO_LENGTH[minutes] ??
    (minutes <= 30 ? '30' : minutes <= 45 ? '45' : minutes <= 60 ? '60' : '75');

  const runningLevel = draft.runningLevel;
  const strengthLevel = draft.strengthLevel;

  return {
    goal: draft.goal ?? 'hybrid_fitness',
    raceDate: draft.race.date,
    eventId: draft.race.eventId,
    raceName: draft.race.name,
    raceCity: draft.race.city,
    hasRacedBefore: draft.race.hasRacedBefore ?? undefined,
    previousRaceTimeSeconds:
      draft.race.hasRacedBefore === true ? draft.race.previousTimeSeconds : null,
    fitnessLevel:
      runningLevel === 'beginner' || strengthLevel === 'beginner'
        ? 'beginner'
        : runningLevel === 'elite' || strengthLevel === 'elite'
          ? 'advanced'
          : 'intermediate',
    runningExperience: abilityToExperience(runningLevel),
    strengthExperience: abilityToExperience(strengthLevel),
    daysPerWeek:
      draft.availability.workoutDays.length > 0
        ? draft.availability.workoutDays.length
        : (draft.availability.daysPerWeek ?? 4),
    trainingDayIndices:
      draft.availability.workoutDays.length > 0
        ? workoutDaysToPlanIndices(draft.availability.workoutDays)
        : undefined,
    equipment: equipmentAccessToProfile(draft.equipmentAccess),
    weaknesses:
      draft.weaknesses.length > 0
        ? onboardingWeaknessesToProfile(draft.weaknesses)
        : ['running'],
    onboardingWeaknesses: draft.weaknesses,
    workoutLength,
    planStartDate:
      draft.planStartDate ?? format(startOfDay(new Date()), 'yyyy-MM-dd'),
  };
}
