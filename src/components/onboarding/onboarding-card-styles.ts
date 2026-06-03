import { Platform, StyleSheet } from 'react-native';

import {
  onboardingLayout,
  onboardingRadius,
  onboardingTheme,
} from '@/data/onboarding/theme';

/** Shared selectable card surfaces for onboarding */
export const onboardingCardStyles = StyleSheet.create({
  base: {
    backgroundColor: onboardingTheme.card,
    borderRadius: onboardingRadius.lg,
    borderWidth: 1,
    borderColor: onboardingTheme.borderSoft,
    padding: onboardingLayout.cardPadding,
    marginBottom: onboardingLayout.cardMarginBottom,
    overflow: 'hidden',
  },
  selected: {
    borderColor: onboardingTheme.accent,
    backgroundColor: onboardingTheme.accentSelected,
    ...Platform.select({
      ios: {
        shadowColor: onboardingTheme.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.22,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  glow: {
    ...StyleSheet.absoluteFill,
    borderRadius: onboardingRadius.lg,
    borderWidth: 1,
    borderColor: onboardingTheme.accentGlow,
  },
  iconWrap: {
    width: onboardingLayout.iconSize,
    height: onboardingLayout.iconSize,
    borderRadius: onboardingRadius.md,
    backgroundColor: onboardingTheme.bgElevated,
    borderWidth: 1,
    borderColor: onboardingTheme.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapSelected: {
    borderColor: onboardingTheme.accentBorderStrong,
    backgroundColor: onboardingTheme.accentOnSurface,
  },
  cardBody: {
    fontSize: 12,
    lineHeight: 17,
    color: onboardingTheme.textSubtle,
  },
});
