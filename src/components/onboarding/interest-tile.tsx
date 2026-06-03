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
import type { InterestOption } from '@/data/onboarding/interests';
import { onboardingLayout, onboardingTheme } from '@/data/onboarding/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface InterestTileProps {
  option: InterestOption;
  selected: boolean;
  onPress: () => void;
}

export function InterestTile({ option, selected, onPress }: InterestTileProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 16, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 300 });
      }}
      style={[
        onboardingCardStyles.base,
        styles.tile,
        selected && onboardingCardStyles.selected,
        animatedStyle,
      ]}>
      {selected ? <View style={onboardingCardStyles.glow} pointerEvents="none" /> : null}

      {selected ? (
        <View style={styles.checkBadge}>
          <Ionicons name="checkmark" size={12} color={onboardingTheme.accentOn} />
        </View>
      ) : null}

      <View style={[styles.iconRing, selected && styles.iconRingSelected]}>
        <Ionicons
          name={option.icon}
          size={20}
          color={selected ? onboardingTheme.accent : onboardingTheme.textMuted}
        />
      </View>

      <AppText style={[styles.label, selected && styles.labelSelected]} numberOfLines={2}>
        {option.label}
      </AppText>
      <AppText style={onboardingCardStyles.cardBody}>{option.tagline}</AppText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    minHeight: onboardingLayout.tileMinHeight,
    gap: 5,
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: onboardingTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: onboardingTheme.bgElevated,
    borderWidth: 1,
    borderColor: onboardingTheme.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconRingSelected: {
    borderColor: onboardingTheme.accentBorderStrong,
    backgroundColor: onboardingTheme.accentOnSurface,
  },
  label: {
    color: onboardingTheme.text,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  labelSelected: {
    color: onboardingTheme.accent,
  },
});
