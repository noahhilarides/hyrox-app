import { StyleSheet, View } from 'react-native';

import { onboardingRadius, onboardingTheme } from '@/data/onboarding/theme';

interface AbilityLevelIndicatorProps {
  /** How many of 4 bars are filled (0–3) */
  levelIndex: number;
  selected?: boolean;
}

const BAR_COUNT = 4;

export function AbilityLevelIndicator({ levelIndex, selected }: AbilityLevelIndicatorProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { height: 8 + i * 6 },
            i <= levelIndex && (selected ? styles.barActiveSelected : styles.barActive),
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 32,
  },
  bar: {
    width: 6,
    borderRadius: onboardingRadius.sm,
    backgroundColor: onboardingTheme.border,
  },
  barActive: {
    backgroundColor: onboardingTheme.accentBorderMedium,
  },
  barActiveSelected: {
    backgroundColor: onboardingTheme.accent,
  },
});
