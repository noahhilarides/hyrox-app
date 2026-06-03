import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, spacing } from '@/constants/tokens';

interface SettingsRowProps {
  label: string;
  value?: string;
  placeholder?: string;
  onPress?: () => void;
  last?: boolean;
}

export function SettingsRow({ label, value, placeholder, onPress, last }: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.row, !last && styles.border]}>
      <AppText variant="body">{label}</AppText>
      <View style={styles.right}>
        <AppText variant="body" muted numberOfLines={1} style={styles.value}>
          {value ?? placeholder ?? '—'}
        </AppText>
        {onPress ? <AppText variant="body" muted style={styles.chevron}>›</AppText> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md + 2,
    gap: spacing.md,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: palette.borderSubtle,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  value: {
    maxWidth: '70%',
    textAlign: 'right',
  },
  chevron: {
    fontSize: 20,
    fontWeight: '300',
  },
});
