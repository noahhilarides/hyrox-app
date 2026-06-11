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
    value: 'hybrid_fitness',
    title: 'Hybrid Training',
    subtitle: 'Sustainable strength + HYROX conditioning. No race date needed.',
    icon: 'flash',
  },
];
