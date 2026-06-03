import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';

interface StatPillProps {
  value: string;
  label: string;
  highlight?: boolean;
  style?: ViewStyle;
}

export function StatPill({ value, label, highlight, style }: StatPillProps) {
  return (
    <View style={[styles.pill, highlight && styles.highlight, style]}>
      <AppText style={[styles.value, highlight && styles.valueHighlight]}>{value}</AppText>
      <AppText style={styles.label}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    minHeight: 88,
    backgroundColor: palette.bgCard,
    borderRadius: radius.lg + 2,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
    }),
  },
  highlight: {
    borderColor: 'rgba(244, 229, 0, 0.22)',
    backgroundColor: 'rgba(244, 229, 0, 0.06)',
  },
  value: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 34,
    color: palette.text,
  },
  valueHighlight: {
    color: palette.accent,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'lowercase',
    color: palette.textSecondary,
    opacity: 0.75,
  },
});
