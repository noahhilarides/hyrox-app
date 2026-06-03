import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { onboardingRadius, onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';

interface SelectableOptionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

export function SelectableOptionCard({
  label,
  description,
  selected,
  onPress,
}: SelectableOptionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={[styles.card, selected && styles.cardSelected]}>
      <View style={styles.copy}>
        <AppText variant="bodyMedium" style={selected ? styles.labelSelected : undefined}>
          {label}
        </AppText>
        {description ? (
          <AppText variant="caption" muted style={selected ? styles.descSelected : undefined}>
            {description}
          </AppText>
        ) : null}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: onboardingTheme.card,
    borderRadius: onboardingRadius.md,
    borderWidth: 1,
    borderColor: onboardingTheme.borderSoft,
    padding: onboardingSpacing.md,
    marginBottom: onboardingSpacing.sm,
    gap: onboardingSpacing.md,
  },
  cardSelected: {
    borderColor: onboardingTheme.accent,
    backgroundColor: onboardingTheme.accentDim,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  labelSelected: {
    color: onboardingTheme.accent,
  },
  descSelected: {
    color: onboardingTheme.textMuted,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: onboardingTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: onboardingTheme.accent,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: onboardingTheme.accent,
  },
});
