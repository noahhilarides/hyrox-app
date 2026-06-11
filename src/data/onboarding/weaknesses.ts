import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { OnboardingWeakness } from '@/types/onboarding';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface WeaknessOption {
  value: OnboardingWeakness;
  label: string;
  tagline: string;
  icon: IoniconName;
}

export const WEAKNESS_OPTIONS: WeaknessOption[] = [
  {
    value: 'running_endurance',
    label: 'Running endurance',
    tagline: 'Between stations',
    icon: 'footsteps',
  },
  {
    value: 'ski_erg',
    label: 'SkiErg',
    tagline: 'Arms & lungs',
    icon: 'snow',
  },
  {
    value: 'sled_push',
    label: 'Sled push',
    tagline: 'Leg drive',
    icon: 'arrow-forward-circle',
  },
  {
    value: 'sled_pull',
    label: 'Sled pull',
    tagline: 'Posterior chain',
    icon: 'arrow-back-circle',
  },
  {
    value: 'burpees',
    label: 'Burpees',
    tagline: 'Broad jump station',
    icon: 'body',
  },
  {
    value: 'grip_fatigue',
    label: 'Grip fatigue',
    tagline: 'Farmers & carries',
    icon: 'hand-left',
  },
  {
    value: 'lunges',
    label: 'Lunges',
    tagline: 'Sandbag & walking lunges',
    icon: 'walk',
  },
  {
    value: 'wall_balls',
    label: 'Wall balls',
    tagline: 'Legs & shoulders under fatigue',
    icon: 'basketball',
  },
  {
    value: 'rowing',
    label: 'Rowing',
    tagline: 'Erg power & control',
    icon: 'boat',
  },
];
