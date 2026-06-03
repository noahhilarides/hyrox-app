import { StyleSheet, View } from 'react-native';

import { palette, radius, spacing, workoutColors } from '@/constants/tokens';
import { getWorkoutTypeLabel } from '@/lib/plan-generator';
import type { WorkoutType } from '@/types';

import { AppText } from './ui/text';

interface WorkoutTypeBadgeProps {
  type: WorkoutType;
  compact?: boolean;
}

export function WorkoutTypeBadge({ type, compact }: WorkoutTypeBadgeProps) {
  const color = workoutColors[type] ?? palette.accent;
  return (
    <View style={[styles.badge, { backgroundColor: `${color}22` }, compact && styles.compact]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <AppText variant="caption" style={{ ...styles.label, color }}>
        {getWorkoutTypeLabel(type)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: radius.full,
    gap: 6,
  },
  compact: {
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'none',
  },
});
