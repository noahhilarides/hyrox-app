import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { archivePlan } from '@/lib/plan-history';
import { applyMissedWorkoutAdaptation, generateTrainingPlan } from '@/lib/plan-generator';
import { computeProgressStats } from '@/lib/progress';
import * as storage from '@/lib/storage';
import type {
  OnboardingProfile,
  PlanHistoryEntry,
  ProgressStats,
  TrainingPlan,
  Workout,
} from '@/types';

interface AppState {
  ready: boolean;
  onboardingComplete: boolean;
  profile: OnboardingProfile | null;
  plan: TrainingPlan | null;
  completions: string[];
  progress: ProgressStats;
}

interface AppContextValue extends AppState {
  completeOnboarding: (profile: OnboardingProfile) => Promise<void>;
  continuePlanFromProfile: () => Promise<boolean>;
  completeWorkout: (date: string) => Promise<void>;
  markWorkoutMissed: (date: string) => Promise<void>;
  resetApp: () => Promise<void>;
  quitPlan: () => Promise<void>;
  restorePlanFromHistory: (entry: PlanHistoryEntry) => Promise<void>;
  getWorkoutForDate: (date: string) => Workout | undefined;
}

const defaultProgress: ProgressStats = {
  currentStreak: 0,
  longestStreak: 0,
  completedThisWeek: 0,
  plannedThisWeek: 0,
  totalCompleted: 0,
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    ready: false,
    onboardingComplete: false,
    profile: null,
    plan: null,
    completions: [],
    progress: defaultProgress,
  });

  const hydrate = useCallback(async () => {
    const [onboardingComplete, profile, plan, completions] = await Promise.all([
      storage.getOnboardingComplete(),
      storage.getProfile(),
      storage.getPlan(),
      storage.getCompletions(),
    ]);

    const mergedPlan = plan
      ? {
          ...plan,
          workouts: plan.workouts.map((w) => ({
            ...w,
            completed: completions.includes(w.date),
          })),
        }
      : null;

    setState({
      ready: true,
      onboardingComplete,
      profile,
      plan: mergedPlan,
      completions,
      progress: computeProgressStats(mergedPlan, completions),
    });
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const applyPlan = useCallback(
    async (profile: OnboardingProfile, plan: TrainingPlan, resetCompletions = false) => {
      const completions = resetCompletions ? [] : state.completions;
      await Promise.all([
        storage.saveProfile(profile),
        storage.savePlan(plan),
        storage.setOnboardingComplete(true),
        storage.saveCompletions(completions),
      ]);
      const merged = {
        ...plan,
        workouts: plan.workouts.map((w) => ({
          ...w,
          completed: completions.includes(w.date),
        })),
      };
      setState({
        ready: true,
        onboardingComplete: true,
        profile,
        plan: merged,
        completions,
        progress: computeProgressStats(merged, completions),
      });
    },
    [state.completions]
  );

  const completeOnboarding = useCallback(
    async (profile: OnboardingProfile) => {
      const plan = generateTrainingPlan(profile);
      await applyPlan(profile, plan, true);
    },
    [applyPlan]
  );

  const continuePlanFromProfile = useCallback(async (): Promise<boolean> => {
    const profile = state.profile ?? (await storage.getProfile());
    if (!profile) return false;
    const plan = generateTrainingPlan(profile);
    await applyPlan(profile, plan, false);
    return true;
  }, [state.profile, applyPlan]);

  const completeWorkout = useCallback(
    async (date: string) => {
      if (state.completions.includes(date)) return;
      const completions = [...state.completions, date].sort();
      const plan = state.plan
        ? {
            ...state.plan,
            workouts: state.plan.workouts.map((w) =>
              w.date === date ? { ...w, completed: true, missed: false } : w
            ),
          }
        : null;
      await storage.saveCompletions(completions);
      if (plan) await storage.savePlan(plan);
      setState((s) => ({
        ...s,
        plan,
        completions,
        progress: computeProgressStats(plan, completions),
      }));
    },
    [state.completions, state.plan]
  );

  const markWorkoutMissed = useCallback(
    async (date: string) => {
      if (!state.plan || !state.profile) return;
      const adapted = applyMissedWorkoutAdaptation(state.plan, state.profile, date);
      await storage.savePlan(adapted);
      setState((s) => ({
        ...s,
        plan: adapted,
        progress: computeProgressStats(adapted, s.completions),
      }));
    },
    [state.plan, state.profile]
  );

  const resetApp = useCallback(async () => {
    await storage.clearAll();
    setState({
      ready: true,
      onboardingComplete: false,
      profile: null,
      plan: null,
      completions: [],
      progress: defaultProgress,
    });
  }, []);

  const quitPlan = useCallback(async () => {
    if (state.plan && state.profile) {
      await archivePlan(state.plan, state.profile, state.completions);
    }
    await Promise.all([storage.clearPlan(), storage.saveCompletions([])]);
    setState((s) => ({
      ...s,
      plan: null,
      completions: [],
      progress: defaultProgress,
    }));
  }, [state.plan, state.profile, state.completions]);

  const restorePlanFromHistory = useCallback(
    async (entry: PlanHistoryEntry) => {
      const plan = generateTrainingPlan(entry.profile);
      await applyPlan(entry.profile, plan, true);
    },
    [applyPlan]
  );

  const getWorkoutForDate = useCallback(
    (date: string) => state.plan?.workouts.find((w) => w.date === date),
    [state.plan]
  );

  const value = useMemo(
    () => ({
      ...state,
      completeOnboarding,
      continuePlanFromProfile,
      completeWorkout,
      markWorkoutMissed,
      resetApp,
      quitPlan,
      restorePlanFromHistory,
      getWorkoutForDate,
    }),
    [
      state,
      completeOnboarding,
      continuePlanFromProfile,
      completeWorkout,
      markWorkoutMissed,
      resetApp,
      quitPlan,
      restorePlanFromHistory,
      getWorkoutForDate,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
