import { addDays, format, startOfWeek } from 'date-fns';
import type { HyroxStation, Session } from '@/types/session';
import type { ExperienceLevel } from '@/types';
import type { OnboardingEquipment } from '@/types/onboarding';
import { weekPhase } from '@/lib/recovery-prescription';
import { getWeeklyStructure } from './weekly-structure';
import { composeSession } from './compose-session';
import { applyEquipmentSubstitutions } from './equipment-substitution';

export interface GeneratePlanV2Input {
  level: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  totalWeeks: number;
  /** Weekday indices for training (Mon=1 … Sat=6, Sun=0). */
  trainingDayIndices: number[];
  startDate: Date;
  runningExperience: ExperienceLevel;
  mode?: 'race' | 'rolling';
  equipment?: OnboardingEquipment;
  weakStations?: HyroxStation[];
}

export interface PlanV2Week {
  weekIndex: number;
  phase: string;
  sessions: Session[];
}

export interface PlanV2 {
  weeks: PlanV2Week[];
}

/** Generates a composed v2 plan. Beginner/5-day only in Phase 1. */
export function generatePlanV2(input: GeneratePlanV2Input): PlanV2 {
  const { level, daysPerWeek, totalWeeks, trainingDayIndices, startDate, runningExperience } =
    input;
  const startDateStr = format(startDate, 'yyyy-MM-dd');
  const weeks: PlanV2Week[] = [];

  for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
    const phase = weekPhase(weekIndex, totalWeeks, level, input.mode ?? 'race');
    const structure = getWeeklyStructure(level, daysPerWeek, phase);
    const weekStart = startOfWeek(addDays(startDate, weekIndex * 7), { weekStartsOn: 1 });

    const sessions: Session[] = [];
    for (let i = 0; i < trainingDayIndices.length && i < structure.length; i++) {
      const dayOffset = trainingDayIndices[i] === 0 ? 6 : trainingDayIndices[i] - 1;
      const date = format(addDays(weekStart, dayOffset), 'yyyy-MM-dd');
      if (date < startDateStr) continue;
      const slot = structure[i]!;
      const composed = composeSession({
        date,
        type: slot.type,
        strengthFocus: slot.strengthFocus,
        phase,
        weekIndex,
        runningExperience,
        weakStations: input.weakStations,
      });
      sessions.push(applyEquipmentSubstitutions(composed, input.equipment ?? 'full_gym'));
    }
    weeks.push({ weekIndex, phase, sessions });
  }

  return { weeks };
}
