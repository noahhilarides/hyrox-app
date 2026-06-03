import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ContinueButton } from '@/components/onboarding/continue-button';
import { InterestTile } from '@/components/onboarding/interest-tile';
import { OnboardingContainer } from '@/components/onboarding/onboarding-container';
import { OnboardingScreenIntro } from '@/components/onboarding/onboarding-screen-intro';
import { AppText } from '@/components/ui/text';
import { INTEREST_OPTIONS } from '@/data/onboarding/interests';
import { onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation';
import { useOnboardingStore } from '@/store/onboarding-store';

export default function InterestsScreen() {
  const { goNext } = useOnboardingNavigation();
  const interests = useOnboardingStore((s) => s.interests);
  const toggleInterest = useOnboardingStore((s) => s.toggleInterest);

  const count = interests.length;

  return (
    <OnboardingContainer footer={<ContinueButton label="Continue" onPress={goNext} />}>
      <Animated.View entering={FadeIn.duration(400)}>
        <OnboardingScreenIntro
          title="What else do you want help with?"
          subtitle="Optional add-ons we'll weave into coaching notes and recovery guidance — pick any that matter to you.">
          <AppText style={styles.counter}>
            {count === 0 ? 'Optional — select any' : `${count} selected`}
          </AppText>
        </OnboardingScreenIntro>
      </Animated.View>

      <View style={styles.grid}>
        {INTEREST_OPTIONS.map((option, index) => (
          <Animated.View
            key={option.value}
            entering={FadeInDown.delay(60 + index * 35).duration(350)}
            style={styles.gridItem}>
            <InterestTile
              option={option}
              selected={interests.includes(option.value)}
              onPress={() => toggleInterest(option.value)}
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
