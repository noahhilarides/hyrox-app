import { Platform, StyleSheet, View } from 'react-native';

import { WorkoutTypeBadge } from '@/components/workout-type-badge';
import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';
import type { Workout } from '@/types';

interface WorkoutHeroCardProps {
  workout: Workout;
}

export function WorkoutHeroCard({ workout }: WorkoutHeroCardProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.glow} pointerEvents="none" />
      <View style={styles.card}>
        <View style={styles.header}>
          <WorkoutTypeBadge type={workout.type} compact />
          <AppText style={styles.duration}>{workout.durationMinutes} min</AppText>
        </View>

        <AppText style={styles.title}>{workout.title}</AppText>

        <AppText style={styles.subtitle} numberOfLines={2}>
          {workout.subtitle}
        </AppText>

        {workout.focus.length > 0 ? (
          <View style={styles.focusRow}>
            {workout.focus.slice(0, 3).map((f) => (
              <View key={f} style={styles.focusPill}>
                <AppText style={styles.focusText}>{f}</AppText>
              </View>
            ))}
          </View>
        ) : null}

        {workout.completed ? (
          <AppText style={styles.done}>Completed</AppText>
        ) : null}
      </View>
    </View>
  );
}

const CARD_RADIUS = 22;

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: 8,
    left: 12,
    right: 12,
    bottom: -6,
    borderRadius: CARD_RADIUS,
    backgroundColor: 'rgba(244, 229, 0, 0.06)',
    ...Platform.select({
      ios: {
        shadowColor: palette.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {},
    }),
  },
  card: {
    backgroundColor: palette.bgCard,
    borderRadius: CARD_RADIUS,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg + 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    minHeight: 200,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
      android: { elevation: 6 },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  duration: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.textSecondary,
    opacity: 0.7,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.7,
    lineHeight: 34,
    color: palette.text,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: palette.textSecondary,
    opacity: 0.8,
    marginBottom: spacing.sm,
  },
  focusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  focusPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  focusText: {
    fontSize: 11,
    fontWeight: '600',
    color: palette.textSecondary,
    opacity: 0.85,
    letterSpacing: 0.2,
  },
  done: {
    marginTop: spacing.lg,
    fontSize: 12,
    fontWeight: '600',
    color: palette.success,
    letterSpacing: 0.3,
  },
});
