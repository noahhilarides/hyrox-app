import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/text';
import type { HyroxRaceEvent } from '@/data/onboarding/races';
import { onboardingRadius, onboardingTheme } from '@/data/onboarding/theme';
import {
  formatRaceCardDate,
  formatRaceCityCountryLine,
} from '@/lib/race-location-display';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Full-width compact race list row height. */
export const RACE_CARD_HEIGHT = 110;
/** @deprecated Carousel width — list layout is full width */
export const RACE_CARD_WIDTH = 0;

interface RaceEventCardProps {
  event: HyroxRaceEvent;
  selected: boolean;
  onPress: () => void;
}

export function RaceEventCard({ event, selected, onPress }: RaceEventCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dateLabel = formatRaceCardDate(event.date, event.endDate);
  const cityCountryLine = formatRaceCityCountryLine(event.city, event.location);

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
      style={[styles.wrap, selected && styles.wrapSelected, animatedStyle]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${event.name}, ${event.city}, ${dateLabel}`}>
      <Image
        source={{ uri: event.imageUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={300}
      />

      <View style={styles.overlayFade1} pointerEvents="none" />
      <View style={styles.overlayFade2} pointerEvents="none" />
      <View style={styles.overlayFade3} pointerEvents="none" />
      <View style={styles.overlayFade4} pointerEvents="none" />

      <View style={styles.topRow}>
        <AppText style={styles.date} numberOfLines={1}>
          {dateLabel}
        </AppText>
        <View style={styles.difficultyPill}>
          <AppText style={styles.difficultyText}>{event.difficulty}</AppText>
        </View>
      </View>

      <View style={styles.bottom}>
        <AppText style={styles.name} numberOfLines={1}>
          {event.name}
        </AppText>
        <AppText style={styles.cityCountry} numberOfLines={1}>
          {cityCountryLine}
        </AppText>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    height: RACE_CARD_HEIGHT,
    borderRadius: onboardingRadius.md,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: onboardingTheme.borderSoft,
  },
  wrapSelected: {
    borderColor: onboardingTheme.accent,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: onboardingTheme.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.28,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  overlayFade1: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 18,
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
  overlayFade2: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
    height: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayFade3: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 34,
    height: 14,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  overlayFade4: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 48,
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  topRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
    zIndex: 2,
  },
  date: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF44F',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  difficultyPill: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: onboardingRadius.full,
    flexShrink: 0,
  },
  difficultyText: {
    color: onboardingTheme.text,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 3,
    zIndex: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 19,
    color: onboardingTheme.text,
  },
  cityCountry: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    color: 'rgba(245,245,246,0.88)',
  },
});
