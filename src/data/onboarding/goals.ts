import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { Goal } from '@/types';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface GoalOption {
  value: Goal;
  title: string;
  subtitle: string;
  icon: IoniconName;
}

export const GOAL_OPTIONS: GoalOption[] = [
  {
    value: 'hyrox_race',
    title: 'HYROX Race Prep',
    subtitle: 'Structured block toward race day with station simulations.',
    icon: 'flag',
  },
  {
    value: 'endurance',
    title: 'Improve Endurance',
    subtitle: 'Build aerobic capacity for long efforts between stations.',
    icon: 'pulse',
  },
  {
    value: 'hybrid_fitness',
    title: 'Hybrid Athlete Training',
    subtitle: 'Balance running, strength, and HYROX-style conditioning.',
    icon: 'flash',
  },
  {
    value: 'performance_training',
    title: 'Performance Training',
    subtitle:
      'Build strength, endurance, and work capacity year-round — no race required. Sustainable hybrid performance.',
    icon: 'trending-up',
  },
  {
    value: 'return_to_fitness',
    title: 'Return To Fitness',
    subtitle: 'Ease back in with smart progression and recovery built in.',
    icon: 'walk',
  },
  {
    value: 'strength',
    title: 'Strength + Conditioning',
    subtitle: 'Get stronger while staying fit enough to move well.',
    icon: 'barbell',
  },
];
