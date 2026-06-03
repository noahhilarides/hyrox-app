import type { WorkoutCategory, WorkoutDifficulty } from '@/types/workout';

export interface ProgressionContext {
  id: string;
  category: WorkoutCategory;
  difficulty: WorkoutDifficulty;
  variant?: string;
  tags: string[];
  duration: number;
}

function phaseHint(tags: string[]): string {
  if (tags.includes('taper_phase')) {
    return ' In taper weeks, hold load and trim 10–15% volume if legs feel flat.';
  }
  if (tags.includes('peak_phase')) {
    return ' In peak phase, prioritize race-pace intent over adding volume.';
  }
  if (tags.includes('build_phase')) {
    return ' In build phase, progress one variable at a time (load, reps, or density).';
  }
  if (tags.includes('base_phase')) {
    return ' In base phase, nail technique and consistency before chasing load.';
  }
  return '';
}

function beginnerRunning(ctx: ProgressionContext): string {
  const phase = phaseHint(ctx.tags);
  return (
    `Build confidence first: finish every session feeling like you could do one more easy minute. ` +
    `When walk breaks are optional, extend continuous jogging by 2 min per week (max +10 min/month). ` +
    `Keep easy days at RPE 5–6 — talking pace.${phase}`
  );
}

function runningProgression(ctx: ProgressionContext): string {
  if (ctx.tags.includes('beginner') || ctx.tags.includes('walk_run')) {
    return beginnerRunning(ctx);
  }
  const phase = phaseHint(ctx.tags);
  if (ctx.variant === 'long') {
    return (
      `Add 5–10 min every 1–2 weeks while staying in Zone 2 (RPE 6–7). ` +
      `Last 15 min of long runs should feel steady, not strained. Practice race fueling on runs over 50 min.${phase}`
    );
  }
  if (ctx.variant === 'tempo' || ctx.tags.includes('threshold')) {
    return (
      `When you complete all reps at the same split, add 1 rep or 2 min to the tempo block next week. ` +
      `Tempo = RPE 7–8, controlled breathing.${phase}`
    );
  }
  if (ctx.variant === 'speed' || ctx.tags.includes('intervals')) {
    return (
      `Hold interval splits within 2–3 sec before adding reps. Speed days: RPE 8–9 on work, full recovery on rest. ` +
      `Never stack hard run days back-to-back with HYROX station work.${phase}`
    );
  }
  return (
    `Easy runs stay RPE 6–7. Progress duration 5 min every 1–2 weeks or add strides, not both in the same week.${phase}`
  );
}

function strengthProgression(ctx: ProgressionContext): string {
  const phase = phaseHint(ctx.tags);
  if (ctx.difficulty === 'beginner') {
    return (
      `Add 1–2 reps per set when the last set feels like RPE 6. ` +
      `Master the pattern before adding load. Rest full 90 sec between rounds.${phase}`
    );
  }
  if (ctx.category === 'strength_upper' || ctx.tags.includes('upper_body')) {
    return (
      `Progress primary lifts when the top set is RPE 7–8 with clean form. ` +
      `Keep horizontal push and pull volume balanced (1:1 sets). ` +
      `If pressing dominates, add one back-off set of rows before increasing bench load.${phase}`
    );
  }
  if (ctx.tags.includes('sled_push') || ctx.tags.includes('sled_pull')) {
    return (
      `Progress sled work by load (2.5–5 kg) or one extra rep per week, not both. ` +
      `Splits should stay within 3 sec before loading heavier.${phase}`
    );
  }
  return (
    `Add 2.5–5 kg or one rep per set when working sets are RPE 7 with 2 reps in reserve. ` +
    `Deload every 4th week if soreness stacks across squats and running.${phase}`
  );
}

function hyroxProgression(ctx: ProgressionContext): string {
  const phase = phaseHint(ctx.tags);
  if (ctx.tags.includes('hyrox_simulation') || ctx.variant === 'simulation') {
    return (
      `Run simulations at race effort (RPE 8–9 on stations, controlled 1 km runs). ` +
      `Log transition times. Progress by shaving rest 15–30 sec or adding one station round before adding load.${phase}`
    );
  }
  if (ctx.tags.includes('skills') || ctx.variant === 'stations') {
    return (
      `Track station splits each week. When the last round matches the first (+/- 5 sec), add one rep or 50 m distance. ` +
      `Technique before speed on ski, row, and sled.${phase}`
    );
  }
  return (
    `Progress hybrid sessions by density (shorter rest) before adding rounds. ` +
    `Aim even splits round-to-round — if round 4 drops >10%, scale rest next time.${phase}`
  );
}

function conditioningProgression(ctx: ProgressionContext): string {
  const phase = phaseHint(ctx.tags);
  if (ctx.difficulty === 'beginner') {
    return (
      `Complete all rounds at RPE 6–7 before shortening rest. ` +
      `Walk during rest is fine — consistency beats speed early.${phase}`
    );
  }
  return (
    `Beat last week's score by one round or 30 sec before adding complexity. ` +
    `Conditioning work: RPE 7–8 sustainable, RPE 9 only on named peak sessions.${phase}`
  );
}

function recoveryProgression(ctx: ProgressionContext): string {
  return (
    `No progression on load — add 5 min easy movement only if you finish feeling fresher than you started. ` +
    `If soreness is high (RPE 7+ walking), swap to mobility-only for the day.`
  );
}

export function buildProgressionNotes(ctx: ProgressionContext): string {
  switch (ctx.category) {
    case 'running':
      return runningProgression(ctx);
    case 'strength_upper':
    case 'strength_lower':
    case 'full_body_strength':
      return strengthProgression(ctx);
    case 'hyrox':
      return hyroxProgression(ctx);
    case 'conditioning':
      return conditioningProgression(ctx);
    case 'recovery':
      return recoveryProgression(ctx);
    default:
      return conditioningProgression(ctx);
  }
}
