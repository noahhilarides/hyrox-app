import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { OnboardingInterest } from '@/types/onboarding';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface InterestOption {
  value: OnboardingInterest;
  label: string;
  tagline: string;
  icon: IoniconName;
}

export const INTEREST_OPTIONS: InterestOption[] = [
  { value: 'mobility', label: 'Mobility', tagline: 'Move better under fatigue', icon: 'body' },
  { value: 'recovery', label: 'Recovery', tagline: 'Bounce back between sessions', icon: 'water' },
  { value: 'sleep', label: 'Sleep', tagline: 'Protect your training window', icon: 'moon' },
  { value: 'nutrition', label: 'Nutrition', tagline: 'Fuel for hybrid volume', icon: 'restaurant' },
  { value: 'vo2_max', label: 'VO2 max', tagline: 'Raise your aerobic ceiling', icon: 'pulse' },
  {
    value: 'mental_toughness',
    label: 'Mental toughness',
    tagline: 'Stay composed when it burns',
    icon: 'shield',
  },
  { value: 'fat_loss', label: 'Fat loss', tagline: 'Lean out without losing power', icon: 'trending-down' },
  {
    value: 'injury_prevention',
    label: 'Injury prevention',
    tagline: 'Stay healthy through the block',
    icon: 'medkit',
  },
];
