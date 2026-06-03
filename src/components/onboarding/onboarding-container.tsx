import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';

interface OnboardingContainerProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
}

export function OnboardingContainer({
  children,
  footer,
  scroll = true,
  style,
}: OnboardingContainerProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View
      style={[
        styles.inner,
        { paddingBottom: footer ? 0 : insets.bottom + onboardingSpacing.lg },
        style,
      ]}>
      {children}
    </View>
  );

  return (
    <View style={styles.root}>
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {footer ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + onboardingSpacing.lg }]}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: onboardingTheme.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: onboardingSpacing.md,
  },
  inner: {
    flex: 1,
    paddingHorizontal: onboardingSpacing.lg,
    paddingTop: onboardingSpacing.contentTop,
  },
  footer: {
    paddingHorizontal: onboardingSpacing.lg,
    paddingTop: onboardingSpacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: onboardingTheme.borderSoft,
    backgroundColor: onboardingTheme.bg,
  },
});
