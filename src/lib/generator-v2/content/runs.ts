import type { ExperienceLevel } from '@/types';
import type { WeekPhase } from '@/lib/recovery-prescription';

/**
 * Easy/aerobic run prescription. True beginners ('none') get run/walk intervals
 * that progress weekly toward continuous running — never assume someone who has
 * never run can run continuously.
 */
export function easyRunPrescription(
  runningExperience: ExperienceLevel,
  weekIndex: number
): { name: string; prescription: string; note: string } {
  if (runningExperience === 'none') {
    if (weekIndex <= 1) {
      return { name: 'Run/Walk', prescription: 'Run 1 min / Walk 2 min × 8', note: 'Ease in — walking is part of the plan.' };
    }
    if (weekIndex <= 3) {
      return { name: 'Run/Walk', prescription: 'Run 2 min / Walk 1 min × 8', note: 'More running, less walking — you are building.' };
    }
    if (weekIndex <= 5) {
      return { name: 'Run/Walk', prescription: 'Run 4 min / Walk 1 min × 5', note: 'Longer running blocks now. Keep it easy.' };
    }
    if (weekIndex <= 7) {
      return { name: 'Run/Walk', prescription: 'Run 8 min / Walk 1 min × 3', note: 'Almost continuous — settle into a rhythm.' };
    }
    const mins = Math.min(35, 25 + Math.floor((weekIndex - 8) / 2) * 5);
    return { name: 'Easy Run', prescription: `${mins} min continuous, easy`, note: 'You are a runner now — keep it conversational.' };
  }

  if (runningExperience === 'some') {
    const mins = Math.min(50, 25 + Math.floor(weekIndex / 2) * 5);
    return { name: 'Easy Run', prescription: `${mins} min continuous, easy`, note: 'Conversational pace — build the aerobic base.' };
  }

  // regular / competitive
  const mins = Math.min(75, 40 + Math.floor(weekIndex / 2) * 5);
  return { name: 'Easy Run', prescription: `${mins} min easy`, note: 'Zone 2. Keep easy days truly easy.' };
}

/**
 * Interval / run-speed prescription. True beginners get strides (gentle speed)
 * until continuous running is established, then graduate to short intervals.
 */
export function intervalRunPrescription(
  runningExperience: ExperienceLevel,
  weekIndex: number,
  phase: WeekPhase
): { name: string; prescription: string; note: string } {
  if (runningExperience === 'none') {
    if (weekIndex < 6) {
      return { name: 'Strides', prescription: '6 × 20 sec relaxed strides, walk back to recover', note: 'Gentle speed — stay relaxed and smooth, this is not all-out.' };
    }
    return { name: 'Run Intervals', prescription: '5 × 400m comfortably hard, 90 sec walk/jog recovery', note: 'Your first real intervals — controlled, not a sprint.' };
  }

  if (runningExperience === 'some') {
    const reps = Math.min(8, 5 + Math.floor(weekIndex / 3));
    return { name: 'Run Intervals', prescription: `${reps} × 400m comfortably hard, 90 sec rest`, note: 'Repeatable efforts — same pace across all reps.' };
  }

  // regular / competitive — vary by phase
  if (phase === 'peak') {
    return { name: 'Run Intervals', prescription: '5 × 1000m at race pace, 2 min rest', note: 'Race-pace work. Hold the pace, finish strong.' };
  }
  const reps = Math.min(8, 6 + Math.floor(weekIndex / 4));
  return { name: 'Run Intervals', prescription: `${reps} × 400m faster than race pace, 2 min rest`, note: 'Build pace across reps — last one is the fastest.' };
}
