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
    description: 'Racks, barbells, ergs, sleds. Full HYROX setup.',
    icon: 'barbell',
  },
  {
    value: 'dumbbells_only',
    title: 'Dumbbells / Kettlebells',
    description: 'DB & KB substitutions for every station.',
    icon: 'fitness',
  },
  {
    value: 'hyrox_gym',
    title: 'CrossFit gym',
    description: 'Sleds, ski, row. Race-specific stations.',
    icon: 'flash',
  },
];
