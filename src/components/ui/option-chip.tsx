import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet } from 'react-native';

import { palette, radius, spacing } from '@/constants/tokens';

import { AppText } from './text';

interface OptionChipProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

export function OptionChip({ label, description, selected, onPress }: OptionChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={[styles.chip, selected && styles.chipSelected]}>
      <AppText variant="bodyMedium" style={selected ? styles.labelSelected : undefined}>
        {label}
      </AppText>
      {description ? (
        <AppText variant="caption" muted style={styles.description}>
          {description}
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: palette.bgCard,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: spacing.sm,
  },
  chipSelected: {
    borderColor: palette.accent,
    backgroundColor: palette.accentDim,
  },
  labelSelected: {
    color: palette.accent,
  },
  description: {
    marginTop: 4,
  },
});
