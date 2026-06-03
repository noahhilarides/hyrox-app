import { StyleSheet, View } from 'react-native';

import { onboardingRadius, onboardingTheme } from '@/data/onboarding/theme';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}>
      <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    backgroundColor: onboardingTheme.borderSoft,
    borderRadius: onboardingRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: onboardingTheme.accent,
    borderRadius: onboardingRadius.full,
  },
});
