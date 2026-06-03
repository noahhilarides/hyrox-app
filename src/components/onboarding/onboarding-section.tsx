import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';

interface OnboardingSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function OnboardingSection({ title, subtitle, children }: OnboardingSectionProps) {
  return (
    <View style={styles.wrap}>
      <AppText style={styles.title}>{title}</AppText>
      {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: onboardingSpacing.section,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: onboardingTheme.textSubtle,
    marginBottom: onboardingSpacing.sm,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: onboardingTheme.textSubtle,
    marginBottom: onboardingSpacing.md,
  },
});
