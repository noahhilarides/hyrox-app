/**
 * HYROX race-station coaching cues — merged onto workouts by tag inference.
 */
export type HyroxStationKey =
  | 'running'
  | 'ski_erg'
  | 'row'
  | 'sled_push'
  | 'sled_pull'
  | 'wall_ball'
  | 'burpee'
  | 'farmer_carry'
  | 'lunge';

export const HYROX_STATION_CUES: Record<HyroxStationKey, string[]> = {
  running: [
    'Stay tall — think "hips forward," not leaning from the waist.',
    'On 1 km repeats, start 2–3 sec slower than race pace; negative split if you can.',
    'First 200 m off the rower/ski: quick cadence, then settle — don\'t sprint the transition.',
    'Arms relaxed below chest; drive the knee, don\'t overstride.',
  ],
  ski_erg: [
    'Long arms at the catch; snap the handle past the knees, then finish with triceps.',
    'Breathe out on the pull — avoid holding breath through the drive.',
    'Legs do 60% of the work; save arms for the last 250 m of each piece.',
    'Damper 5–7 for most HYROX prep; higher is not always faster.',
  ],
  row: [
    'Sequence: legs → back → arms; recovery is arms → back → legs.',
    'Grip the handle with relaxed fingers — death grip costs the farmer carry later.',
    'Target 24–28 spm for race pieces; 18–22 spm for aerobic work.',
    'Sit tall at the finish; don\'t collapse the chest between strokes.',
  ],
  sled_push: [
    'Low hips, arms extended — you are pushing the floor away, not pressing up on handles.',
    'Short, quick steps; if you stall, reset feet under hips before the next drive.',
    'Exhale on each push; brace before you move the sled.',
    'Race tip: first 5 m are setup — don\'t sprint, then build rhythm.',
  ],
  sled_pull: [
    'Hands low on the rope; sit back and walk backward with purpose.',
    'Drive elbows to ribs — think row, not upright shrug.',
    'Take short steps; if rope slackens, you are too upright.',
    'Keep the sled path straight — one correction beats three zigzags.',
  ],
  wall_ball: [
    'Full squat every rep — no shallow cuts when tired.',
    'Catch the ball softly at chest height; don\'t let it drop to the waist.',
    'Breathe: exhale on throw, quick inhale on catch.',
    'Break sets before form breaks — 15 unbroken beats 30 sloppy.',
  ],
  burpee: [
    'Hands under shoulders; chest and thighs touch on the floor.',
    'Stand up fully before the jump — no half reps under fatigue.',
    'Step-back or box burpees are race-legal when grip and lungs are gone.',
    'Find a cadence you can hold for 80 reps — sprinting the first 20 costs the run.',
  ],
  farmer_carry: [
    'Tall posture, shoulders packed — don\'t shrug to your ears.',
    'Short, quick steps; look 10 m ahead, not at your feet.',
    'Grip: crush the handle in the first 10 m, then breathe and relax forearms slightly.',
    'Turn corners wide and slow — a dropped implement is slower than a controlled turn.',
  ],
  lunge: [
    'Knee tracks over mid-foot; back knee kisses the floor, don\'t crash it.',
    'Torso slightly forward; drive through the front heel to stand.',
    'Count steps, not reps per leg — HYROX is 100 m total forward travel.',
    'If quads burn, shorten stride 2 inches before slowing down.',
  ],
};
