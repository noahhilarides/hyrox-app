import { format, parseISO } from 'date-fns';

import { getPersonalizedPlanTitle } from '@/lib/plan-personalization';
import * as storage from '@/lib/storage';
import type { OnboardingProfile, PlanHistoryEntry, TrainingPlan } from '@/types';

const MAX_ENTRIES = 5;

export async function getPlanHistory(): Promise<PlanHistoryEntry[]> {
  return storage.getPlanHistory();
}

export async function archivePlan(
  plan: TrainingPlan,
  profile: OnboardingProfile,
  completedDates: string[]
): Promise<void> {
  const entry: PlanHistoryEntry = {
    id: plan.id,
    title: getPersonalizedPlanTitle(profile, plan),
    createdAt: plan.createdAt,
    weeksTotal: plan.weeksTotal,
    completedWorkouts: completedDates.length,
    profile,
  };

  const existing = await storage.getPlanHistory();
  const withoutDup = existing.filter((e) => e.id !== entry.id);
  const next = [entry, ...withoutDup].slice(0, MAX_ENTRIES);
  await storage.savePlanHistory(next);
}

export function formatPlanHistoryDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d, yyyy');
  } catch {
    return 'Recent';
  }
}
