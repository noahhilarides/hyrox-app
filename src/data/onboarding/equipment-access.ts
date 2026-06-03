import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { OnboardingEquipment } from '@/types/onboarding';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface EquipmentAccessOption {
  value: OnboardingEquipment;
  title: string;
  description: string;
  icon: IoniconName;
}

export const EQUIPMENT_ACCESS_OPTIONS: EquipmentAccessOption[] = [
  {
    value: 'full_gym',
    title: 'Commercial gym',
    description: 'Racks, barbells, ergs, sleds — full HYROX setup.',
    icon: 'barbell',
  },
  {
    value: 'home_gym',
    title: 'Home gym',
    description: 'Limited kit — dumbbells, bench, maybe a rower.',
    icon: 'home',
  },
  {
    value: 'dumbbells_only',
    title: 'Dumbbells only',
    description: 'Minimal equipment — smart substitutions.',
    icon: 'fitness',
  },
  {
    value: 'bodyweight_only',
    title: 'Bodyweight only',
    description: 'No weights — run-focused + calisthenics.',
    icon: 'body',
  },
  {
    value: 'hyrox_gym',
    title: 'CrossFit gym',
    description: 'Sleds, ski, row — race-specific stations.',
    icon: 'flash',
  },
];
