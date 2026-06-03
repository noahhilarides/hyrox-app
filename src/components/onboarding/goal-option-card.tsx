import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { onboardingCardStyles } from '@/components/onboarding/onboarding-card-styles';
import { AppText } from '@/components/ui/text';
import type { GoalOption } from '@/data/onboarding/goals';
import { onboardingLayout, onboardingTheme } from '@/data/onboarding/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GoalOptionCardProps {
  option: GoalOption;
  selected: boolean;
  onPress: () => void;
}

export function GoalOptionCard({ option, selected, onPress }: GoalOptionCardProps) {
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
        <AppText style={[onboardingCardStyles.cardBody, selected && styles.subSelected]}>
          {option.subtitle}
        </AppText>
      </View>

      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
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
  subSelected: {
    color: onboardingTheme.textMuted,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: onboardingTheme.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: onboardingTheme.accent,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: onboardingTheme.accent,
  },
});
