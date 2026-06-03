import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { palette, radius, touchTarget, typography } from '@/constants/tokens';

import { AppText } from './text';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'lg' | 'md';
}

export function Button({
  label,
  variant = 'primary',
  size = 'lg',
  disabled,
  onPress,
  style: styleProp,
  ...props
}: ButtonProps) {
  const handlePress: PressableProps['onPress'] = (e) => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={handlePress}
      style={(state) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        state.pressed && styles.pressed,
        disabled && styles.disabled,
        typeof styleProp === 'function' ? styleProp(state) : styleProp,
      ]}
      {...props}>
      <AppText
        style={[
          styles.label,
          variant === 'primary' ? styles.labelPrimary : styles.labelSecondary,
        ]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: touchTarget,
  },
  lg: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  md: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
  },
  primary: {
    backgroundColor: palette.accent,
  },
  secondary: {
    backgroundColor: palette.bgCard,
    borderWidth: 1,
    borderColor: palette.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    ...typography.bodyMedium,
  },
  labelPrimary: {
    color: palette.accentText,
    fontWeight: '600',
  },
  labelSecondary: {
    color: palette.text,
    fontWeight: '600',
  },
});
