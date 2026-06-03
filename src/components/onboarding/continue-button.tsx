import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/text';
import { onboardingRadius, onboardingTheme } from '@/data/onboarding/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ContinueButtonProps {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ContinueButton({
  label = 'Continue',
  onPress,
  disabled,
  loading,
}: ContinueButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={() => {
        if (!disabled && !loading) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onPress();
      }}
      onPressIn={() => {
        if (!disabled && !loading) {
          scale.value = withSpring(0.98, { damping: 18, stiffness: 420 });
        }
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 320 });
      }}
      style={[
        styles.button,
        (disabled || loading) && styles.disabled,
        animatedStyle,
      ]}>
      {loading ? (
        <ActivityIndicator color={onboardingTheme.accentOn} />
      ) : (
        <AppText style={styles.label}>{label}</AppText>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: onboardingRadius.button,
    backgroundColor: onboardingTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  disabled: {
    opacity: 0.38,
  },
  label: {
    color: onboardingTheme.accentOn,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
