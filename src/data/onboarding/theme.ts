/**
 * Onboarding visual tokens — aligned with global HYROX theme.
 */

import { palette, radius, spacing } from '@/constants/tokens';

export const onboardingTheme = {
  bg: palette.bg,
  bgElevated: palette.bgElevated,
  card: palette.bgCard,
  border: palette.border,
  borderSoft: 'rgba(255, 255, 255, 0.06)',
  text: palette.text,
  textMuted: palette.textSecondary,
  textSubtle: 'rgba(161, 161, 161, 0.85)',
  accent: palette.accent,
  accentDim: palette.accentDim,
  accentSoft: palette.accentSoft,
  accentSelected: 'rgba(244, 229, 0, 0.16)',
  accentGlow: 'rgba(244, 229, 0, 0.22)',
  accentOn: palette.accentText,
  accentBorder: palette.accentBorder,
  accentBorderMedium: palette.accentBorderMedium,
  accentBorderStrong: palette.accentBorderStrong,
  accentBorderSubtle: palette.accentBorderSubtle,
  accentOnSurface: palette.accentOnSurface,
  danger: palette.danger,
} as const;

export const onboardingSpacing = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  xxl: spacing.xxl,
  /** Extra top inset below nav on scroll content */
  contentTop: spacing.lg,
  section: spacing.xl,
} as const;

export const onboardingRadius = {
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
  xl: radius.xl,
  full: radius.full,
  button: 14,
} as const;

/** Shared typography — premium athletic hierarchy */
export const onboardingType = {
  screenTitle: {
    fontSize: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  screenSubtitle: {
    fontSize: 14,
    lineHeight: 21,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  cardBody: {
    fontSize: 12,
    lineHeight: 17,
  },
} as const;

export const onboardingLayout = {
  cardPadding: 14,
  cardGap: 12,
  cardMarginBottom: 10,
  iconSize: 44,
  tileMinHeight: 108,
} as const;
