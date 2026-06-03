import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ContinueButton } from '@/components/onboarding/continue-button';
import { OnboardingContainer } from '@/components/onboarding/onboarding-container';
import { OnboardingScreenIntro } from '@/components/onboarding/onboarding-screen-intro';
import { WeaknessTile } from '@/components/onboarding/weakness-tile';
import { AppText } from '@/components/ui/text';
import { WEAKNESS_OPTIONS } from '@/data/onboarding/weaknesses';
import { onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation';
import { useOnboardingStore } from '@/store/onboarding-store';

export default function WeaknessesScreen() {
  const { goNext } = useOnboardingNavigation();
  const weaknesses = useOnboardingStore((s) => s.weaknesses);
  const toggleWeakness = useOnboardingStore((s) => s.toggleWeakness);

  const count = weaknesses.length;

  return (
    <OnboardingContainer
      footer={
        <ContinueButton label="Continue" onPress={goNext} disabled={count === 0} />
      }>
      <Animated.View entering={FadeIn.duration(400)}>
        <OnboardingScreenIntro
          title="What areas need the most improvement?"
          subtitle="HYROX exposes weaknesses across run, erg, sled, and grip. Pick what we'll prioritize in your block.">
          <AppText style={styles.counter}>
            {count === 0 ? 'Select at least one' : `${count} selected`}
          </AppText>
        </OnboardingScreenIntro>
      </Animated.View>

      <View style={styles.grid}>
        {WEAKNESS_OPTIONS.map((option, index) => (
          <Animated.View
            key={option.value}
            entering={FadeInDown.delay(80 + index * 40).duration(350)}
            style={styles.gridItem}>
            <WeaknessTile
              option={option}
              selected={weaknesses.includes(option.value)}
              onPress={() => toggleWeakness(option.value)}
            />
          </Animated.View>
        ))}
      </View>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  counter: {
    marginTop: onboardingSpacing.md,
    fontSize: 13,
    fontWeight: '600',
    color: onboardingTheme.accent,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -onboardingSpacing.sm / 2,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: onboardingSpacing.sm / 2,
  },
});
