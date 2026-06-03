import { StyleSheet, Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { palette, typography } from '@/constants/tokens';

type Variant = 'hero' | 'title' | 'headline' | 'body' | 'bodyMedium' | 'caption' | 'label';

interface AppTextProps extends TextProps {
  variant?: Variant;
  muted?: boolean;
  accent?: boolean;
  style?: StyleProp<TextStyle>;
}

export function AppText({
  variant = 'body',
  muted,
  accent,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        styles.base,
        typography[variant],
        muted && styles.muted,
        accent && styles.accent,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: palette.text,
  },
  muted: {
    color: palette.textSecondary,
  },
  accent: {
    color: palette.accent,
  },
});
