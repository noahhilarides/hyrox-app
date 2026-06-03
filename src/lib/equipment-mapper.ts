import type { Equipment } from '@/types';
import type { OnboardingEquipment } from '@/types/onboarding';

const EQUIPMENT_MAP: Record<OnboardingEquipment, Equipment[]> = {
  full_gym: ['full_gym', 'rower', 'sled'],
  home_gym: ['dumbbells', 'kettlebells'],
  dumbbells_only: ['dumbbells'],
  bodyweight_only: ['running_only'],
  hyrox_gym: ['full_gym', 'sled', 'rower', 'ski_erg'],
};

export function equipmentAccessToProfile(access: OnboardingEquipment | null): Equipment[] {
  if (!access) return ['full_gym'];
  return EQUIPMENT_MAP[access];
}
