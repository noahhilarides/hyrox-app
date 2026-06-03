import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AbilityLevelIndicator } from '@/components/onboarding/ability-level-indicator';
import { onboardingCardStyles } from '@/components/onboarding/onboarding-card-styles';
import { AppText } from '@/components/ui/text';
import type { AbilityOption } from '@/data/onboarding/abilities';
import { onboardingLayout, onboardingTheme } from '@/data/onboarding/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AbilityOptionCardProps {
  option: AbilityOption;
  selected: boolean;
  onPress: () => void;
}

export function AbilityOptionCard({ option, selected, onPress }: AbilityOptionCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

      <View style={[onboardingCardStyles.iconWrap, selected && onboardingCardStyles.iconWrapSelected]}>
        <Ionicons
          name={option.icon}
          size={22}
          color={selected ? onboardingTheme.accent : onboardingTheme.textMuted}
        />
      </View>

      <View style={styles.copy}>
        <AppText style={[styles.title, selected && styles.titleSelected]}>{option.title}</AppText>
        <AppText style={onboardingCardStyles.cardBody}>{option.description}</AppText>
      </View>

      <AbilityLevelIndicator levelIndex={option.levelIndex} selected={selected} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: onboardingLayout.cardGap,
  },
  copy: {
    flex: 1,
    gap: 3,
    paddingRight: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: onboardingTheme.text,
  },
  titleSelected: {
    color: onboardingTheme.accent,
  },
});
