import { format, isSameWeek, parseISO, startOfWeek, subDays } from 'date-fns';

import type { ProgressStats, TrainingPlan } from '@/types';

export function computeStreak(completions: string[]): { current: number; longest: number } {
  if (completions.length === 0) return { current: 0, longest: 0 };

  const sorted = [...new Set(completions)].sort();
  let longest = 1;
  let current = 1;
  let run = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = parseISO(sorted[i - 1]);
    const curr = parseISO(sorted[i]);
    const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const last = sorted[sorted.length - 1];
  if (last === today || last === yesterday) {
    current = 1;
    for (let i = sorted.length - 2; i >= 0; i--) {
      const prev = parseISO(sorted[i]);
      const next = parseISO(sorted[i + 1]);
      const diff = Math.round((next.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) current += 1;
      else break;
    }
  } else {
    current = 0;
  }

  return { current, longest: Math.max(longest, current) };
}

export function computeProgressStats(
  plan: TrainingPlan | null,
  completions: string[]
): ProgressStats {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });

  const weekWorkouts =
    plan?.workouts.filter((w) => {
      const d = parseISO(w.date);
      return isSameWeek(d, weekStart, { weekStartsOn: 1 });
    }) ?? [];

  const completedThisWeek = weekWorkouts.filter((w) => completions.includes(w.date)).length;
  const { current, longest } = computeStreak(completions);

  return {
    currentStreak: current,
    longestStreak: longest,
    completedThisWeek,
    plannedThisWeek: weekWorkouts.length,
    totalCompleted: completions.length,
  };
}
