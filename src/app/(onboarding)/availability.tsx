import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ContinueButton } from '@/components/onboarding/continue-button';
import { OnboardingContainer } from '@/components/onboarding/onboarding-container';
import { OnboardingScreenIntro } from '@/components/onboarding/onboarding-screen-intro';
import { OnboardingSection } from '@/components/onboarding/onboarding-section';
import { SelectionChip } from '@/components/onboarding/selection-chip';
import { AppText } from '@/components/ui/text';
import {
  DAYS_PER_WEEK_OPTIONS,
  LONG_SESSION_DAY_OPTIONS,
} from '@/data/onboarding/availability-options';
import { onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation';
import { useOnboardingStore } from '@/store/onboarding-store';

export default function AvailabilityScreen() {
  const { goNext } = useOnboardingNavigation();
  const availability = useOnboardingStore((s) => s.availability);
  const setTrainingDays = useOnboardingStore((s) => s.setTrainingDays);
  const toggleWorkoutDay = useOnboardingStore((s) => s.toggleWorkoutDay);
  const setLongSessionDay = useOnboardingStore((s) => s.setLongSessionDay);

  const daysTarget = availability.daysPerWeek;
  const workoutDaysCount = availability.workoutDays.length;
  const needsMoreDays =
    daysTarget != null && workoutDaysCount < daysTarget;
  const longSessionValid =
    availability.longSessionDay == null ||
    availability.workoutDays.includes(availability.longSessionDay);

  const isComplete =
    daysTarget != null &&
    workoutDaysCount === daysTarget &&
    availability.longSessionDay != null &&
    longSessionValid;

  return (
    <OnboardingContainer
      footer={<ContinueButton label="Continue" onPress={goNext} disabled={!isComplete} />}>
      <Animated.View entering={FadeIn.duration(400)}>
        <OnboardingScreenIntro
          title="Training availability"
          subtitle="We'll shape volume and long-run placement around the days you can actually train."
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(60).duration(350)}>
        <OnboardingSection title="Days per week" subtitle="How many sessions can you commit to?">
          <View style={styles.chipRow}>
            {DAYS_PER_WEEK_OPTIONS.map((option) => (
              <SelectionChip
                key={option.value}
                label={option.label}
                selected={availability.daysPerWeek === option.value}
                onPress={() => setTrainingDays(option.value)}
                style={styles.dayChip}
              />
            ))}
          </View>
        </OnboardingSection>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(350)}>
        <OnboardingSection
          title="Training days"
          subtitle={
            daysTarget != null
              ? `Select ${daysTarget} day${daysTarget === 1 ? '' : 's'} you want to work out.`
              : 'Choose your days per week first.'
          }>
          <View style={styles.weekdayRow}>
            {LONG_SESSION_DAY_OPTIONS.map((option) => {
              const selected = availability.workoutDays.includes(option.value);
              const atMax =
                daysTarget != null &&
                workoutDaysCount >= daysTarget &&
                !selected;
              return (
                <SelectionChip
                  key={option.value}
                  label={option.short}
                  compact
                  selected={selected}
                  onPress={() => toggleWorkoutDay(option.value)}
                  style={atMax ? styles.weekdayChipDisabled : styles.weekdayChip}
                />
              );
            })}
          </View>
          {needsMoreDays ? (
            <AppText style={styles.hint}>
              Select {daysTarget! - workoutDaysCount} more day
              {daysTarget! - workoutDaysCount === 1 ? '' : 's'}.
            </AppText>
          ) : null}
          {availability.longSessionDay &&
          !availability.workoutDays.includes(availability.longSessionDay) ? (
            <AppText style={styles.hintWarn}>
              Long session day should be one of your training days.
            </AppText>
          ) : null}
        </OnboardingSection>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(180).duration(350)}>
        <OnboardingSection
          title="Long session day"
          subtitle="When should your biggest hybrid session land?">
          <View style={styles.weekdayRow}>
            {LONG_SESSION_DAY_OPTIONS.map((option) => (
              <SelectionChip
                key={`long-${option.value}`}
                label={option.short}
                compact
                selected={availability.longSessionDay === option.value}
                onPress={() => setLongSessionDay(option.value)}
                style={styles.weekdayChip}
              />
            ))}
          </View>
        </OnboardingSection>
      </Animated.View>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: onboardingSpacing.sm,
  },
  dayChip: {
    flex: 1,
    minWidth: '22%',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: onboardingSpacing.xs,
  },
  weekdayChip: {
    flex: 1,
  },
  weekdayChipDisabled: {
    flex: 1,
    opacity: 0.35,
  },
  hint: {
    marginTop: onboardingSpacing.sm,
    fontSize: 13,
    color: onboardingTheme.textMuted,
  },
  hintWarn: {
    marginTop: onboardingSpacing.sm,
    fontSize: 13,
    color: onboardingTheme.accent,
  },
});
