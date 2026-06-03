import { Pressable, StyleSheet, View } from 'react-native';

import { palette, radius, spacing } from '@/constants/tokens';
import type { Workout } from '@/types';

import { WorkoutTypeBadge } from './workout-type-badge';
import { AppText } from './ui/text';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
  highlighted?: boolean;
}

export function WorkoutCard({ workout, onPress, highlighted }: WorkoutCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, highlighted && styles.cardHighlighted, workout.completed && styles.completed]}>
      <View style={styles.header}>
        <WorkoutTypeBadge type={workout.type} />
        <AppText variant="caption" muted>
          {workout.durationMinutes} min
        </AppText>
      </View>
      <AppText variant="headline" style={styles.title}>
        {workout.title}
      </AppText>
      <AppText variant="body" muted numberOfLines={2}>
        {workout.subtitle}
      </AppText>
      {workout.completed ? (
        <AppText variant="caption" style={styles.done}>
          Completed
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    marginBottom: spacing.md,
  },
  cardHighlighted: {
    borderColor: palette.accent,
  },
  completed: {
    opacity: 0.72,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    marginBottom: spacing.xs,
  },
  done: {
    marginTop: spacing.sm,
    color: palette.success,
    fontWeight: '600',
  },
});
