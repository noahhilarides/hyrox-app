import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import {
  onboardingSpacing,
  onboardingTheme,
  onboardingType,
} from '@/data/onboarding/theme';

interface OnboardingScreenIntroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function OnboardingScreenIntro({ title, subtitle, children }: OnboardingScreenIntroProps) {
  return (
    <View style={styles.wrap}>
      <AppText style={styles.title}>{title}</AppText>
      {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
      {children ? <View style={styles.children}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: onboardingSpacing.section,
    paddingTop: onboardingSpacing.xs,
  },
  title: {
    ...onboardingType.screenTitle,
    color: onboardingTheme.text,
    marginBottom: onboardingSpacing.md,
  },
  subtitle: {
    ...onboardingType.screenSubtitle,
    color: onboardingTheme.textSubtle,
    maxWidth: 340,
  },
  children: {
    marginTop: onboardingSpacing.md,
  },
});
