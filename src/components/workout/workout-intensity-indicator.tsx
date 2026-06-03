import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, spacing } from '@/constants/tokens';
import type { IntensityTone } from '@/lib/workout-display';

interface WorkoutIntensityIndicatorProps {
  label: string;
  tone: IntensityTone;
  color: string;
  inline?: boolean;
}

export function WorkoutIntensityIndicator({
  label,
  tone,
  color,
  inline,
}: WorkoutIntensityIndicatorProps) {
  return (
    <View
      style={[styles.wrap, inline && styles.wrapInline]}
      accessibilityLabel={`Intensity: ${label}`}>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { backgroundColor: color, width: BAR_WIDTH[tone] },
          ]}
        />
      </View>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <AppText style={styles.label}>{label}</AppText>
    </View>
  );
}

const BAR_WIDTH: Record<IntensityTone, `${number}%`> = {
  easy: '25%',
  moderate: '50%',
  hard: '75%',
  simulation: '100%',
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  wrapInline: {
    marginTop: 0,
  },
  barTrack: {
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: palette.border,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: palette.textSecondary,
    textTransform: 'uppercase',
  },
});
