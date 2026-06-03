import { StyleSheet, View } from 'react-native';

import { onboardingTheme } from '@/data/onboarding/theme';

/** Layered matte gradients — no extra native deps. */
export function WelcomeBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.base} />
      <View style={styles.spotTop} />
      <View style={styles.spotAccent} />
      <View style={styles.vignette} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFill,
    backgroundColor: onboardingTheme.bg,
  },
  spotTop: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: onboardingTheme.bgElevated,
    opacity: 0.85,
  },
  spotAccent: {
    position: 'absolute',
    top: 80,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: onboardingTheme.accent,
    opacity: 0.04,
  },
  vignette: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
    backgroundColor: onboardingTheme.bg,
    opacity: 0.55,
  },
});
