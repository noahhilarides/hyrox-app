import { format, parseISO } from 'date-fns';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';
import type { RaceCountdown } from '@/lib/plan-personalization';

interface TodayCountdownTileProps {
  countdown: RaceCountdown;
  imageUrl: string | null;
  raceName?: string | null;
  raceDate?: string | null;
}

function formatRaceDate(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  try {
    return format(parseISO(iso), 'MMMM d, yyyy');
  } catch {
    return undefined;
  }
}

export function TodayCountdownTile({
  countdown,
  imageUrl,
  raceName,
  raceDate,
}: TodayCountdownTileProps) {
  const router = useRouter();
  const dateLabel = formatRaceDate(raceDate);
  const dayWord = countdown.days === 1 ? 'day' : 'days';

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        router.push('/profile');
      }}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.backgroundImage}
          contentFit="cover"
          transition={300}
        />
      ) : null}

      <View style={styles.overlayFade1} pointerEvents="none" />
      <View style={styles.overlayFade2} pointerEvents="none" />
      <View style={styles.overlayFade3} pointerEvents="none" />
      <View style={styles.overlayFade4} pointerEvents="none" />

      <View style={styles.content}>
        <View style={styles.countdownRow}>
          <AppText style={styles.countNumber}>{countdown.days}</AppText>
          <AppText style={styles.countLabel}>{dayWord}</AppText>
        </View>
        {raceName ? (
          <AppText style={styles.raceName} numberOfLines={2}>
            {raceName}
          </AppText>
        ) : null}
        {dateLabel ? (
          <AppText style={styles.raceDate} numberOfLines={1}>
            {dateLabel}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

const TEXT_SHADOW = {
  textShadowColor: 'rgba(0,0,0,0.85)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 4,
} as const;

const styles = StyleSheet.create({
  card: {
    width: 200,
    height: 200,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.bgCard,
    marginRight: spacing.md,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
  },
  overlayFade1: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  overlayFade2: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    height: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  overlayFade3: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 38,
    height: 16,
    backgroundColor: 'rgba(0,0,0,0.24)',
  },
  overlayFade4: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 54,
    height: 14,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    padding: spacing.md,
    gap: 2,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  countNumber: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1.5,
    lineHeight: 46,
    color: palette.text,
    ...TEXT_SHADOW,
  },
  countLabel: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
    color: palette.text,
    opacity: 0.95,
    paddingBottom: 4,
    ...TEXT_SHADOW,
  },
  raceName: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 20,
    color: palette.text,
    ...TEXT_SHADOW,
  },
  raceDate: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: palette.textSecondary,
    ...TEXT_SHADOW,
  },
});
