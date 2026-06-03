import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, spacing } from '@/constants/tokens';
import type { RaceCountdown } from '@/lib/plan-personalization';

interface RaceCountdownBannerProps {
  countdown: RaceCountdown;
}

export function RaceCountdownBanner({ countdown }: RaceCountdownBannerProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.glow, countdown.urgent && styles.glowUrgent]} pointerEvents="none" />
      <View style={[styles.banner, countdown.urgent && styles.bannerUrgent]}>
        <View style={[styles.iconWrap, countdown.urgent && styles.iconWrapUrgent]}>
          <Ionicons
            name="flag"
            size={14}
            color={countdown.urgent ? palette.bg : palette.accent}
          />
        </View>
        <View style={styles.copy}>
          <AppText style={[styles.label, countdown.urgent && styles.labelUrgent]}>
            {countdown.label}
          </AppText>
          {countdown.days > 0 ? (
            <AppText style={[styles.sub, countdown.urgent && styles.subUrgent]}>
              {countdown.days} days until start line
            </AppText>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const CARD_RADIUS = 22;

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.xl,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: 6,
    left: 16,
    right: 16,
    bottom: -4,
    borderRadius: CARD_RADIUS,
    backgroundColor: 'rgba(244, 229, 0, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: palette.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {},
    }),
  },
  glowUrgent: {
    backgroundColor: 'rgba(244, 229, 0, 0.25)',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg + 4,
    borderRadius: CARD_RADIUS,
    backgroundColor: palette.bgCard,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  bannerUrgent: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(244, 229, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapUrgent: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: palette.text,
  },
  labelUrgent: {
    color: palette.bg,
    fontWeight: '700',
  },
  sub: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.textSecondary,
    opacity: 0.85,
  },
  subUrgent: {
    color: 'rgba(10, 10, 12, 0.65)',
    opacity: 1,
  },
});
