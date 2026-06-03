import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { AbilityLevel } from '@/types/onboarding';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface AbilityOption {
  value: AbilityLevel;
  title: string;
  description: string;
  /** 0–3 filled bars for visual indicator */
  levelIndex: number;
  icon: IoniconName;
}

export const RUNNING_ABILITY_OPTIONS: AbilityOption[] = [
  {
    value: 'beginner',
    title: 'Beginner',
    description: 'Building a base — mostly walk/jog intervals.',
    levelIndex: 0,
    icon: 'walk',
  },
  {
    value: 'intermediate',
    title: 'Intermediate',
    description: 'Comfortable with 5K–10K and steady pacing.',
    levelIndex: 1,
    icon: 'footsteps',
  },
  {
    value: 'advanced',
    title: 'Advanced',
    description: 'Regular running — tempo and longer efforts.',
    levelIndex: 2,
    icon: 'speedometer',
  },
  {
    value: 'elite',
    title: 'Elite',
    description: 'High volume — race-pace work is routine.',
    levelIndex: 3,
    icon: 'flash',
  },
];

export const STRENGTH_ABILITY_OPTIONS: AbilityOption[] = [
  {
    value: 'beginner',
    title: 'Beginner',
    description: 'Learning movements — focus on form and consistency.',
    levelIndex: 0,
    icon: 'barbell-outline',
  },
  {
    value: 'intermediate',
    title: 'Intermediate',
    description: 'Train 2–3× weekly with compound lifts.',
    levelIndex: 1,
    icon: 'barbell',
  },
  {
    value: 'advanced',
    title: 'Advanced',
    description: 'Strong across squat, hinge, and carry patterns.',
    levelIndex: 2,
    icon: 'fitness',
  },
  {
    value: 'elite',
    title: 'Elite',
    description: 'High force output — handles heavy hybrid blocks.',
    levelIndex: 3,
    icon: 'trophy',
  },
];
