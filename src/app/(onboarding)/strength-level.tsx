import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

import { AbilityOptionCard } from '@/components/onboarding/ability-option-card';
import { ContinueButton } from '@/components/onboarding/continue-button';
import { OnboardingContainer } from '@/components/onboarding/onboarding-container';
import { OnboardingScreenIntro } from '@/components/onboarding/onboarding-screen-intro';
import { STRENGTH_ABILITY_OPTIONS } from '@/data/onboarding/abilities';
import { onboardingSpacing } from '@/data/onboarding/theme';
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation';
import { useOnboardingStore } from '@/store/onboarding-store';

export default function StrengthLevelScreen() {
  const { goNext } = useOnboardingNavigation();
  const strengthLevel = useOnboardingStore((s) => s.strengthLevel);
  const setStrengthLevel = useOnboardingStore((s) => s.setStrengthLevel);

  return (
    <OnboardingContainer
      footer={
        <ContinueButton label="Continue" onPress={goNext} disabled={!strengthLevel} />
      }>
      <OnboardingScreenIntro
        title="Strength ability"
        subtitle="Separate from running. We balance gym load so sleds and stations don't bury you."
      />

      <Animated.View layout={Layout.springify()} style={styles.list}>
        {STRENGTH_ABILITY_OPTIONS.map((option, index) => (
          <Animated.View
            key={option.value}
            entering={FadeInDown.delay(index * 55).duration(380).springify()}>
            <AbilityOptionCard
              option={option}
              selected={strengthLevel === option.value}
              onPress={() => setStrengthLevel(option.value)}
            />
          </Animated.View>
        ))}
      </Animated.View>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: onboardingSpacing.md,
  },
});
