import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import type { TodayFeedModule } from '@/data/today/feed-modules';
import { palette, radius, spacing } from '@/constants/tokens';

interface TodayFeedCardProps {
  module: TodayFeedModule;
  tall?: boolean;
}

export function TodayFeedCard({ module, tall }: TodayFeedCardProps) {
  return (
    <Pressable
      onPress={() => Haptics.selectionAsync()}
      style={({ pressed }) => [
        styles.card,
        tall && styles.cardTall,
        { backgroundColor: module.gradient[0] },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.gradientLayer, { backgroundColor: module.gradient[1] }]} />
      <View style={styles.inner}>
        {module.tag ? (
          <View style={styles.tag}>
            <AppText style={styles.tagText}>{module.tag}</AppText>
          </View>
        ) : null}
        <AppText style={styles.title} numberOfLines={2}>
          {module.title}
        </AppText>
        <AppText style={styles.body} numberOfLines={tall ? 4 : 3}>
          {module.body}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    minHeight: 200,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
    marginRight: spacing.md,
  },
  cardTall: {
    minHeight: 200,
  },
  pressed: {
    opacity: 0.92,
  },
  gradientLayer: {
    ...StyleSheet.absoluteFill,
    opacity: 0.55,
  },
  inner: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: palette.accent,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 21,
    color: palette.text,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.textSecondary,
  },
});
