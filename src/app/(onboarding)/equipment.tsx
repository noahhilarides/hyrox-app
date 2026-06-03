import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ContinueButton } from '@/components/onboarding/continue-button';
import { EquipmentAccessCard } from '@/components/onboarding/equipment-access-card';
import { OnboardingContainer } from '@/components/onboarding/onboarding-container';
import { OnboardingScreenIntro } from '@/components/onboarding/onboarding-screen-intro';
import { EQUIPMENT_ACCESS_OPTIONS } from '@/data/onboarding/equipment-access';
import { onboardingSpacing } from '@/data/onboarding/theme';
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation';
import { useOnboardingStore } from '@/store/onboarding-store';

export default function EquipmentScreen() {
  const { goNext } = useOnboardingNavigation();
  const equipmentAccess = useOnboardingStore((s) => s.equipmentAccess);
  const setEquipmentAccess = useOnboardingStore((s) => s.setEquipmentAccess);

  return (
    <OnboardingContainer
      footer={
        <ContinueButton label="Continue" onPress={goNext} disabled={equipmentAccess == null} />
      }>
      <Animated.View entering={FadeIn.duration(400)}>
        <OnboardingScreenIntro
          title="Equipment access"
          subtitle="We'll match stations and strength work to what you actually have — no fantasy sled days."
        />
      </Animated.View>

      <View style={styles.list}>
        {EQUIPMENT_ACCESS_OPTIONS.map((option, index) => (
          <Animated.View key={option.value} entering={FadeInDown.delay(80 + index * 50).duration(350)}>
            <EquipmentAccessCard
              option={option}
              selected={equipmentAccess === option.value}
              onPress={() => setEquipmentAccess(option.value)}
            />
          </Animated.View>
        ))}
      </View>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: onboardingSpacing.sm,
  },
});
