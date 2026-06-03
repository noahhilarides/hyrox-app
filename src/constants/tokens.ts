/**
 * HYROX-inspired design tokens — premium, race-focused, high contrast.
 */

export const palette = {
  bg: '#000000',
  bgElevated: '#1A1A1A',
  bgCard: '#111111',
  border: 'rgba(255, 255, 255, 0.08)',
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  text: '#FFFFFF',
  textSecondary: '#A1A1A1',
  textMuted: '#A1A1A1',
  accent: '#F4E500',
  accentDim: 'rgba(244, 229, 0, 0.12)',
  accentSoft: 'rgba(244, 229, 0, 0.08)',
  accentOnSurface: 'rgba(244, 229, 0, 0.1)',
  accentBorder: 'rgba(244, 229, 0, 0.35)',
  accentBorderMedium: 'rgba(244, 229, 0, 0.45)',
  accentBorderStrong: 'rgba(244, 229, 0, 0.5)',
  accentBorderSubtle: 'rgba(244, 229, 0, 0.25)',
  accentText: '#000000',
  success: '#D7FF3F',
  danger: '#FF6B6B',
  white: '#FFFFFF',
} as const;

/** Workout tags — yellow system with contrast-friendly variants */
export const workoutColors = {
  run: '#FFFFFF',
  strength: '#F4E500',
  conditioning: '#D7FF3F',
  speed: '#7EB8FF',
  skills: '#C9A0FF',
  recovery: '#A1A1A1',
  hyrox: '#F4E500',
  race_sim: '#F4E500',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

/** Slightly sharper corners — athletic, minimal */
export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
} as const;

export const typography = {
  hero: { fontSize: 34, fontWeight: '800' as const, letterSpacing: -1, lineHeight: 40 },
  title: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.6, lineHeight: 32 },
  headline: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.4, lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  caption: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18, letterSpacing: 0.15 },
  label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.4, textTransform: 'uppercase' as const },
  mono: { fontSize: 14, fontWeight: '600' as const, fontVariant: ['tabular-nums'] as const },
};

export const touchTarget = 52;
