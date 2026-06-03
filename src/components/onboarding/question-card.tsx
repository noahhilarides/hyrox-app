import { StyleSheet, View, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/text';
import { onboardingSpacing } from '@/data/onboarding/theme';

interface QuestionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function QuestionCard({ title, subtitle, children, style }: QuestionCardProps) {
  return (
    <View style={[styles.wrap, style]}>
      <AppText variant="title" style={styles.title}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="body" muted style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  title: {
    marginBottom: onboardingSpacing.sm,
  },
  subtitle: {
    marginBottom: onboardingSpacing.lg,
    lineHeight: 24,
  },
  body: {
    flex: 1,
  },
});
