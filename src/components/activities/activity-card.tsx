import { format, parseISO } from 'date-fns';
import { Pressable, StyleSheet, View } from 'react-native';

import { WorkoutTypeBadge } from '@/components/workout-type-badge';
import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';
import type { Workout } from '@/types';

interface ActivityCardProps {
  workout: Workout;
  onPress?: () => void;
}

export function ActivityCard({ workout, onPress }: ActivityCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.left}>
        <AppText variant="bodyMedium">{workout.title}</AppText>
        <AppText variant="caption" muted>
          {format(parseISO(workout.date), 'EEE, MMM d')} · {workout.durationMinutes} min
        </AppText>
        <View style={styles.stats}>
          <AppText variant="caption" muted>
            Pace — · Time — · Effort —
          </AppText>
        </View>
      </View>
      <WorkoutTypeBadge type={workout.type} compact />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: palette.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    gap: spacing.md,
  },
  left: {
    flex: 1,
    gap: 4,
  },
  stats: {
    marginTop: spacing.sm,
  },
});
