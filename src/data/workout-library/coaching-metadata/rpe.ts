import type { WorkoutCategory, WorkoutDifficulty } from '@/types/workout';

const RPE_IN_TEXT = /\bRPE\s*[0-9]/i;

export function sessionTextHasRpe(text: string): boolean {
  return RPE_IN_TEXT.test(text);
}

export interface RpeContext {
  category: WorkoutCategory;
  difficulty: WorkoutDifficulty;
  variant?: string;
  tags: string[];
}

export function buildRpeGuidance(ctx: RpeContext, sessionText: string): string | undefined {
  if (sessionTextHasRpe(sessionText)) {
    return undefined;
  }

  if (ctx.category === 'recovery') {
    return 'RPE 3–4 throughout — you should finish feeling better than when you started.';
  }

  if (ctx.category === 'running') {
    if (ctx.variant === 'speed' || ctx.tags.includes('intervals')) {
      return 'Work intervals RPE 8–9; recovery jogs/walks RPE 4–5.';
    }
    if (ctx.variant === 'tempo' || ctx.tags.includes('threshold')) {
      return 'Tempo blocks RPE 7–8 — controlled hard, not a sprint.';
    }
    if (ctx.tags.includes('beginner') || ctx.tags.includes('walk_run')) {
      return 'Easy jog segments RPE 5–6; walk breaks RPE 3–4.';
    }
    return 'Steady aerobic work RPE 6–7 — full sentences out loud.';
  }

  if (ctx.category === 'strength_upper' || ctx.category === 'strength_lower' || ctx.category === 'full_body_strength') {
    if (ctx.difficulty === 'beginner') {
      return 'Working sets RPE 6–7 — 2–3 reps left in the tank; form beats load.';
    }
    return 'Primary lifts RPE 7–8; accessories RPE 7; stop a set if bar speed slows.';
  }

  if (ctx.category === 'hyrox') {
    if (ctx.tags.includes('hyrox_simulation')) {
      return 'Runs RPE 7–8; stations RPE 8–9 on race-pace simulations; skills days RPE 6–7.';
    }
    if (ctx.tags.includes('skills')) {
      return 'Station reps RPE 6–7 — drill quality; last round may reach RPE 8.';
    }
    return 'Mixed sessions: runs RPE 7, stations RPE 7–8 unless noted race pace.';
  }

  if (ctx.category === 'conditioning') {
    if (ctx.difficulty === 'beginner') {
      return 'RPE 6–7 — steady breathing, no redline on round 1.';
    }
    if (ctx.tags.includes('anaerobic') || ctx.tags.includes('tabata')) {
      return 'Work periods RPE 9; rest periods full reset to RPE 4.';
    }
    return 'Sustainable metcon RPE 7–8; peak pieces may touch RPE 9 on the last round only.';
  }

  return 'Most work RPE 6–8 — adjust rest before adding rounds.';
}
