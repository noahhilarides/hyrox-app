import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { onboardingCardStyles } from '@/components/onboarding/onboarding-card-styles';
import { AppText } from '@/components/ui/text';
import { onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SelectionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

export function SelectionCard({ label, description, selected, onPress }: SelectionCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 16, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 300 });
      }}
      style={[
        onboardingCardStyles.base,
        styles.card,
        selected && onboardingCardStyles.selected,
        animatedStyle,
      ]}>
      {selected ? <View style={onboardingCardStyles.glow} pointerEvents="none" /> : null}
      <AppText style={[styles.label, selected && styles.labelSelected]}>{label}</AppText>
      {description ? (
        <AppText style={onboardingCardStyles.cardBody}>{description}</AppText>
      ) : null}
      {selected ? <View style={styles.dot} /> : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '47%',
    marginRight: onboardingSpacing.sm,
    gap: 3,
    minHeight: 68,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: onboardingTheme.text,
  },
  labelSelected: {
    color: onboardingTheme.accent,
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: onboardingTheme.accent,
  },
});
