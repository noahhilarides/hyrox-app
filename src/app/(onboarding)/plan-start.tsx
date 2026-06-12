import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ContinueButton } from '@/components/onboarding/continue-button';
import { OnboardingContainer } from '@/components/onboarding/onboarding-container';
import { OnboardingScreenIntro } from '@/components/onboarding/onboarding-screen-intro';
import { SelectionCard } from '@/components/onboarding/selection-card';
import {
  buildPlanStartOptions,
  resolvePlanStartDate,
  type PlanStartPreset,
} from '@/data/onboarding/plan-start-options';
import { onboardingSpacing } from '@/data/onboarding/theme';
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation';
import { useOnboardingStore } from '@/store/onboarding-store';

const OPTIONS = buildPlanStartOptions();

function presetFromDate(iso: string | null): PlanStartPreset | null {
  if (!iso) return null;
  const presets: PlanStartPreset[] = ['today', 'tomorrow', 'next_monday', 'in_one_week'];
  for (const preset of presets) {
    if (resolvePlanStartDate(preset) === iso) return preset;
  }
  return null;
}

export default function PlanStartScreen() {
  const { goNext } = useOnboardingNavigation();
  const planStartDate = useOnboardingStore((s) => s.planStartDate);
  const setPlanStartDate = useOnboardingStore((s) => s.setPlanStartDate);

  const selectedPreset = presetFromDate(planStartDate);

  const handleSelect = (preset: PlanStartPreset) => {
    setPlanStartDate(resolvePlanStartDate(preset));
  };

  return (
    <OnboardingContainer
      footer={
        <ContinueButton label="Continue" onPress={goNext} disabled={!planStartDate} />
      }>
      <Animated.View entering={FadeIn.duration(400)}>
        <OnboardingScreenIntro
          title="When do you want to start?"
          subtitle="Your first session will land on this day. We'll build the calendar forward from here."
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(350)} style={styles.grid}>
        {OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={selectedPreset === option.value}
            onPress={() => handleSelect(option.value)}
          />
        ))}
      </Animated.View>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -onboardingSpacing.sm,
    paddingBottom: onboardingSpacing.md,
  },
});
