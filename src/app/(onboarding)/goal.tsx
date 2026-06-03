import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  Layout,
} from 'react-native-reanimated';

import { ContinueButton } from '@/components/onboarding/continue-button';
import { GoalOptionCard } from '@/components/onboarding/goal-option-card';
import { OnboardingContainer } from '@/components/onboarding/onboarding-container';
import { OnboardingScreenIntro } from '@/components/onboarding/onboarding-screen-intro';
import { GOAL_OPTIONS } from '@/data/onboarding/goals';
import { onboardingSpacing } from '@/data/onboarding/theme';
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation';
import { useOnboardingStore } from '@/store/onboarding-store';
import type { Goal } from '@/types';

export default function GoalScreen() {
  const { goNext } = useOnboardingNavigation();
  const goal = useOnboardingStore((s) => s.goal);
  const setGoal = useOnboardingStore((s) => s.setGoal);

  const handleSelect = (value: Goal) => {
    setGoal(value);
  };

  return (
    <OnboardingContainer
      footer={
        <ContinueButton label="Continue" onPress={goNext} disabled={!goal} />
      }>
      <OnboardingScreenIntro
        title="What's your goal?"
        subtitle="We'll shape your training block around what you're chasing right now."
      />

      <Animated.View layout={Layout.springify()} style={styles.list}>
        {GOAL_OPTIONS.map((option, index) => (
          <Animated.View
            key={option.value}
            entering={FadeInDown.delay(index * 60)
              .duration(400)
              .springify()}>
            <GoalOptionCard
              option={option}
              selected={goal === option.value}
              onPress={() => handleSelect(option.value)}
            />
          </Animated.View>
        ))}
      </Animated.View>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: onboardingSpacing.lg,
  },
});
