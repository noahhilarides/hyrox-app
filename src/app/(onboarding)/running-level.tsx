import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

import { AbilityOptionCard } from '@/components/onboarding/ability-option-card';
import { ContinueButton } from '@/components/onboarding/continue-button';
import { OnboardingContainer } from '@/components/onboarding/onboarding-container';
import { OnboardingScreenIntro } from '@/components/onboarding/onboarding-screen-intro';
import { RUNNING_ABILITY_OPTIONS } from '@/data/onboarding/abilities';
import { onboardingSpacing } from '@/data/onboarding/theme';
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation';
import { useOnboardingStore } from '@/store/onboarding-store';

export default function RunningLevelScreen() {
  const { goNext } = useOnboardingNavigation();
  const runningLevel = useOnboardingStore((s) => s.runningLevel);
  const setRunningLevel = useOnboardingStore((s) => s.setRunningLevel);

  return (
    <OnboardingContainer
      footer={
        <ContinueButton label="Continue" onPress={goNext} disabled={!runningLevel} />
      }>
      <OnboardingScreenIntro
        title="Running ability"
        subtitle="Your run fitness sets pacing between stations. Be honest so easy days stay easy."
      />

      <Animated.View layout={Layout.springify()} style={styles.list}>
        {RUNNING_ABILITY_OPTIONS.map((option, index) => (
          <Animated.View
            key={option.value}
            entering={FadeInDown.delay(index * 55).duration(380).springify()}>
            <AbilityOptionCard
              option={option}
              selected={runningLevel === option.value}
              onPress={() => setRunningLevel(option.value)}
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
