import { StyleSheet, View } from 'react-native';

import { TodaySectionHeader } from '@/components/today/today-section-header';
import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';
import type { ProgressStats } from '@/types';

interface TodayWeekOverviewProps {
  progress: ProgressStats;
  volumeMinutes: number;
  streak: number;
}

export function TodayWeekOverview({ progress, volumeMinutes, streak }: TodayWeekOverviewProps) {
  const completionRatio =
    progress.plannedThisWeek > 0
      ? progress.completedThisWeek / progress.plannedThisWeek
      : 0;
  const volumeTarget = Math.max(volumeMinutes, progress.plannedThisWeek * 45);
  const volumeRatio = volumeTarget > 0 ? Math.min(1, volumeMinutes / volumeTarget) : 0;

  return (
    <View style={styles.section}>
      <TodaySectionHeader title="This week" />
      <View style={styles.card}>
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <AppText style={styles.statValue}>
              {progress.completedThisWeek}/{progress.plannedThisWeek}
            </AppText>
            <AppText style={styles.statLabel}>Workouts</AppText>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${completionRatio * 100}%` }]} />
            </View>
          </View>
          <View style={styles.stat}>
            <AppText style={styles.statValue}>{volumeMinutes}</AppText>
            <AppText style={styles.statLabel}>Min volume</AppText>
            <View style={styles.barTrack}>
              <View style={[styles.barFillMuted, { width: `${volumeRatio * 100}%` }]} />
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <AppText style={styles.footerLabel}>Streak</AppText>
          <AppText style={styles.footerValue}>{streak} days</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  card: {
    marginHorizontal: spacing.lg,
    backgroundColor: palette.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: palette.border,
    gap: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flex: 1,
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: palette.text,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: palette.textSecondary,
    marginBottom: 4,
  },
  barTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: palette.border,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: palette.accent,
    borderRadius: 3,
  },
  barFillMuted: {
    height: '100%',
    backgroundColor: 'rgba(244, 229, 0, 0.45)',
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
  },
  footerLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: palette.textSecondary,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.accent,
  },
});
