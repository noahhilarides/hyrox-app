import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';

interface PlanActionCardProps {
  title: string;
  description?: string;
  emoji: string;
  primary?: boolean;
  onPress: () => void;
}

export function PlanActionCard({
  title,
  description,
  emoji,
  primary,
  onPress,
}: PlanActionCardProps) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={[styles.card, primary && styles.cardPrimary]}>
      <View style={[styles.iconWrap, primary && styles.iconWrapPrimary]}>
        <AppText style={styles.emoji}>{emoji}</AppText>
      </View>
      <View style={styles.copy}>
        <AppText variant="bodyMedium" style={primary ? styles.titlePrimary : undefined}>
          {title}
        </AppText>
        {description ? (
          <AppText variant="caption" muted={!primary} style={primary ? styles.descPrimary : undefined}>
            {description}
          </AppText>
        ) : null}
      </View>
      <AppText variant="body" muted style={primary ? styles.chevronPrimary : styles.chevron}>
        ›
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    gap: spacing.md,
  },
  cardPrimary: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: palette.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapPrimary: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  emoji: {
    fontSize: 22,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  titlePrimary: {
    color: palette.accentText,
    fontWeight: '600',
  },
  descPrimary: {
    color: 'rgba(0, 0, 0, 0.65)',
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
  },
  chevronPrimary: {
    fontSize: 24,
    fontWeight: '300',
    color: palette.accentText,
    opacity: 0.6,
  },
});
