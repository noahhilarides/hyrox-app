import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';
import type { ProgressStats } from '@/types';

interface TodayWeekTileProps {
  progress: ProgressStats;
  weekNumber: number;
  phase: string;
}

export function TodayWeekTile({ progress, weekNumber, phase }: TodayWeekTileProps) {
  const { plannedThisWeek, completedThisWeek } = progress;
  const segments = Math.max(plannedThisWeek, 0);
  const phaseLabel = phase.charAt(0).toUpperCase() + phase.slice(1);

  return (
    <View style={styles.card}>
      <View>
        <AppText style={styles.weekLabel}>
          Week {weekNumber} · {phaseLabel}
        </AppText>
        <AppText style={styles.statValue}>
          {completedThisWeek}/{plannedThisWeek}
        </AppText>
      </View>

      <View style={styles.bottom}>
        <Ionicons name="barbell" size={16} color={palette.textSecondary} />
        <View style={styles.barTrackWrap}>
          {segments > 0 ? (
            <View style={styles.barTrack}>
              {Array.from({ length: segments }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.barSegment,
                    index < completedThisWeek && styles.barSegmentFilled,
                  ]}
                />
              ))}
            </View>
          ) : (
            <View style={styles.barTrackPlaceholder} />
          )}
        </View>
        <AppText style={styles.bottomCount}>
          {completedThisWeek}/{plannedThisWeek}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    height: 200,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.bgCard,
    marginRight: spacing.md,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  weekLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: palette.text,
    marginTop: 4,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barTrackWrap: {
    flex: 1,
  },
  bottomCount: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.textSecondary,
  },
  barTrack: {
    flexDirection: 'row',
    gap: 3,
    height: 5,
  },
  barTrackPlaceholder: {
    height: 5,
  },
  barSegment: {
    flex: 1,
    borderRadius: 2,
    backgroundColor: palette.border,
  },
  barSegmentFilled: {
    backgroundColor: palette.accent,
  },
});
