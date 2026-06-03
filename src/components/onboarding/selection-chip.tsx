import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/text';
import { onboardingLayout, onboardingRadius, onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';

interface SelectionChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  compact?: boolean;
  style?: ViewStyle;
}

export function SelectionChip({ label, selected, onPress, compact, style }: SelectionChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={[
        styles.chip,
        compact && styles.chipCompact,
        selected && styles.chipSelected,
        style,
      ]}>
      <AppText style={[styles.label, selected && styles.labelSelected]}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: onboardingSpacing.md,
    paddingVertical: onboardingSpacing.sm + 2,
    borderRadius: onboardingRadius.md,
    backgroundColor: onboardingTheme.card,
    borderWidth: 1,
    borderColor: onboardingTheme.borderSoft,
    minWidth: 72,
    alignItems: 'center',
  },
  chipCompact: {
    minWidth: 44,
    paddingHorizontal: onboardingSpacing.sm + 2,
    paddingVertical: onboardingSpacing.sm,
  },
  chipSelected: {
    borderColor: onboardingTheme.accent,
    backgroundColor: onboardingTheme.accentSelected,
    ...Platform.select({
      ios: {
        shadowColor: onboardingTheme.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: onboardingTheme.text,
  },
  labelSelected: {
    color: onboardingTheme.accent,
    fontWeight: '600',
  },
});
