import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { TabScreenHeader } from '@/components/layout/tab-screen-header';
import { SectionHeader } from '@/components/layout/section-header';
import { PlanEmptyState } from '@/components/plan/plan-empty-state';
import { PhaseBanner } from '@/components/plan/phase-banner';
import { WeeklyOverviewCard } from '@/components/plan/weekly-overview-card';
import { WorkoutCard } from '@/components/workout-card';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';
import { useApp } from '@/context/app-context';
import {
  getPlanTitle,
  getTrainingPhase,
  getWeekLabel,
  getWeekWorkouts,
  hasActivePlan,
} from '@/lib/plan-insights';
import {
  formatRaceDateLabel,
  getAbilitySummary,
  getFocusAreaLabels,
  getProgressionNarrative,
  getRaceCountdown,
  getWeeklyStructure,
} from '@/lib/plan-personalization';

export default function PlanScreen() {
  const router = useRouter();
  const { plan, profile, quitPlan } = useApp();
  const today = format(new Date(), 'yyyy-MM-dd');

  const workouts = plan?.workouts ?? [];
  const active = hasActivePlan(plan);
  const phase = getTrainingPhase(plan);
  const weekLabel = getWeekLabel(plan);
  const weekWorkouts = useMemo(() => getWeekWorkouts(plan), [plan]);

  const raceCountdown = useMemo(() => getRaceCountdown(profile), [profile]);
  const focusAreas = useMemo(() => getFocusAreaLabels(profile), [profile]);
  const weeklyStructure = useMemo(() => getWeeklyStructure(profile), [profile]);
  const abilitySummary = useMemo(() => getAbilitySummary(profile), [profile]);
  const progressionCopy = useMemo(
    () => getProgressionNarrative(profile, plan),
    [profile, plan]
  );

  const upcoming = useMemo(
    () => workouts.filter((w) => w.date >= today).slice(0, 8),
    [workouts, today]
  );

  if (!active) {
    return (
      <Screen padded={false} edges={['top']}>
        <TabScreenHeader
          center={<AppText style={styles.headerTitle}>Plan</AppText>}
        />
        <View style={styles.emptyPad}>
          <PlanEmptyState />
        </View>
      </Screen>
    );
  }

  const raceDateLabel = formatRaceDateLabel(profile);
  const countdownLine = raceCountdown
    ? `${raceCountdown.label}${raceCountdown.days > 0 ? ` · ${raceCountdown.days}d` : ''}`
    : undefined;

  const weekSubtitle = `${abilitySummary.runner} · ${abilitySummary.strength} · ${plan?.weeksTotal ?? '—'} weeks`;

  const handleQuitPlan = () => {
    Alert.alert(
      'Quit this plan?',
      'Your workout progress will be cleared. Your profile stays saved so you can start a new plan from Today.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Quit plan',
          style: 'destructive',
          onPress: async () => {
            await quitPlan();
            router.replace('/(tabs)/today');
          },
        },
      ]
    );
  };

  return (
    <Screen padded={false} edges={['top']}>
      <TabScreenHeader
        center={<AppText style={styles.headerTitle}>Plan</AppText>}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pad}>
          <AppText variant="title">{getPlanTitle(profile, plan)}</AppText>
          <AppText variant="body" muted style={styles.sub}>
            {weekSubtitle}
          </AppText>

          <PhaseBanner
            phase={phase}
            weekLabel={weekLabel}
            raceDateLabel={countdownLine ?? raceDateLabel}
          />

          <WeeklyOverviewCard
            structure={weeklyStructure}
            focusAreas={focusAreas}
            subtitle="Built from your onboarding — volume and focus adjust as you progress."
          />

          <SectionHeader
            title="This week"
            subtitle={`${weekWorkouts.length} sessions · ${weeklyStructure.join(' · ')}`}
          />

          {weekWorkouts.length === 0 ? (
            <AppText variant="body" muted>
              No sessions this week.
            </AppText>
          ) : (
            weekWorkouts.map((w) => (
              <WorkoutCard
                key={w.id}
                workout={w}
                highlighted={w.date === today}
                onPress={() => router.push(`/workout/${w.date}`)}
              />
            ))
          )}

          <SectionHeader title="Upcoming" subtitle="Race prep structure" />
          {upcoming.map((w) => (
            <WorkoutCard
              key={w.id}
              workout={w}
              onPress={() => router.push(`/workout/${w.date}`)}
            />
          ))}

          <View style={styles.progressionCard}>
            <AppText variant="label" muted>
              Progression
            </AppText>
            <AppText variant="body" style={styles.progressionBody}>
              {progressionCopy}
            </AppText>
          </View>

          <View style={styles.quitSection}>
            <Button label="Quit plan" variant="secondary" onPress={handleQuitPlan} />
            <AppText variant="caption" muted style={styles.quitHint}>
              End this block and return to Today to start fresh or rebuild from your profile.
            </AppText>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xxxl,
  },
  pad: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sub: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.text,
    letterSpacing: -0.2,
  },
  emptyPad: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  progressionCard: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: palette.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    gap: spacing.sm,
  },
  progressionBody: {
    lineHeight: 24,
  },
  quitSection: {
    marginTop: spacing.xxl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: palette.borderSubtle,
    gap: spacing.md,
  },
  quitHint: {
    textAlign: 'center',
    lineHeight: 18,
  },
});
