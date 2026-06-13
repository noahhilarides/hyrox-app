import { Ionicons } from '@expo/vector-icons';
import { format, isToday, parseISO } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { TodaySectionHeader } from '@/components/today/today-section-header';
import { WorkoutTypeBadge } from '@/components/workout-type-badge';
import { AppText } from '@/components/ui/text';
import { getWorkoutTypeLabel } from '@/lib/plan-generator';
import { palette, radius, spacing } from '@/constants/tokens';
import type { Workout } from '@/types';

interface TodayFeaturedWorkoutProps {
  workout: Workout | undefined;
  selectedDate: string;
  onOpenWorkout: (date: string) => void;
}

export function TodayFeaturedWorkout({
  workout,
  selectedDate,
  onOpenWorkout,
}: TodayFeaturedWorkoutProps) {
  const isTodaySelected = isToday(parseISO(selectedDate));
  const sectionTitle = isTodaySelected ? "Today's workout" : format(parseISO(selectedDate), 'EEEE');

  if (!workout) {
    return (
      <View style={styles.section}>
        <TodaySectionHeader title={sectionTitle} />
        <View style={[styles.card, styles.cardRest]}>
          <Ionicons name="moon-outline" size={28} color={palette.textSecondary} />
          <AppText style={styles.restTitle}>Recovery scheduled</AppText>
          <AppText style={styles.restBody}>No session today. Absorb the work you’ve already put in.</AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <TodaySectionHeader title={sectionTitle} />
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onOpenWorkout(workout.date);
        }}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        <View style={styles.gradientTop} />
        <View style={styles.cardInner}>
          <View style={styles.topRow}>
            <WorkoutTypeBadge type={workout.type} compact />
            <AppText style={styles.duration}>{workout.durationMinutes} min</AppText>
          </View>

          <AppText style={styles.workoutTitle} numberOfLines={2}>
            {workout.title}
          </AppText>
          <AppText style={styles.subtitle} numberOfLines={2}>
            {workout.subtitle}
          </AppText>

          <View style={styles.metaRow}>
            <AppText style={styles.meta}>{getWorkoutTypeLabel(workout.type)}</AppText>
            {workout.focus[0] ? (
              <>
                <AppText style={styles.metaDot}>·</AppText>
                <AppText style={styles.meta}>{workout.focus[0]}</AppText>
              </>
            ) : null}
          </View>

          <View style={styles.actionRow}>
            <View style={styles.actionBtn}>
              <Ionicons
                name={workout.completed ? 'checkmark-circle' : 'play'}
                size={18}
                color={workout.completed ? palette.success : palette.accentText}
              />
              <AppText style={styles.actionLabel}>
                {workout.completed ? 'View session' : isTodaySelected ? 'Start' : 'Open'}
              </AppText>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  card: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: palette.bgCard,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardPressed: {
    opacity: 0.94,
  },
  cardRest: {
    padding: spacing.lg,
    alignItems: 'flex-start',
    gap: spacing.sm,
    minHeight: 120,
  },
  gradientTop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(244, 229, 0, 0.08)',
  },
  cardInner: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  duration: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 26,
    color: palette.text,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  meta: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.accent,
    opacity: 0.9,
  },
  metaDot: {
    marginHorizontal: 6,
    color: palette.textSecondary,
  },
  actionRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: palette.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.accentText,
  },
  restTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.text,
  },
  restBody: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.textSecondary,
  },
});
