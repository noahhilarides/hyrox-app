import type { LibraryWorkout } from '@/types/workout';

export const RECOVERY_WORKOUTS: LibraryWorkout[] = [
  {
    id: 'RCV-001',
    name: 'Mobility Flow',
    category: 'recovery',
    description: 'Full-body mobility to restore range of motion after hard hybrid weeks.',
    difficulty: 'beginner',
    duration: 30,
    equipment: ['bodyweight'],
    focusAreas: ['mobility', 'hips', 'T-spine', 'ankles'],
    workoutType: 'mobility flow',
    warmup: `3 min easy walk`,
    mainSet: `Hip flexor stretch 60 sec each side
Figure-4 glute stretch 60 sec each side
Couch stretch 60 sec each side
World's Greatest Stretch 5 reps each side
Cat-cow 10 reps
Open book 8 reps each side
Knee-to-wall ankle rocks 10 each
Shoulder CARs 5 each direction`,
    cooldown: `Restorative box breathing`,
  },
  {
    id: 'RCV-002',
    name: 'Recovery Run',
    category: 'recovery',
    description: 'Very easy jog to promote blood flow without adding training stress.',
    difficulty: 'beginner',
    duration: 35,
    equipment: ['running'],
    focusAreas: ['active recovery', 'easy pacing', 'legs'],
    workoutType: 'recovery run',
    warmup: `5 min easy walk`,
    mainSet: `12 min brisk walk
Standing quad stretch 45 sec each
Half-kneeling hip flexor stretch 45 sec each
Pigeon pose 60 sec each side
Wall calf stretch 45 sec each
5 min slow walk`,
    cooldown: `Walk and nasal breathing`,
  },
  {
    id: 'RCV-003',
    name: 'Easy Bike Flush',
    category: 'recovery',
    description: 'Low-impact spin when legs need relief from running volume.',
    difficulty: 'beginner',
    duration: 30,
    equipment: ['bike'],
    focusAreas: ['active recovery', 'joint-friendly', 'blood flow'],
    workoutType: 'easy bike recovery',
    warmup: `2 min easy walk`,
    mainSet: `Hip circles 8 each direction
Figure-4 stretch seated 60 sec each side
Supine hamstring stretch 60 sec each
Standing quad stretch 45 sec each
3 min easy pedal at zero resistance`,
    cooldown: `Hip flexor stretch and hydrate`,
  },
  {
    id: 'RCV-004',
    name: 'Row Flush',
    category: 'recovery',
    description: 'Easy rowing to open the upper back and hips without race intensity.',
    difficulty: 'intermediate',
    duration: 30,
    equipment: ['rower'],
    focusAreas: ['rowing recovery', 'posture', 'breathing'],
    workoutType: 'row flush',
    warmup: `3 min easy walk`,
    mainSet: `Forearm flexor stretch 45 sec each
Forearm extensor stretch 45 sec each
Lat stretch 60 sec each side
Foam roll upper back 60 sec
Open book 8 reps each side
90/90 hip stretch 60 sec each side
Couch stretch 45 sec each`,
    cooldown: `Walk and nasal breathing`,
  },
  {
    id: 'RCV-005',
    name: 'Ski Flush',
    category: 'recovery',
    description: 'Light ski erg to keep shoulders moving without training load.',
    difficulty: 'intermediate',
    duration: 30,
    equipment: ['ski_erg'],
    focusAreas: ['shoulder recovery', 'technique', 'easy aerobic'],
    workoutType: 'ski flush',
    warmup: `3 min easy walk`,
    mainSet: `Cross-body shoulder stretch 60 sec each
Sleeper stretch 45 sec each
Band dislocates 10 reps
Wall slides 10 reps
Forearm stretch 45 sec each
Relaxed dead hang 20 sec
Figure-4 stretch 60 sec each side
Hip flexor stretch 60 sec each side`,
    cooldown: `Walk and box breathing`,
  },
  {
    id: 'RCV-006',
    name: 'Mobility + Walk',
    category: 'recovery',
    description: 'Walk plus mobility — ideal after missed sessions or heavy race sims.',
    difficulty: 'beginner',
    duration: 35,
    equipment: ['bodyweight'],
    focusAreas: ['mobility', 'nervous system', 'restoration'],
    workoutType: 'mobility + walk',
    warmup: `2 min easy walk`,
    mainSet: `12 min walk at easy pace
Hip flexor stretch 60 sec each side
Figure-4 glute stretch 60 sec each side
Couch stretch 60 sec each side
Supine hamstring stretch 45 sec each side
Doorway chest stretch 45 sec each side
Forearm stretch 30 sec each side`,
    cooldown: `Hydrate and box breathing`,
  },
];
