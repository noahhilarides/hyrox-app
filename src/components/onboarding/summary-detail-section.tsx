import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';

interface SummaryDetailSectionProps {
  title: string;
  items: string[];
  accent?: boolean;
}

export function SummaryDetailSection({ title, items, accent }: SummaryDetailSectionProps) {
  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <AppText style={styles.title}>{title}</AppText>
      <View style={styles.list}>
        {items.map((item) => (
          <View key={item} style={styles.row}>
            <View style={[styles.bullet, accent && styles.bulletAccent]} />
            <AppText style={styles.item}>{item}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: onboardingSpacing.section,
    paddingBottom: onboardingSpacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: onboardingTheme.borderSoft,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: onboardingTheme.textSubtle,
    marginBottom: onboardingSpacing.md,
  },
  list: {
    gap: onboardingSpacing.sm + 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: onboardingSpacing.md,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: onboardingTheme.textMuted,
    marginTop: 8,
    opacity: 0.6,
  },
  bulletAccent: {
    backgroundColor: onboardingTheme.accent,
    opacity: 1,
  },
  item: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: onboardingTheme.text,
    fontWeight: '500',
  },
});
