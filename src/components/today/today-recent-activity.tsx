import { format, parseISO } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { TodaySectionHeader } from '@/components/today/today-section-header';
import { WorkoutTypeBadge } from '@/components/workout-type-badge';
import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';
import type { Workout } from '@/types';

interface TodayRecentActivityProps {
  workouts: Workout[];
  onOpenWorkout: (date: string) => void;
  onSeeAll: () => void;
}

export function TodayRecentActivity({
  workouts,
  onOpenWorkout,
  onSeeAll,
}: TodayRecentActivityProps) {
  if (workouts.length === 0) return null;

  return (
    <View style={styles.section}>
      <TodaySectionHeader title="Recent activity" right="See all" />
      <View style={styles.list}>
        {workouts.slice(0, 3).map((w) => (
          <Pressable
            key={w.id}
            onPress={() => {
              Haptics.selectionAsync();
              onOpenWorkout(w.date);
            }}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
            <WorkoutTypeBadge type={w.type} compact />
            <View style={styles.copy}>
              <AppText style={styles.title} numberOfLines={1}>
                {w.title}
              </AppText>
              <AppText style={styles.date}>
                {format(parseISO(w.date), 'EEE, MMM d')} · {w.durationMinutes} min
              </AppText>
            </View>
            <AppText style={styles.check}>✓</AppText>
          </Pressable>
        ))}
      </View>
      <Pressable onPress={onSeeAll} style={styles.seeAll}>
        <AppText style={styles.seeAllText}>View activities</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xxl,
  },
  list: {
    marginHorizontal: spacing.lg,
    backgroundColor: palette.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
  },
  rowPressed: {
    backgroundColor: palette.bgElevated,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  date: {
    fontSize: 12,
    color: palette.textSecondary,
  },
  check: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.success,
  },
  seeAll: {
    alignSelf: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.accent,
  },
});
