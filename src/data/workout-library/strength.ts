import type { LibraryWorkout } from '@/types/workout';

export const STRENGTH_WORKOUTS: LibraryWorkout[] = [
  {
    id: 'STR-001',
    name: 'Heavy Lower Body',
    category: 'strength',
    description: 'Max-strength lower body with carries for hybrid durability.',
    difficulty: 'intermediate',
    duration: 60,
    equipment: ['barbell', 'dumbbells', 'sled_optional'],
    focusAreas: ['squat strength', 'posterior chain', 'grip endurance'],
    workoutType: 'max strength — lower body',
    warmup: `8 min easy bike, bodyweight squats and lunges, back squat ramp sets`,
    mainSet: `Back Squat 4x8
Romanian Deadlift 4x8
Walking Lunges 3x16 steps
Farmer Carry 4x45m`,
    cooldown: `Couch stretch, hamstring stretch, calf stretch, easy walk`,
  },
  {
    id: 'STR-002',
    name: 'Sled Power',
    category: 'strength',
    description: 'Leg strength and sled-specific power for HYROX stations.',
    difficulty: 'intermediate',
    duration: 55,
    equipment: ['barbell', 'sled', 'rower'],
    focusAreas: ['sled push', 'single-leg strength', 'core stability'],
    workoutType: 'sled power',
    warmup: `Easy row, leg swings, split squats, front squat ramp, light sled push`,
    mainSet: `Front Squat 4x8
Sled Push 6x20m
Bulgarian Split Squat 4x8 each leg
Front Plank 3x45 sec`,
    cooldown: `Hip flexor stretch, quad stretch, figure-4 glute stretch`,
  },
  {
    id: 'STR-003',
    name: 'Full Body Strength',
    category: 'strength',
    description: 'Balanced full-body strength for hybrid athletes.',
    difficulty: 'intermediate',
    duration: 65,
    equipment: ['barbell', 'pull-up bar', 'dumbbells'],
    focusAreas: ['deadlift', 'pressing', 'pulling', 'carry capacity'],
    workoutType: 'full-body strength',
    warmup: `Row or bike, mobility drills, deadlift ramp, push-ups and band pull-aparts`,
    mainSet: `Deadlift 4x8
Bench Press 4x8
Pull-Ups 4x8
Farmer Carry 4x50m`,
    cooldown: `Child's pose, chest stretch, lat stretch, hamstring stretch`,
  },
  {
    id: 'STR-004',
    name: 'Goblet Foundation',
    category: 'strength',
    description: 'Beginner-friendly squat and hinge — learn patterns you will use under fatigue at wall ball and lunge stations.',
    difficulty: 'beginner',
    duration: 40,
    equipment: ['dumbbells', 'kettlebell_optional'],
    focusAreas: ['squat pattern', 'hinge pattern', 'core bracing'],
    workoutType: 'movement foundation — strength',
    warmup: `Brisk walk, arm circles, bodyweight squats and hip hinges, light goblet squats`,
    mainSet: `Goblet Squat 3x12
DB Romanian Deadlift 3x12
DB Floor Press 3x10
Dead Bug 3x10 each side`,
    cooldown: `Quad stretch, hamstring stretch, figure-4 glute stretch`,
  },
  {
    id: 'STR-005',
    name: 'Upper Push & Pull',
    category: 'strength',
    description: 'Balanced upper push and pull for SkiErg and sled work — equal row volume to every press.',
    difficulty: 'intermediate',
    duration: 50,
    equipment: ['barbell', 'dumbbells', 'pull-up bar'],
    focusAreas: ['horizontal push', 'vertical pull', 'shoulder stability'],
    workoutType: 'upper-body strength balance',
    warmup: `Easy row, band pull-aparts and face pulls, push-ups, scapular pull-ups, empty bar bench and row`,
    mainSet: `Bench Press 4x8
Barbell Row 4x8
DB Shoulder Press 4x8
Face Pull 3x15`,
    cooldown: `Chest stretch, shoulder stretch, lat stretch`,
  },
  {
    id: 'STR-006',
    name: 'Trap Bar Strength',
    category: 'strength',
    description: 'Trap-bar deadlift focus with lower back-friendly loading.',
    difficulty: 'intermediate',
    duration: 55,
    equipment: ['trap_bar', 'dumbbells'],
    focusAreas: ['deadlift strength', 'grip', 'posterior chain'],
    workoutType: 'deadlift strength — trap bar',
    warmup: `Easy bike, hip hinge drill, glute bridges, trap bar ramp sets`,
    mainSet: `Trap Bar Deadlift 4x8
Single-Leg RDL 4x8 each
Pallof Press 3x12 each side
Suitcase Carry 3x45m each hand`,
    cooldown: `Hamstring stretch, hip flexor stretch, forearm shake-out`,
  },
  {
    id: 'STR-007',
    name: 'Sled Pull Strength',
    category: 'strength',
    description: 'Posterior chain and sled-pull specific pulling strength.',
    difficulty: 'intermediate',
    duration: 50,
    equipment: ['sled', 'rower', 'dumbbells'],
    focusAreas: ['sled pull', 'hamstrings', 'lat strength'],
    workoutType: 'sled pull strength',
    warmup: `Easy row, banded rows and face pulls, hip hinges, light sled pull`,
    mainSet: `Sled Pull 8x15m
Barbell Row 4x8
Hamstring Curl 3x12
Reverse Plank 3x30 sec`,
    cooldown: `Lat stretch, hamstring stretch, easy row`,
  },
  {
    id: 'STR-008',
    name: 'Overhead & Core',
    category: 'strength',
    description: 'Overhead stability for wall balls — pair every press with scapular control for shoulder durability.',
    difficulty: 'intermediate',
    duration: 45,
    equipment: ['dumbbells', 'barbell_optional', 'wall_ball'],
    focusAreas: ['overhead stability', 'core anti-rotation', 'shoulder endurance'],
    workoutType: 'overhead stability',
    warmup: `Easy bike, band pass-throughs, light wall balls, dead bugs, external rotation`,
    mainSet: `Push Press 4x8
Wall Ball 5x15
Turkish Get-Up 2x3 each side
Hollow Hold 3x30 sec`,
    cooldown: `Sleeper stretch, shoulder stretch, wrist stretch`,
  },
  {
    id: 'STR-009',
    name: 'Hip Thrust & Hamstring',
    category: 'strength',
    description: 'Glute and hamstring strength for running and sled work.',
    difficulty: 'intermediate',
    duration: 50,
    equipment: ['barbell', 'bench', 'dumbbells'],
    focusAreas: ['glute power', 'hamstring strength', 'hip extension'],
    workoutType: 'posterior chain development',
    warmup: `Easy jog or bike, glute bridges, good mornings, banded lateral walk, light hip thrust`,
    mainSet: `Barbell Hip Thrust 4x8
Romanian Deadlift 4x8
Copenhagen Plank 3x20 sec each
Step-Up 4x8 each leg`,
    cooldown: `Couch stretch, hamstring stretch, figure-4 glute stretch`,
  },
  {
    id: 'STR-010',
    name: 'Wall Ball Strength Endurance',
    category: 'strength',
    description: 'Leg and shoulder endurance specific to wall ball station.',
    difficulty: 'intermediate',
    duration: 45,
    equipment: ['wall_ball', 'dumbbells'],
    focusAreas: ['wall ball', 'squat endurance', 'shoulder stamina'],
    workoutType: 'wall ball strength endurance',
    warmup: `Bike, air squats, light wall balls, goblet squats, band pull-aparts`,
    mainSet: `Wall Ball 6x20
Goblet Squat 4x8
DB Push Press 4x8
Front Rack Hold 3x45 sec`,
    cooldown: `Quad stretch, lat side bend, forearm stretch, easy walk`,
  },
  {
    id: 'STR-011',
    name: 'Beginner DB Circuit',
    category: 'strength',
    description: 'Simple full-body circuit — equal push, pull, and legs to build HYROX-ready habits.',
    difficulty: 'beginner',
    duration: 35,
    equipment: ['dumbbells'],
    focusAreas: ['full body', 'work capacity', 'technique'],
    workoutType: 'general strength base',
    warmup: `Walk, arm circles, bodyweight squats and hip hinges, one light practice round`,
    mainSet: `3 rounds
DB Squat 3x12
DB Press 3x12
DB Row 3x12 each arm
Step-Up 3x10 each leg`,
    cooldown: `Calf stretch, chest stretch, hamstring stretch`,
  },
  {
    id: 'STR-012',
    name: 'Squat Wave',
    category: 'strength',
    description: 'Advanced squat wave loading for peak leg strength.',
    difficulty: 'advanced',
    duration: 70,
    equipment: ['barbell', 'rack'],
    focusAreas: ['squat max strength', 'leg drive', 'bracing'],
    workoutType: 'advanced squat strength',
    warmup: `Bike, leg swings and Cossack squats, back squat ramp to working weight`,
    mainSet: `Back Squat 1x5 at 75%
Back Squat 1x3 at 85%
Back Squat 1x2 at 90%
Back Squat 1x1 at 92%
Pause Squat 5x3 at 70%
Nordic Curl 3x6
Farmer Carry 4x50m`,
    cooldown: `Pigeon pose, couch stretch, calf stretch, easy walk`,
  },
  {
    id: 'STR-013',
    name: 'Heavy Deadlift & Carry',
    category: 'strength',
    description: 'Advanced pulling strength with grip-limited carries.',
    difficulty: 'advanced',
    duration: 65,
    equipment: ['barbell', 'dumbbells', 'trap_bar_optional'],
    focusAreas: ['deadlift max', 'grip strength', 'hyrox carry prep'],
    workoutType: 'max deadlift + carry',
    warmup: `Easy row, hip hinges and glute bridges, deadlift ramp, moderate farmer carry`,
    mainSet: `Deadlift 5x3
Deficit Deadlift 5x3 at 75%
Farmer Carry 6x45m
Barbell Hold 3x20 sec`,
    cooldown: `Hamstring stretch, hip flexor stretch, forearm stretch`,
  },
  {
    id: 'STR-014',
    name: 'Single-Leg Strength',
    category: 'strength',
    description: 'Unilateral leg strength for lunge station and injury resilience.',
    difficulty: 'intermediate',
    duration: 50,
    equipment: ['dumbbells', 'bench'],
    focusAreas: ['single-leg strength', 'lunge pattern', 'balance'],
    workoutType: 'unilateral leg strength',
    warmup: `Easy jog, reverse lunges, lateral band walk, single-leg RDL, light split squats`,
    mainSet: `Bulgarian Split Squat 4x8 each
Single-Leg RDL 4x8 each
Walking Lunges 3x20 steps
Standing Calf Raise 4x8`,
    cooldown: `Hip flexor stretch, quad stretch, ankle rocks, figure-4 glute stretch`,
  },
  {
    id: 'STR-015',
    name: 'Hybrid Strength Complex',
    category: 'strength',
    description: 'Advanced complex pairing strength lifts with race movements.',
    difficulty: 'advanced',
    duration: 60,
    equipment: ['barbell', 'wall_ball', 'sled_optional'],
    focusAreas: ['strength-power', 'race movements', 'fatigue resistance'],
    workoutType: 'strength complex — race prep',
    warmup: `Row or jog, front squat ramp, light wall balls, light sled push, pull-ups or rows`,
    mainSet: `4 rounds
Front Squat 5x3-5
Wall Ball 10
Sled Push 20m
Pull-Up or Barbell Row 5x3-5`,
    cooldown: `Easy walk, couch stretch, sleeper stretch, breathing`,
  },
];
