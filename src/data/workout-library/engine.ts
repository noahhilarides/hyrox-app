import type { LibraryWorkout } from '@/types/workout';

export const ENGINE_WORKOUTS: LibraryWorkout[] = [
  {
    id: 'ENG-001',
    name: 'Mini HYROX',
    category: 'engine',
    description: 'Short race-format engine block.',
    difficulty: 'advanced',
    duration: 55,
    equipment: ['running', 'ski_erg', 'rower'],
    focusAreas: ['race pacing', 'station management'],
    workoutType: 'race engine',
    warmup: `Easy jog, easy ski or row, strides`,
    mainSet: `3 rounds
1000m run
500m SkiErg
20 Burpee Broad Jumps
20 Walking Lunges`,
    cooldown: `Walk, calf hip flexor and lat stretch`,
  },
  {
    id: 'ENG-002',
    name: 'Race Simulation',
    category: 'engine',
    description: 'Full HYROX-style simulation with run + station pairs.',
    difficulty: 'advanced',
    duration: 75,
    equipment: ['running', 'sled', 'rower'],
    focusAreas: ['race simulation', 'pacing', 'mental toughness'],
    workoutType: 'race pacing',
    warmup: `Progressive jog, light sled work, transition row`,
    mainSet: `1000m run
50m Sled Push
1000m run
50m Sled Pull
1000m run
40 Burpee Broad Jumps
1000m run
500m RowErg`,
    cooldown: `Easy walk or jog, full body stretch, hydrate`,
  },
  {
    id: 'ENG-003',
    name: 'Engine Builder 20',
    category: 'engine',
    description: 'Twenty-minute high-output block for intermediate engine development.',
    difficulty: 'intermediate',
    duration: 35,
    equipment: ['running', 'rower'],
    focusAreas: ['work capacity', 'lactate tolerance'],
    workoutType: 'short engine block',
    warmup: `Easy jog and easy row`,
    mainSet: `4 rounds
200m run
250m RowErg
15 Burpee Broad Jumps
12 Walking Lunges`,
    cooldown: `Walk, calf and hip flexor stretch`,
  },
  {
    id: 'ENG-004',
    name: 'Beginner Engine Intro',
    category: 'engine',
    description: 'Introductory engine work at RPE 6–7 — learn pacing before race-density sessions.',
    difficulty: 'beginner',
    duration: 35,
    equipment: ['running', 'rower_optional'],
    focusAreas: ['work capacity', 'confidence'],
    workoutType: 'engine introduction',
    warmup: `Brisk walk and walk-jog mix`,
    mainSet: `3 rounds
400m run
200m RowErg
10 Burpee Broad Jumps`,
    cooldown: `Walk and breathing`,
  },
  {
    id: 'ENG-005',
    name: 'Ski-Burpee Engine',
    category: 'engine',
    description: 'Ski and burpee pairing for upper-lower engine stress.',
    difficulty: 'intermediate',
    duration: 45,
    equipment: ['ski_erg', 'running'],
    focusAreas: ['ski power', 'burpee capacity'],
    workoutType: 'ski-burpee engine',
    warmup: `Easy jog and easy ski`,
    mainSet: `4 rounds
400m run
500m SkiErg
15 Burpee Broad Jumps`,
    cooldown: `Easy row or walk, shoulder and hip stretch`,
  },
  {
    id: 'ENG-006',
    name: 'Death by 1k',
    category: 'engine',
    description: 'Progressive 1k runs with increasing station penalty each round.',
    difficulty: 'advanced',
    duration: 60,
    equipment: ['running', 'wall_ball'],
    focusAreas: ['1k pacing', 'escalating fatigue'],
    workoutType: 'progressive engine — 1k',
    warmup: `Jog building to race feel, light wall balls, strides`,
    mainSet: `1000m run
20 Wall Balls
1000m run
25 Wall Balls
1000m run
30 Wall Balls
1000m run
35 Wall Balls
1000m run
40 Wall Balls`,
    cooldown: `Walk, shoulder and quad stretch`,
  },
  {
    id: 'ENG-007',
    name: 'Row Engine 40',
    category: 'engine',
    description: 'Row-dominant engine for athletes prioritizing row station.',
    difficulty: 'intermediate',
    duration: 40,
    equipment: ['rower', 'running'],
    focusAreas: ['rowing power', 'aerobic power'],
    workoutType: 'row-focused engine',
    warmup: `Easy row and easy jog`,
    mainSet: `5 rounds
300m run
500m RowErg`,
    cooldown: `Easy row and lat stretch`,
  },
  {
    id: 'ENG-008',
    name: 'Full Send Simulation',
    category: 'engine',
    description: 'Extended race simulation with all eight station types.',
    difficulty: 'advanced',
    duration: 90,
    equipment: ['running', 'ski_erg', 'sled', 'rower', 'wall_ball', 'dumbbells'],
    focusAreas: ['full race', 'pacing', 'nutrition'],
    workoutType: 'full race simulation',
    warmup: `Progressive jog, light touch each station`,
    mainSet: `1000m run
1000m SkiErg
1000m run
50m Sled Push
1000m run
50m Sled Pull
1000m run
80 Burpee Broad Jumps
1000m run
1000m RowErg
1000m run
200m Farmers Carry
1000m run
100m Walking Lunges
1000m run
100 Wall Balls`,
    cooldown: `Walk, stretch, electrolytes`,
  },
  {
    id: 'ENG-009',
    name: 'Tabata Engine',
    category: 'engine',
    description: 'Short maximal bursts for anaerobic engine top-end.',
    difficulty: 'intermediate',
    duration: 30,
    equipment: ['rower', 'ski_erg_optional'],
    focusAreas: ['anaerobic power', 'repeatability'],
    workoutType: 'anaerobic engine — tabata',
    warmup: `Easy jog and easy row`,
    mainSet: `200m run
RowErg Tabata 8 rounds
200m run
SkiErg Tabata 8 rounds
200m run
Burpee Broad Jump Tabata 8 rounds
200m run
Air Squat Tabata 8 rounds`,
    cooldown: `Walk and breathing`,
  },
  {
    id: 'ENG-010',
    name: 'Compromised Run',
    category: 'engine',
    description: 'Hard stations immediately before race-pace 1k runs.',
    difficulty: 'advanced',
    duration: 50,
    equipment: ['running', 'wall_ball', 'rower'],
    focusAreas: ['compromised running', 'race legs'],
    workoutType: 'compromised run engine',
    warmup: `Easy jog, light wall balls, easy row`,
    mainSet: `4 rounds
1000m run
25 Wall Balls
500m RowErg
800m run`,
    cooldown: `Easy jog, walk, quad and lat stretch`,
  },
];
