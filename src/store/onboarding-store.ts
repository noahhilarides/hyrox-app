import { create } from 'zustand';

import type { Goal } from '@/types';
import type {
  AbilityLevel,
  LongSessionDay,
  OnboardingDraft,
  OnboardingEquipment,
  OnboardingInterest,
  OnboardingRace,
  OnboardingWeakness,
} from '@/types/onboarding';
import { initialOnboardingDraft } from '@/types/onboarding';

interface OnboardingStore extends OnboardingDraft {
  setGoal: (goal: Goal | null) => void;
  setRace: (race: Partial<OnboardingRace>) => void;
  setRunningLevel: (level: AbilityLevel | null) => void;
  setStrengthLevel: (level: AbilityLevel | null) => void;
  toggleWeakness: (weakness: OnboardingWeakness) => void;
  setWeaknesses: (weaknesses: OnboardingWeakness[]) => void;
  setTrainingDays: (days: number | null) => void;
  toggleWorkoutDay: (day: LongSessionDay) => void;
  setLongSessionDay: (day: LongSessionDay | null) => void;
  setPreferredSessionMinutes: (minutes: number | null) => void;
  setEquipmentAccess: (access: OnboardingEquipment | null) => void;
  toggleInterest: (interest: OnboardingInterest) => void;
  setInterests: (interests: OnboardingInterest[]) => void;
  setPlanStartDate: (date: string | null) => void;
  reset: () => void;
  hydrate: (draft: Partial<OnboardingDraft>) => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  ...initialOnboardingDraft,

  setGoal: (goal) => set({ goal }),

  setRace: (race) =>
    set((state) => ({
      race: { ...state.race, ...race },
    })),

  setRunningLevel: (runningLevel) => set({ runningLevel }),

  setStrengthLevel: (strengthLevel) => set({ strengthLevel }),

  toggleWeakness: (weakness) =>
    set((state) => ({
      weaknesses: state.weaknesses.includes(weakness)
        ? state.weaknesses.filter((w) => w !== weakness)
        : [...state.weaknesses, weakness],
    })),

  setWeaknesses: (weaknesses) => set({ weaknesses }),

  setTrainingDays: (daysPerWeek) =>
    set((state) => {
      let workoutDays = state.availability.workoutDays;
      if (daysPerWeek != null && workoutDays.length > daysPerWeek) {
        workoutDays = workoutDays.slice(0, daysPerWeek);
      }
      return {
        availability: { ...state.availability, daysPerWeek, workoutDays },
      };
    }),

  toggleWorkoutDay: (day) =>
    set((state) => {
      const { workoutDays, daysPerWeek } = state.availability;
      if (workoutDays.includes(day)) {
        return {
          availability: {
            ...state.availability,
            workoutDays: workoutDays.filter((d) => d !== day),
          },
        };
      }
      if (daysPerWeek != null && workoutDays.length >= daysPerWeek) {
        return state;
      }
      return {
        availability: {
          ...state.availability,
          workoutDays: [...workoutDays, day],
        },
      };
    }),

  setLongSessionDay: (longSessionDay) =>
    set((state) => ({
      availability: { ...state.availability, longSessionDay },
    })),

  setPreferredSessionMinutes: (preferredSessionMinutes) =>
    set((state) => ({
      availability: { ...state.availability, preferredSessionMinutes },
    })),

  setEquipmentAccess: (equipmentAccess) => set({ equipmentAccess }),

  toggleInterest: (interest) =>
    set((state) => ({
      interests: state.interests.includes(interest)
        ? state.interests.filter((i) => i !== interest)
        : [...state.interests, interest],
    })),

  setInterests: (interests) => set({ interests }),

  setPlanStartDate: (planStartDate) => set({ planStartDate }),

  reset: () => set(initialOnboardingDraft),

  hydrate: (draft) => set((state) => ({ ...state, ...draft })),
}));
