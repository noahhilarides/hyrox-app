import { getWorkoutsByCategory } from '@/data/workout-library';
import { weekPhase, type WeekPhase } from '@/lib/recovery-prescription';
import { templateEquipmentMatches } from '@/lib/workout-scoring';
import type { OnboardingProfile, WorkoutType } from '@/types';
import type { WorkoutTemplate } from '@/types/workout';

/** Race-prep simulation templates — preferred when equipment and phase allow. */
export const PREFERRED_SIMULATION_TEMPLATE_IDS: readonly string[] = [
  'HYB-008',
  'ENG-002',
  'ENG-008',
  'HYB-017',
] as const;

const PREFERRED_SET = new Set<string>(PREFERRED_SIMULATION_TEMPLATE_IDS);

export function isHyroxRacePrepGoal(profile: OnboardingProfile): boolean {
  return profile.goal === 'hyrox_race';
}

/**
 * Race prep simulation cadence (1-based week numbers in product copy).
 * weekIndex is 0-based.
 */
export function shouldScheduleSimulationWeek(
  weekIndex: number,
  totalWeeks: number,
  profile: OnboardingProfile
): boolean {
  if (!isHyroxRacePrepGoal(profile)) return false;

  // Weeks 1–3: no simulations
  if (weekIndex <= 2) return false;

  // Weeks 4–7: one simulation every two weeks (weeks 4 & 6)
  if (weekIndex >= 3 && weekIndex <= 6) {
    return weekIndex === 3 || weekIndex === 5;
  }

  // Weeks 8–10: weekly simulation
  if (weekIndex >= 7 && weekIndex <= 9) {
    return true;
  }

  // Weeks 11–12: reduced — at most one lighter sim in week 11, none in week 12
  if (weekIndex === 10) {
    return totalWeeks >= 11;
  }
  if (weekIndex === 11) {
    return false;
  }

  // Plans longer than 12 weeks: peak-phase sim every other week only
  if (weekIndex > 11) {
    const phase = weekPhase(weekIndex, totalWeeks);
    return phase === 'peak' && weekIndex % 2 === 0;
  }

  return false;
}

/** Inject or strip race_sim slots to match the weekly simulation prescription. */
export function applyHyroxSimulationExposure(
  template: WorkoutType[],
  weekIndex: number,
  totalWeeks: number,
  profile: OnboardingProfile
): WorkoutType[] {
  if (!isHyroxRacePrepGoal(profile)) {
    return template;
  }

  const result: WorkoutType[] = template.map((t) => (t === 'race_sim' ? 'hyrox' : t));

  if (!shouldScheduleSimulationWeek(weekIndex, totalWeeks, profile)) {
    return result;
  }

  if (template.includes('race_sim')) {
    return [...template];
  }

  const injectOrder: WorkoutType[] = ['hyrox', 'skills', 'conditioning'];
  for (const slotType of injectOrder) {
    const idx = result.indexOf(slotType);
    if (idx >= 0) {
      const next = [...result];
      next[idx] = 'race_sim';
      return next;
    }
  }

  return result;
}

function isSimulationTemplate(template: WorkoutTemplate): boolean {
  return (
    template.variant === 'simulation' ||
    template.tags.includes('hyrox_simulation') ||
    template.workoutType === 'race_sim'
  );
}

/** Scoring bonus to prioritize named simulation workouts in the library. */
/** Narrow simulation pool to preferred race-prep templates when available. */
export function preferRacePrepSimulationCandidates(
  candidates: WorkoutTemplate[],
  profile: OnboardingProfile
): WorkoutTemplate[] {
  if (!isHyroxRacePrepGoal(profile)) return candidates;
  const preferred = candidates.filter((t) => PREFERRED_SET.has(t.id));
  return preferred.length > 0 ? preferred : candidates;
}

/**
 * Race simulations are often tagged advanced — build a dedicated pool for HYROX race prep.
 */
export function buildRacePrepSimulationPool(profile: OnboardingProfile): WorkoutTemplate[] {
  if (!isHyroxRacePrepGoal(profile)) return [];

  const pool = getWorkoutsByCategory('hyrox').filter(
    (t) =>
      isSimulationTemplate(t) &&
      templateEquipmentMatches(t, profile) &&
      PREFERRED_SET.has(t.id)
  );

  return pool.length > 0 ? pool : [];
}

export function simulationTemplateBonus(
  template: WorkoutTemplate,
  weekIndex: number,
  phase: WeekPhase
): number {
  if (!isSimulationTemplate(template)) return 0;

  if (!PREFERRED_SET.has(template.id)) return 0;

  let bonus = 40;

  // Taper: favor partial bricks over full race (ENG-008)
  if (weekIndex >= 10) {
    if (template.id === 'ENG-008') bonus -= 25;
    if (template.id === 'ENG-002' || template.id === 'HYB-017' || template.id === 'HYB-008') {
      bonus += 12;
    }
  }

  if (phase === 'peak' && template.id === 'ENG-008') {
    bonus += 8;
  }

  return bonus;
}
