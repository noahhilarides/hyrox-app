import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { TodaySectionHeader } from '@/components/today/today-section-header';
import { AppText } from '@/components/ui/text';
import { WORKOUT_TYPE_CARDS } from '@/data/today/feed-modules';
import { palette, radius, spacing } from '@/constants/tokens';

interface TodayWorkoutTypeGridProps {
  onPressCard: () => void;
}

export function TodayWorkoutTypeGrid({ onPressCard }: TodayWorkoutTypeGridProps) {
  return (
    <View style={styles.section}>
      <TodaySectionHeader title="Add a session" right="Browse plan" />
      <View style={styles.grid}>
        {WORKOUT_TYPE_CARDS.map((card) => (
          <Pressable
            key={card.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onPressCard();
            }}
            style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}>
            <View style={[styles.tileBg, { backgroundColor: card.gradient[0] }]} />
            <View style={[styles.tileGradient, { backgroundColor: card.gradient[1] }]} />
            <AppText style={styles.tileLabel}>{card.label}</AppText>
            <AppText style={styles.tileSub}>{card.subtitle}</AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  tile: {
    flexGrow: 1,
    flexBasis: '47%',
    maxWidth: '48%',
    minHeight: 72,
    borderRadius: radius.lg,
    padding: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
    justifyContent: 'flex-end',
  },
  tilePressed: {
    opacity: 0.9,
  },
  tileBg: {
    ...StyleSheet.absoluteFill,
  },
  tileGradient: {
    ...StyleSheet.absoluteFill,
    opacity: 0.5,
  },
  tileLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
    letterSpacing: -0.2,
  },
  tileSub: {
    fontSize: 11,
    fontWeight: '500',
    color: palette.textSecondary,
    marginTop: 2,
  },
});
