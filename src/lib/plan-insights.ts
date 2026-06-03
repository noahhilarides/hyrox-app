import {
  differenceInCalendarWeeks,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
  startOfWeek,
} from 'date-fns';

import { getPersonalizedPlanTitle } from '@/lib/plan-personalization';
import type { OnboardingProfile, TrainingPlan, Workout } from '@/types';

export type TrainingPhase = 'base' | 'build' | 'peak' | 'taper';

const PHASE_LABELS: Record<TrainingPhase, string> = {
  base: 'Base building',
  build: 'Build phase',
  peak: 'Peak phase',
  taper: 'Race taper',
};

export function getTrainingPhase(plan: TrainingPlan | null): TrainingPhase {
  if (!plan) return 'base';
  const created = startOfDay(parseISO(plan.createdAt));
  const now = startOfDay(new Date());
  const weekIndex = differenceInCalendarWeeks(now, created, { weekStartsOn: 1 });
  const ratio = weekIndex / Math.max(plan.weeksTotal - 1, 1);
  if (ratio < 0.35) return 'base';
  if (ratio < 0.7) return 'build';
  if (ratio < 0.9) return 'peak';
  return 'taper';
}

export function getPhaseLabel(phase: TrainingPhase): string {
  return PHASE_LABELS[phase];
}

export function getPlanTitle(profile: OnboardingProfile | null, plan: TrainingPlan | null): string {
  if (!plan) return 'No active plan';
  return getPersonalizedPlanTitle(profile, plan);
}

export function getWeekLabel(plan: TrainingPlan | null): string {
  if (!plan) return 'Week —';
  const created = startOfDay(parseISO(plan.createdAt));
  const now = startOfDay(new Date());
  const current = Math.min(
    plan.weeksTotal,
    differenceInCalendarWeeks(now, created, { weekStartsOn: 1 }) + 1
  );
  return `Week ${current} of ${plan.weeksTotal}`;
}

export function getTodayWorkout(plan: TrainingPlan | null, today = format(new Date(), 'yyyy-MM-dd')): Workout | undefined {
  return plan?.workouts.find((w) => w.date === today);
}

export function getUpcomingWorkouts(
  plan: TrainingPlan | null,
  fromDate = format(new Date(), 'yyyy-MM-dd'),
  limit = 3
): Workout[] {
  if (!plan) return [];
  return plan.workouts
    .filter((w) => w.date > fromDate && !w.completed)
    .slice(0, limit);
}

export function getWorkoutForDate(
  plan: TrainingPlan | null,
  date: string
): Workout | undefined {
  return plan?.workouts.find((w) => w.date === date);
}

/** Monday-start week keys (`yyyy-MM-dd`) that contain at least one workout. */
export function getWorkoutWeekStarts(workouts: Workout[]): string[] {
  const starts = new Set<string>();
  for (const w of workouts) {
    starts.add(format(startOfWeek(parseISO(w.date), { weekStartsOn: 1 }), 'yyyy-MM-dd'));
  }
  return [...starts].sort();
}

export function getWeekWorkouts(plan: TrainingPlan | null, anchor = new Date()): Workout[] {
  if (!plan) return [];
  const weekStart = startOfWeek(anchor, { weekStartsOn: 1 });
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return plan.workouts.filter((w) => {
    const d = parseISO(w.date);
    return !isBefore(d, weekStart) && !isAfter(d, weekEnd);
  });
}

export function getCompletedWorkouts(
  plan: TrainingPlan | null,
  completions: string[]
): Workout[] {
  if (!plan) return [];
  return plan.workouts
    .filter((w) => completions.includes(w.date))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function hasActivePlan(plan: TrainingPlan | null): boolean {
  return !!plan && plan.workouts.length > 0;
}
