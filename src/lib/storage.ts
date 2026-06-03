import AsyncStorage from '@react-native-async-storage/async-storage';

import type { OnboardingProfile, PlanHistoryEntry, TrainingPlan } from '@/types';

const KEYS = {
  onboardingComplete: '@pace/onboarding_complete',
  profile: '@pace/profile',
  plan: '@pace/plan',
  completions: '@pace/completions',
  planHistory: '@pace/plan_history',
} as const;

export async function getOnboardingComplete(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEYS.onboardingComplete);
  return v === 'true';
}

export async function setOnboardingComplete(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.onboardingComplete, value ? 'true' : 'false');
}

function normalizeProfile(data: Record<string, unknown>): OnboardingProfile {
  if (data.primaryGoal != null && data.goal == null) {
    data.goal = data.primaryGoal;
    delete data.primaryGoal;
  }
  return data as unknown as OnboardingProfile;
}

export async function getProfile(): Promise<OnboardingProfile | null> {
  const raw = await AsyncStorage.getItem(KEYS.profile);
  if (!raw) return null;
  return normalizeProfile(JSON.parse(raw) as Record<string, unknown>);
}

export async function saveProfile(profile: OnboardingProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export async function getPlan(): Promise<TrainingPlan | null> {
  const raw = await AsyncStorage.getItem(KEYS.plan);
  return raw ? (JSON.parse(raw) as TrainingPlan) : null;
}

export async function savePlan(plan: TrainingPlan): Promise<void> {
  await AsyncStorage.setItem(KEYS.plan, JSON.stringify(plan));
}

export async function clearPlan(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.plan);
}

export async function getCompletions(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEYS.completions);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export async function saveCompletions(dates: string[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.completions, JSON.stringify(dates));
}

export async function getPlanHistory(): Promise<PlanHistoryEntry[]> {
  const raw = await AsyncStorage.getItem(KEYS.planHistory);
  if (!raw) return [];
  return JSON.parse(raw) as PlanHistoryEntry[];
}

export async function savePlanHistory(entries: PlanHistoryEntry[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.planHistory, JSON.stringify(entries));
}

export async function clearAll(): Promise<void> {
  await Promise.all(Object.values(KEYS).map((key) => AsyncStorage.removeItem(key)));
}
