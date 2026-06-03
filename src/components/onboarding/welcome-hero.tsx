import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { onboardingRadius, onboardingTheme } from '@/data/onboarding/theme';

export function WelcomeHero() {
  const pulse = useSharedValue(0);
  const rise = useSharedValue(24);
  const fade = useSharedValue(0);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    rise.value = withTiming(0, { duration: 900, easing: Easing.out(Easing.cubic) });
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [fade, pulse, rise]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: rise.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + pulse.value * 0.25,
    transform: [{ scale: 1 + pulse.value * 0.06 }],
  }));

  return (
    <Animated.View style={[styles.wrap, cardStyle]}>
      <Animated.View style={[styles.glowOrb, glowStyle]} />
      <View style={styles.frame}>
        <View style={styles.iconRing}>
          <Ionicons name="fitness" size={48} color={onboardingTheme.accent} />
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Ionicons name="walk" size={14} color={onboardingTheme.accent} />
          </View>
          <View style={[styles.statPill, styles.statPillMid]}>
            <Ionicons name="barbell" size={14} color={onboardingTheme.accent} />
          </View>
          <View style={styles.statPill}>
            <Ionicons name="flag" size={14} color={onboardingTheme.accent} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 280,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowOrb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: onboardingTheme.accent,
    opacity: 0.2,
  },
  frame: {
    width: '100%',
    height: '100%',
    borderRadius: onboardingRadius.xl,
    borderWidth: 1,
    borderColor: onboardingTheme.accentBorderSubtle,
    backgroundColor: 'rgba(20, 20, 22, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: onboardingTheme.accentBorder,
    backgroundColor: onboardingTheme.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: onboardingTheme.bgElevated,
    borderWidth: 1,
    borderColor: onboardingTheme.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statPillMid: {
    borderColor: onboardingTheme.accentBorderMedium,
    backgroundColor: onboardingTheme.accentDim,
  },
});
