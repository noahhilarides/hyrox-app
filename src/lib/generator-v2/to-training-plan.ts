import { format, startOfDay } from 'date-fns';
import type { Session, Block } from '@/types/session';
import type { OnboardingProfile, TrainingPlan, Workout, Exercise, WorkoutType } from '@/types';
import { generatePlanV2 } from './generate-plan';

/** Maps a v2 SessionType to the app's WorkoutType badge. */
function sessionTypeToWorkoutType(session: Session): WorkoutType {
  switch (session.type) {
    case 'aerobic':
      return 'run';
    case 'run_speed':
      return 'speed';
    case 'strength_hyrox':
    case 'strong':
      return 'strength';
    case 'engine':
    case 'ultra':
      return 'hyrox';
    case 'express':
    case 'speed':
      return 'hyrox';
    default:
      return 'hyrox';
  }
}

/** Flattens a session's blocks into the app's exercise list ({name, detail}). */
function blocksToExercises(blocks: Block[]): Exercise[] {
  const exercises: Exercise[] = [];
  for (const block of blocks) {
    // Section header as a titled line, then each movement as a clean detail line.
    const note = block.prescriptionNote ? ` — ${block.prescriptionNote}` : '';
    exercises.push({ name: block.label, detail: note ? note.replace(/^ — /, '') : '' });
    for (const m of block.movements) {
      exercises.push({ name: '', detail: `${m.name}: ${m.prescription}` });
    }
  }
  return exercises;
}

function sessionToWorkout(session: Session, index: number): Workout {
  return {
    id: `${session.date}-${session.type}-${index}`,
    date: session.date,
    type: sessionTypeToWorkoutType(session),
    title: session.title,
    subtitle: `${session.phase} phase`,
    durationMinutes: session.durationMinutes,
    focus: session.strengthFocus ? [session.strengthFocus] : [],
    exercises: blocksToExercises(session.blocks),
    coachNote: session.coachNote,
    completed: false,
    missed: false,
  };
}

/** Builds a v2 plan and converts it to the app's TrainingPlan shape. */
export function generateTrainingPlanV2(
  profile: OnboardingProfile,
  totalWeeks: number,
  startDate: Date
): TrainingPlan {
  const level =
    profile.fitnessLevel === 'beginner'
      ? 'beginner'
      : profile.fitnessLevel === 'advanced'
        ? 'advanced'
        : 'intermediate';

  const mode: 'race' | 'rolling' = profile.raceDate ? 'race' : 'rolling';

  const plan = generatePlanV2({
    level,
    daysPerWeek: profile.daysPerWeek,
    totalWeeks,
    trainingDayIndices: profile.trainingDayIndices ?? [1, 2, 3, 4, 5],
    startDate,
    runningExperience: profile.runningExperience,
    mode,
  });

  let index = 0;
  const workouts: Workout[] = [];
  for (const week of plan.weeks) {
    for (const session of week.sessions) {
      workouts.push(sessionToWorkout(session, index++));
    }
  }

  return {
    id: `plan-v2-${format(startDate, 'yyyyMMdd')}`,
    createdAt: startOfDay(new Date()).toISOString(),
    raceDate: profile.raceDate,
    weeksTotal: totalWeeks,
    workouts,
  };
}

/** True when the v2 generator supports this profile. Phase 2: all levels, 3-6 days. */
export function v2SupportsProfile(profile: OnboardingProfile): boolean {
  const days = profile.daysPerWeek;
  return days >= 3 && days <= 6;
}
