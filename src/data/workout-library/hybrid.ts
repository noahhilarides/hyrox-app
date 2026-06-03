import type { LibraryWorkout } from '@/types/workout';

export const HYBRID_WORKOUTS: LibraryWorkout[] = [
  {
    id: 'HYB-001',
    name: 'Hybrid Builder',
    category: 'hybrid',
    description: 'Mixed modal circuit building race-specific work capacity.',
    difficulty: 'intermediate',
    duration: 50,
    equipment: ['running', 'wall_ball'],
    focusAreas: ['work capacity', 'station transitions'],
    workoutType: 'hybrid conditioning',
    warmup: `Easy jog, leg swings, light wall balls, transition jogs`,
    mainSet: `3 rounds
800m run
20 Wall Balls
20 Walking Lunges
15 Burpee Broad Jumps`,
    cooldown: `Walk, shoulder stretch, quad and hip flexor stretch`,
  },
  {
    id: 'HYB-002',
    name: 'Strength + Run',
    category: 'hybrid',
    description: 'Strength endurance circuit with run intervals.',
    difficulty: 'intermediate',
    duration: 45,
    equipment: ['running', 'kettlebell', 'dumbbells'],
    focusAreas: ['strength endurance', 'running under fatigue'],
    workoutType: 'strength-endurance hybrid',
    warmup: `400m easy jog, goblet squats, DB press, easy burpees`,
    mainSet: `4 rounds
400m run
15 Goblet Squats
15 DB Push Press
10 Burpee Broad Jumps`,
    cooldown: `Walk, forearm and shoulder stretch, hip flexor stretch`,
  },
  {
    id: 'HYB-003',
    name: 'Run-Burpee-Lunge',
    category: 'hybrid',
    description: 'Intro to burpees and lunges with easy runs — same movements, lower density than race day.',
    difficulty: 'beginner',
    duration: 40,
    equipment: ['running'],
    focusAreas: ['burpees', 'lunges', 'running transitions'],
    workoutType: 'station trio — beginner hybrid',
    warmup: `Walk-jog mix, burpees, walking lunges`,
    mainSet: `3 rounds
600m run
12 Burpee Broad Jumps
16 Walking Lunges`,
    cooldown: `Walk, calf stretch, quad stretch`,
  },
  {
    id: 'HYB-004',
    name: 'Row-Run Brick',
    category: 'hybrid',
    description: 'Alternating row and run at moderate effort.',
    difficulty: 'intermediate',
    duration: 45,
    equipment: ['running', 'rower'],
    focusAreas: ['row-run transitions', 'pacing'],
    workoutType: 'row-run hybrid brick',
    warmup: `Easy jog, easy row, transition drill`,
    mainSet: `4 rounds
600m run
500m RowErg`,
    cooldown: `Easy row, lat stretch, calf stretch`,
  },
  {
    id: 'HYB-005',
    name: 'Ski-Wall Ball',
    category: 'hybrid',
    description: 'Upper-body station pairing common in race flow.',
    difficulty: 'intermediate',
    duration: 40,
    equipment: ['ski_erg', 'wall_ball'],
    focusAreas: ['ski', 'wall ball', 'shoulder fatigue'],
    workoutType: 'ski + wall ball hybrid',
    warmup: `Easy ski, light wall balls, easy jog`,
    mainSet: `5 rounds
400m run
500m SkiErg
20 Wall Balls`,
    cooldown: `Easy ski or row, shoulder stretch, wrist stretch`,
  },
  {
    id: 'HYB-006',
    name: 'Sled Push + Run',
    category: 'hybrid',
    description: 'Sled push repeats with 1k runs between efforts.',
    difficulty: 'intermediate',
    duration: 50,
    equipment: ['running', 'sled'],
    focusAreas: ['sled push', '1k run', 'leg fatigue'],
    workoutType: 'sled-run hybrid',
    warmup: `Easy jog, light sled push, transition jogs`,
    mainSet: `4 rounds
1000m run
4 x 12.5m Sled Push`,
    cooldown: `Walk, quad stretch, calf stretch`,
  },
  {
    id: 'HYB-007',
    name: 'Carry & Run',
    category: 'hybrid',
    description: 'Farmer carry paired with short runs for grip and legs.',
    difficulty: 'intermediate',
    duration: 45,
    equipment: ['running', 'dumbbells'],
    focusAreas: ['farmer carry', 'running', 'grip endurance'],
    workoutType: 'carry-run hybrid',
    warmup: `Easy jog, light farmer carry, grip shake-out`,
    mainSet: `5 rounds
400m run
50m Farmers Carry`,
    cooldown: `Walk, forearm stretch, trap stretch`,
  },
  {
    id: 'HYB-008',
    name: 'Half HYROX Flow',
    category: 'hybrid',
    description: 'Half-distance race flow: 4 runs + 4 stations.',
    difficulty: 'advanced',
    duration: 65,
    equipment: ['running', 'rower', 'ski_erg', 'wall_ball'],
    focusAreas: ['race flow', 'pacing', 'transitions'],
    workoutType: 'half race flow hybrid',
    warmup: `Jog building to race feel, easy ski and row, light wall balls, strides`,
    mainSet: `1000m run
500m SkiErg
1000m run
25 Wall Balls
1000m run
500m RowErg
1000m run
20 Burpee Broad Jumps`,
    cooldown: `Walk, full body stretch`,
  },
  {
    id: 'HYB-009',
    name: 'EMOM Hybrid',
    category: 'hybrid',
    description: 'Clock-based work for pacing discipline under time pressure.',
    difficulty: 'intermediate',
    duration: 40,
    equipment: ['running', 'kettlebell'],
    focusAreas: ['pacing', 'work capacity', 'time management'],
    workoutType: 'EMOM hybrid conditioning',
    warmup: `Easy jog, KB swings, easy burpees`,
    mainSet: `5 rounds
200m run
12 KB Swings
8 Goblet Squats
10 Burpee Broad Jumps`,
    cooldown: `Walk, hip flexor and hamstring stretch`,
  },
  {
    id: 'HYB-010',
    name: 'Descending Ladder',
    category: 'hybrid',
    description: 'Descending rep ladder with steady runs between sets.',
    difficulty: 'intermediate',
    duration: 45,
    equipment: ['running', 'wall_ball'],
    focusAreas: ['pacing strategy', 'mental toughness'],
    workoutType: 'ladder hybrid',
    warmup: `Easy jog, light wall balls, strides`,
    mainSet: `5 rounds
400m run
20 Wall Balls
400m run
16 Wall Balls
400m run
12 Wall Balls
400m run
8 Wall Balls
400m run
4 Wall Balls`,
    cooldown: `Walk, shoulder and quad stretch`,
  },
  {
    id: 'HYB-011',
    name: 'Beginner Circuit',
    category: 'hybrid',
    description: 'Confidence-building circuit — incline push-ups and walk/jog are part of the design.',
    difficulty: 'beginner',
    duration: 35,
    equipment: ['running', 'dumbbells_optional'],
    focusAreas: ['full body', 'confidence', 'transitions'],
    workoutType: 'intro hybrid circuit',
    warmup: `Brisk walk with tall posture`,
    mainSet: `3 rounds
400m run
10 Bodyweight Squats
10 Push-ups
10 Walking Lunges`,
    cooldown: `Walk, chest stretch, calf stretch`,
  },
  {
    id: 'HYB-012',
    name: 'Sled Pull + Row',
    category: 'hybrid',
    description: 'Pulling stations with short run connectors.',
    difficulty: 'intermediate',
    duration: 50,
    equipment: ['running', 'sled', 'rower'],
    focusAreas: ['sled pull', 'rowing', 'posterior chain'],
    workoutType: 'pull-station hybrid',
    warmup: `Easy jog, easy row, light sled pull`,
    mainSet: `4 rounds
800m run
3 x 12.5m Sled Pull
250m RowErg`,
    cooldown: `Easy row, lat and hamstring stretch`,
  },
  {
    id: 'HYB-013',
    name: 'Wall Ball 100',
    category: 'hybrid',
    description: 'Century wall ball challenge split across runs.',
    difficulty: 'advanced',
    duration: 55,
    equipment: ['running', 'wall_ball'],
    focusAreas: ['wall ball volume', 'pacing', 'shoulder endurance'],
    workoutType: 'wall ball volume hybrid',
    warmup: `Jog building to race feel, light wall balls, transition jogs`,
    mainSet: `600m run
20 Wall Balls
600m run
20 Wall Balls
600m run
20 Wall Balls
600m run
20 Wall Balls
600m run
20 Wall Balls`,
    cooldown: `Walk, shoulder stretch, forearm stretch`,
  },
  {
    id: 'HYB-014',
    name: 'Tri-Modal 30',
    category: 'hybrid',
    description: 'Thirty-minute continuous run-row-ski rotation.',
    difficulty: 'intermediate',
    duration: 30,
    equipment: ['running', 'rower', 'ski_erg'],
    focusAreas: ['multi-modal', 'steady effort'],
    workoutType: 'continuous tri-modal hybrid',
    warmup: `Easy jog, easy row, easy ski, transition drill`,
    mainSet: `2 rounds
5 min run
5 min SkiErg
5 min RowErg`,
    cooldown: `Walk, lat and shoulder stretch`,
  },
  {
    id: 'HYB-015',
    name: 'Burpee 80',
    category: 'hybrid',
    description: 'Eighty burpees across four runs at race intent.',
    difficulty: 'advanced',
    duration: 50,
    equipment: ['running'],
    focusAreas: ['burpee volume', 'run pacing'],
    workoutType: 'burpee volume hybrid',
    warmup: `Jog building to race feel, easy burpees, strides`,
    mainSet: `4 rounds
800m run
20 Burpee Broad Jumps`,
    cooldown: `Walk, hip flexor and calf stretch`,
  },
  {
    id: 'HYB-016',
    name: 'Goblet & Grind',
    category: 'hybrid',
    description: 'DB and easy runs — build hybrid habits without sleds or a barbell.',
    difficulty: 'beginner',
    duration: 40,
    equipment: ['dumbbells', 'running'],
    focusAreas: ['strength endurance', 'running'],
    workoutType: 'dumbbell hybrid',
    warmup: `Walk-jog mix, light goblet squats and rows`,
    mainSet: `4 rounds
500m run
12 Goblet Squats
12 DB Push Press`,
    cooldown: `Walk, shoulder and hip stretch`,
  },
  {
    id: 'HYB-017',
    name: '1k Station Pairs',
    category: 'hybrid',
    description: 'Eight 1k runs with station pairs matching race order subset.',
    difficulty: 'advanced',
    duration: 70,
    equipment: ['running', 'sled', 'rower', 'wall_ball'],
    focusAreas: ['race specificity', '1k pacing'],
    workoutType: 'race-order hybrid subset',
    warmup: `Progressive jog, light sled push, light wall balls, moderate row`,
    mainSet: `1000m run
50m Sled Push
1000m run
25 Wall Balls
1000m run
500m RowErg
1000m run
20 Burpee Broad Jumps
1000m run
100m Farmers Carry`,
    cooldown: `Easy walk, hips quads and shoulders stretch`,
  },
  {
    id: 'HYB-018',
    name: 'Lunge Mile',
    category: 'hybrid',
    description: 'Accumulate 100 lunges across mile-equivalent running.',
    difficulty: 'intermediate',
    duration: 45,
    equipment: ['running'],
    focusAreas: ['lunge volume', 'leg endurance'],
    workoutType: 'lunge-run hybrid',
    warmup: `Easy jog, walking lunges, transition jogs`,
    mainSet: `4 rounds
400m run
25 Walking Lunges
400m run
25 Walking Lunges`,
    cooldown: `Walk, quad and hip flexor stretch`,
  },
  {
    id: 'HYB-019',
    name: 'Chipper Lite',
    category: 'hybrid',
    description: 'Single-pass chipper at controlled pace for intermediate athletes.',
    difficulty: 'intermediate',
    duration: 50,
    equipment: ['running', 'rower', 'wall_ball'],
    focusAreas: ['chipper pacing', 'full body'],
    workoutType: 'chipper hybrid',
    warmup: `Easy jog, easy row, light wall balls`,
    mainSet: `800m run
500m RowErg
400m run
30 Wall Balls
400m run
25 Burpee Broad Jumps
400m run
20 Walking Lunges`,
    cooldown: `Walk, lat shoulder and quad stretch`,
  },
  {
    id: 'HYB-020',
    name: 'Double Station',
    category: 'hybrid',
    description: 'Two stations back-to-back before each run — race fatigue prep.',
    difficulty: 'advanced',
    duration: 55,
    equipment: ['running', 'ski_erg', 'wall_ball', 'rower'],
    focusAreas: ['station stacking', 'pacing'],
    workoutType: 'stacked station hybrid',
    warmup: `Jog building to race feel, easy ski, light wall balls, transition jogs`,
    mainSet: `2 rounds
600m run
500m SkiErg
20 Wall Balls
2 rounds
600m run
400m RowErg
20 Wall Balls`,
    cooldown: `Walk, shoulder and hip mobility`,
  },
];
