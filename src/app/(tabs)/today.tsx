import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { PlanActionCard } from '@/components/plan/plan-action-card';
import { TodayCalendarPanel } from '@/components/today/today-calendar-panel';
import { TodayCountdownTile } from '@/components/today/today-countdown-tile';
import { TodayFeaturedWorkout } from '@/components/today/today-featured-workout';
import { TodayFeedRow } from '@/components/today/today-feed-row';
import { TodayTopHeader } from '@/components/today/today-top-header';
import { TodayWeekTile } from '@/components/today/today-week-tile';
import { TodayWeatherTile } from '@/components/today/today-weather-tile';
import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { buildTodayFeedModules, type TodayFeedModule } from '@/data/today/feed-modules';
import { palette, spacing } from '@/constants/tokens';
import { useApp } from '@/context/app-context';
import { useGreeting } from '@/hooks/use-greeting';
import {
  getCurrentWeekNumber,
  getTrainingPhase,
  getWeekLabel,
  getWorkoutForDate,
  hasActivePlan,
} from '@/lib/plan-insights';
import { ProfileAvatarButton } from '@/components/layout/profile-avatar-button';
import { getFocusAreaLabels, getRaceCountdown, getRaceImageUrl } from '@/lib/plan-personalization';

export default function TodayScreen() {
  const router = useRouter();
  const greeting = useGreeting();
  const { plan, profile, progress, continuePlanFromProfile, resetApp } = useApp();

  const today = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleCalendarExpandedChange = useCallback((open: boolean) => {
    setCalendarOpen(open);
    if (!open) {
      setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
    }
  }, []);

  const active = hasActivePlan(plan);
  const selectedWorkout = useMemo(
    () => getWorkoutForDate(plan, selectedDate),
    [plan, selectedDate]
  );
  const phase = getTrainingPhase(plan);
  const weekLabel = getWeekLabel(plan);
  const currentWeek = getCurrentWeekNumber(plan);

  const raceCountdown = useMemo(() => getRaceCountdown(profile), [profile]);
  const raceImageUrl = useMemo(() => getRaceImageUrl(profile), [profile]);
  const focusAreas = useMemo(() => getFocusAreaLabels(profile), [profile]);

  const feedModules = useMemo(
    () => buildTodayFeedModules(profile, phase, raceCountdown, focusAreas),
    [profile, phase, raceCountdown, focusAreas]
  );
  const insightModules = useMemo(
    () => feedModules.filter((m) => m.variant === 'insight' || m.variant === 'race'),
    [feedModules]
  );
  const tipModules = useMemo(
    () => feedModules.filter((m) => m.variant === 'tip' || m.variant === 'education' || m.variant === 'recovery'),
    [feedModules]
  );
  const allInsightModules = useMemo<TodayFeedModule[]>(() => [], []);

  const openWorkout = (date: string) => router.push(`/workout/${date}`);

  if (!active || !plan) {
    return (
      <Screen padded={false} edges={['top']}>
        <View style={styles.emptyHeader}>
          <ProfileAvatarButton />
        </View>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.pad}>
            <AppText style={styles.greeting}>{greeting}</AppText>
            <AppText style={styles.emptyTitle}>Ready to train?</AppText>
            <View style={styles.actions}>
              <PlanActionCard
                title="Start new plan"
                emoji="✦"
                primary
                onPress={() => router.push('/(onboarding)/goal')}
              />
              <PlanActionCard
                title="Continue plan"
                emoji="↻"
                onPress={async () => {
                  const ok = await continuePlanFromProfile();
                  if (!ok) router.push('/(onboarding)/goal');
                }}
              />
              <PlanActionCard
                title="Restart plan"
                emoji="⟳"
                onPress={async () => {
                  await resetApp();
                  router.push('/(onboarding)/goal');
                }}
              />
            </View>
          </View>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen padded={false} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <TodayTopHeader
          weekLabel={weekLabel}
          completedCount={progress.completedThisWeek}
          plannedCount={progress.plannedThisWeek}
        />

        <TodayCalendarPanel
          plan={plan}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          expanded={calendarOpen}
          onExpandedChange={handleCalendarExpandedChange}
        />

        <TodayFeaturedWorkout
          workout={selectedWorkout}
          selectedDate={selectedDate}
          onOpenWorkout={openWorkout}
        />

        <TodayFeedRow
          title="Insights"
          modules={allInsightModules}
          leadingTile={
            <>
              {raceCountdown ? (
                <TodayCountdownTile
                  countdown={raceCountdown}
                  imageUrl={raceImageUrl}
                  raceName={profile?.raceName}
                  raceDate={profile?.raceDate}
                />
              ) : null}
              <TodayWeekTile progress={progress} weekNumber={currentWeek} phase={phase} />
              <TodayWeatherTile />
            </>
          }
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 120,
  },
  emptyHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  pad: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: palette.textSecondary,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: palette.text,
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.md,
  },
});
