import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ActivityCard } from '@/components/activities/activity-card';
import { TabScreenHeader } from '@/components/layout/tab-screen-header';
import { SectionHeader } from '@/components/layout/section-header';
import { StatPill } from '@/components/layout/stat-pill';
import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';
import { useApp } from '@/context/app-context';
import { getCompletedWorkouts, hasActivePlan } from '@/lib/plan-insights';

export default function ActivitiesScreen() {
  const router = useRouter();
  const { plan, completions, progress } = useApp();
  const completed = getCompletedWorkouts(plan, completions);
  const active = hasActivePlan(plan);

  return (
    <Screen padded={false} edges={['top']}>
      <TabScreenHeader
        center={<AppText style={styles.headerTitle}>Activities</AppText>}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pad}>
          <AppText variant="body" muted style={styles.subtitle}>
            Workout history and session stats
          </AppText>

          <View style={styles.stats}>
            <StatPill value={`${progress.totalCompleted}`} label="sessions" highlight />
            <StatPill value="—" label="avg pace" />
            <StatPill value="—" label="total time" />
          </View>

          <View style={styles.placeholderCard}>
            <AppText variant="label" muted>
              Weekly summary
            </AppText>
            <AppText variant="headline" style={styles.placeholderValue}>
              Stats coming soon
            </AppText>
            <AppText variant="caption" muted>
              Pace, duration, and station splits will appear here
            </AppText>
          </View>

          <SectionHeader
            title="Recent"
            subtitle={active ? `${completed.length} completed` : 'No sessions yet'}
          />

          {!active || completed.length === 0 ? (
            <View style={styles.empty}>
              <AppText variant="body" muted>
                Complete a workout from Today to build your activity history.
              </AppText>
            </View>
          ) : (
            completed.map((w) => (
              <ActivityCard
                key={w.id}
                workout={w}
                onPress={() => router.push(`/workout/${w.date}`)}
              />
            ))
          )}

          <SectionHeader title="Progress history" />
          <View style={styles.historyPlaceholder}>
            {['Volume', 'Consistency', 'Station focus'].map((label) => (
              <View key={label} style={styles.historyRow}>
                <AppText variant="body">{label}</AppText>
                <View style={styles.historyBar}>
                  <View style={[styles.historyFill, { width: '40%' }]} />
                </View>
              </View>
            ))}
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
    paddingTop: spacing.sm,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.text,
    letterSpacing: -0.2,
  },
  subtitle: {
    marginBottom: spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  placeholderCard: {
    backgroundColor: palette.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  placeholderValue: {
    marginVertical: spacing.xs,
  },
  empty: {
    paddingVertical: spacing.lg,
  },
  historyPlaceholder: {
    backgroundColor: palette.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    gap: spacing.lg,
  },
  historyRow: {
    gap: spacing.sm,
  },
  historyBar: {
    height: 6,
    backgroundColor: palette.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  historyFill: {
    height: '100%',
    backgroundColor: palette.accent,
    opacity: 0.5,
    borderRadius: 3,
  },
});
