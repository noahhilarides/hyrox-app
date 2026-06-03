import type {
  Equipment,
  ExperienceLevel,
  FitnessLevel,
  Goal,
  Weakness,
  WorkoutLength,
} from '@/types';

export const ONBOARDING_STEPS = [
  'goal',
  'race',
  'fitness',
  'running',
  'strength',
  'schedule',
  'equipment',
  'weaknesses',
  'duration',
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number];

export const GOAL_OPTIONS: { value: Goal; label: string; description: string }[] = [
  {
    value: 'hyrox_race',
    label: 'HYROX race',
    description: 'Train toward a specific race day',
  },
  {
    value: 'hybrid_fitness',
    label: 'Hybrid fitness',
    description: 'Balance run, strength & stations',
  },
  {
    value: 'endurance',
    label: 'Endurance',
    description: 'Build aerobic engine for hybrid work',
  },
  {
    value: 'strength',
    label: 'Strength',
    description: 'Get stronger while staying run-fit',
  },
  {
    value: 'performance_training',
    label: 'Performance Training',
    description: 'Year-round strength, endurance & work capacity',
  },
];

export const FITNESS_OPTIONS: { value: FitnessLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Getting started', description: 'New to structured hybrid training' },
  { value: 'intermediate', label: 'Training regularly', description: '1+ years of gym or running' },
  { value: 'advanced', label: 'Experienced athlete', description: 'Comfortable with high volume' },
];

export const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string; description: string }[] =
  [
    { value: 'none', label: 'Minimal', description: 'Just starting out' },
    { value: 'some', label: 'Some', description: 'Occasional sessions' },
    { value: 'regular', label: 'Regular', description: 'Weekly habit' },
    { value: 'competitive', label: 'Competitive', description: 'Races or structured blocks' },
  ];

export const DAYS_OPTIONS = [3, 4, 5, 6].map((n) => ({
  value: n,
  label: `${n} days`,
  description: n <= 4 ? 'Foundation block' : 'Higher volume block',
}));

export const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: 'full_gym', label: 'Commercial gym' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'kettlebells', label: 'Kettlebells' },
  { value: 'sled', label: 'Sled' },
  { value: 'rower', label: 'Rower' },
  { value: 'ski_erg', label: 'Ski erg' },
  { value: 'running_only', label: 'Running only' },
];

export const WEAKNESS_OPTIONS: { value: Weakness; label: string }[] = [
  { value: 'running', label: 'Running between stations' },
  { value: 'sleds', label: 'Sled push / pull' },
  { value: 'burpees', label: 'Burpee broad jump' },
  { value: 'rowing', label: 'Rowing' },
  { value: 'wall_balls', label: 'Wall balls' },
  { value: 'endurance', label: 'Overall endurance' },
  { value: 'recovery', label: 'Recovery between sessions' },
  { value: 'strength', label: 'Raw strength' },
];

export const DURATION_OPTIONS: { value: WorkoutLength; label: string; description: string }[] = [
  { value: '30', label: '30 min', description: 'Time-crunched days' },
  { value: '45', label: '45 min', description: 'Most popular' },
  { value: '60', label: '60 min', description: 'Standard session' },
  { value: '75', label: '75 min', description: 'Longer hybrid blocks' },
];
