import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/text';
import { onboardingRadius, onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';
import type { OnboardingPlanSummary } from '@/lib/onboarding-summary';
import { formatRaceDateSubtitle } from '@/lib/onboarding-summary';
import { useOnboardingStore } from '@/store/onboarding-store';

interface PlanSummaryHeroProps {
  summary: OnboardingPlanSummary;
}

export function PlanSummaryHero({ summary }: PlanSummaryHeroProps) {
  const raceDate = useOnboardingStore((s) => s.race.date);
  const raceSubtitle = formatRaceDateSubtitle(raceDate);
  const fade = useSharedValue(0);
  const rise = useSharedValue(14);

  useEffect(() => {
    fade.value = withDelay(80, withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) }));
    rise.value = withDelay(80, withTiming(0, { duration: 650, easing: Easing.out(Easing.cubic) }));
  }, [fade, rise]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: rise.value }],
  }));

  return (
    <Animated.View style={[styles.wrap, animStyle]}>
      <View style={styles.glowTop} pointerEvents="none" />
      <View style={styles.glowAccent} pointerEvents="none" />

      <View style={styles.card}>
        <View style={styles.cardSheen} pointerEvents="none" />

        <View style={styles.topRow}>
          <View style={styles.badge}>
            <AppText style={styles.badgeText}>{summary.goalBadge}</AppText>
          </View>
          {summary.countdown ? (
            <View style={[styles.countdown, summary.countdown.urgent && styles.countdownUrgent]}>
              <Ionicons
                name="flag"
                size={12}
                color={summary.countdown.urgent ? onboardingTheme.accentOn : onboardingTheme.accent}
              />
              <AppText
                style={[
                  styles.countdownText,
                  summary.countdown.urgent && styles.countdownTextUrgent,
                ]}>
                {summary.countdown.label}
              </AppText>
            </View>
          ) : null}
        </View>

        <AppText style={styles.title}>{summary.title}</AppText>
        <AppText style={styles.weeks}>{summary.weeksLabel}</AppText>
        <AppText style={styles.startDate}>Starts {summary.startLabel}</AppText>
        {raceSubtitle ? <AppText style={styles.raceDate}>{raceSubtitle}</AppText> : null}
        {summary.raceExperienceLabel ? (
          <AppText style={styles.raceExperience}>{summary.raceExperienceLabel}</AppText>
        ) : null}

        <View style={styles.divider} />

        <View style={styles.levelRow}>
          <View style={styles.levelPill}>
            <Ionicons name="footsteps" size={14} color={onboardingTheme.accent} />
            <AppText style={styles.levelText}>{summary.runnerLabel}</AppText>
          </View>
          <View style={styles.levelPill}>
            <Ionicons name="barbell" size={14} color={onboardingTheme.accent} />
            <AppText style={styles.levelText}>{summary.strengthLabel}</AppText>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: onboardingSpacing.section,
    position: 'relative',
  },
  glowTop: {
    position: 'absolute',
    top: -48,
    left: '5%',
    width: '90%',
    height: 140,
    borderRadius: 70,
    backgroundColor: onboardingTheme.accentGlow,
    opacity: 0.55,
  },
  glowAccent: {
    position: 'absolute',
    bottom: -24,
    right: -8,
    width: 160,
    height: 90,
    borderRadius: 45,
    backgroundColor: onboardingTheme.accentSelected,
    opacity: 0.7,
  },
  card: {
    backgroundColor: onboardingTheme.card,
    borderRadius: onboardingRadius.xl,
    borderWidth: 1,
    borderColor: onboardingTheme.accentBorderSubtle,
    padding: onboardingSpacing.lg,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: onboardingTheme.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
      },
      android: { elevation: 6 },
    }),
  },
  cardSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: onboardingTheme.accentSelected,
    opacity: 0.35,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: onboardingSpacing.sm,
    marginBottom: onboardingSpacing.md,
  },
  badge: {
    flex: 1,
    backgroundColor: onboardingTheme.accentSelected,
    borderWidth: 1,
    borderColor: onboardingTheme.accentBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: onboardingRadius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: onboardingTheme.accent,
    letterSpacing: 0.5,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: onboardingRadius.full,
    backgroundColor: onboardingTheme.bgElevated,
    borderWidth: 1,
    borderColor: onboardingTheme.borderSoft,
  },
  countdownUrgent: {
    backgroundColor: onboardingTheme.accent,
    borderColor: onboardingTheme.accent,
  },
  countdownText: {
    fontSize: 11,
    fontWeight: '700',
    color: onboardingTheme.accent,
  },
  countdownTextUrgent: {
    color: onboardingTheme.accentOn,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: onboardingTheme.text,
    letterSpacing: -0.7,
    lineHeight: 34,
    marginBottom: onboardingSpacing.sm,
  },
  weeks: {
    fontSize: 14,
    fontWeight: '600',
    color: onboardingTheme.accent,
    letterSpacing: 0.2,
    marginBottom: onboardingSpacing.xs,
  },
  startDate: {
    fontSize: 13,
    lineHeight: 18,
    color: onboardingTheme.textMuted,
    marginBottom: 4,
  },
  raceDate: {
    fontSize: 13,
    lineHeight: 18,
    color: onboardingTheme.textSubtle,
  },
  raceExperience: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: onboardingTheme.textMuted,
    marginTop: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: onboardingTheme.borderSoft,
    marginVertical: onboardingSpacing.md,
  },
  levelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: onboardingSpacing.sm,
  },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: onboardingRadius.full,
    backgroundColor: onboardingTheme.bgElevated,
    borderWidth: 1,
    borderColor: onboardingTheme.borderSoft,
  },
  levelText: {
    fontSize: 13,
    fontWeight: '600',
    color: onboardingTheme.text,
  },
});
