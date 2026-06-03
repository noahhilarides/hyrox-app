import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ContinueButton } from '@/components/onboarding/continue-button';
import { OnboardingContainer } from '@/components/onboarding/onboarding-container';
import { PlanSummaryHero } from '@/components/onboarding/plan-summary-hero';
import { SummaryDetailSection } from '@/components/onboarding/summary-detail-section';
import { AppText } from '@/components/ui/text';
import { useApp } from '@/context/app-context';
import { onboardingRadius, onboardingSpacing, onboardingTheme, onboardingType } from '@/data/onboarding/theme';
import { draftToOnboardingProfile } from '@/lib/onboarding-profile-mapper';
import { buildOnboardingPlanSummary } from '@/lib/onboarding-summary';
import { useOnboardingStore } from '@/store/onboarding-store';

export default function SummaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeOnboarding } = useApp();
  const draft = useOnboardingStore();
  const [generating, setGenerating] = useState(false);

  const summary = useMemo(() => buildOnboardingPlanSummary(draft), [draft]);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      const profile = draftToOnboardingProfile(draft);
      await completeOnboarding(profile);
      router.replace('/(tabs)/today');
    } finally {
      setGenerating(false);
    }
  }, [completeOnboarding, draft, router]);

  const close = useCallback(() => {
    router.replace('/(tabs)/today');
  }, [router]);

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + onboardingSpacing.md }]}>
        <Pressable onPress={close} hitSlop={12} style={styles.closeBtn} accessibilityLabel="Close">
          <Ionicons name="close" size={22} color={onboardingTheme.textMuted} />
        </Pressable>
      </View>

      <OnboardingContainer
        scroll
        footer={
          <ContinueButton
            label="Generate My Plan"
            onPress={handleGenerate}
            loading={generating}
            disabled={generating}
          />
        }>
        <Animated.View entering={FadeIn.duration(400)} style={styles.intro}>
          <AppText style={styles.eyebrow}>Your plan is ready</AppText>
          <AppText style={styles.headline}>Built for how you train</AppText>
          <AppText style={styles.introCopy}>
            Personalized from your goals, levels, and race timeline.
          </AppText>
        </Animated.View>

        <PlanSummaryHero summary={summary} />

        <Animated.View entering={FadeInDown.delay(120).duration(400)}>
          <SummaryDetailSection title="Focus areas" items={summary.focusAreas} accent />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(180).duration(400)}>
          <SummaryDetailSection title="Weekly structure" items={summary.weeklyStructure} />
        </Animated.View>

        {summary.interestTags.length > 0 ? (
          <Animated.View entering={FadeInDown.delay(240).duration(400)} style={styles.interestsWrap}>
            <AppText style={styles.interestsTitle}>Also optimizing for</AppText>
            <View style={styles.tagRow}>
              {summary.interestTags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <AppText style={styles.tagText}>{tag}</AppText>
                </View>
              ))}
            </View>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.footerNote}>
          <Ionicons name="sparkles" size={16} color={onboardingTheme.accent} />
          <AppText style={styles.footerNoteText}>
            Every session is tuned to your levels, equipment, and race timeline.
          </AppText>
        </Animated.View>
      </OnboardingContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: onboardingTheme.bg,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: onboardingSpacing.lg,
    alignItems: 'flex-end',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: onboardingTheme.card,
    borderWidth: 1,
    borderColor: onboardingTheme.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intro: {
    paddingTop: onboardingSpacing.xxl + onboardingSpacing.md,
    marginBottom: onboardingSpacing.lg,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: onboardingTheme.accent,
    marginBottom: onboardingSpacing.sm,
  },
  headline: {
    ...onboardingType.screenTitle,
    fontSize: 28,
    lineHeight: 34,
    color: onboardingTheme.text,
    marginBottom: onboardingSpacing.sm,
  },
  introCopy: {
    ...onboardingType.screenSubtitle,
    color: onboardingTheme.textSubtle,
    maxWidth: 320,
  },
  interestsWrap: {
    marginBottom: onboardingSpacing.section,
    paddingBottom: onboardingSpacing.md,
  },
  interestsTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: onboardingTheme.textSubtle,
    marginBottom: onboardingSpacing.md,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: onboardingSpacing.sm,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: onboardingRadius.full,
    backgroundColor: onboardingTheme.card,
    borderWidth: 1,
    borderColor: onboardingTheme.borderSoft,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: onboardingTheme.text,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: onboardingSpacing.sm,
    padding: onboardingSpacing.md,
    borderRadius: onboardingRadius.lg,
    backgroundColor: onboardingTheme.accentSelected,
    borderWidth: 1,
    borderColor: onboardingTheme.accentBorderSubtle,
    marginBottom: onboardingSpacing.lg,
  },
  footerNoteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: onboardingTheme.textSubtle,
  },
});
