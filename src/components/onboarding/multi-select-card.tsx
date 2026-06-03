import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { onboardingRadius, onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';

interface MultiSelectCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

export function MultiSelectCard({ label, description, selected, onPress }: MultiSelectCardProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
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
          <AppText variant="caption" muted>
            {description}
          </AppText>
        ) : null}
      </View>
      <View style={[styles.check, selected && styles.checkSelected]}>
        {selected ? <AppText style={styles.checkMark}>✓</AppText> : null}
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
  check: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: onboardingTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSelected: {
    borderColor: onboardingTheme.accent,
    backgroundColor: onboardingTheme.accent,
  },
  checkMark: {
    color: onboardingTheme.accentOn,
    fontSize: 14,
    fontWeight: '700',
  },
});
