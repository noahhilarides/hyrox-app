import { StyleSheet, View, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, spacing } from '@/constants/tokens';

interface TodaySectionHeaderProps {
  title: string;
  right?: string;
  style?: ViewStyle;
}

export function TodaySectionHeader({ title, right, style }: TodaySectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <AppText style={styles.title}>{title}</AppText>
      {right ? <AppText style={styles.right}>{right}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: palette.text,
  },
  right: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.textSecondary,
  },
});
