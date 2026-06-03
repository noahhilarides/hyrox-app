import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ProfileAvatarButton } from '@/components/layout/profile-avatar-button';
import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';

interface TodayTopHeaderProps {
  weekLabel: string;
  completedCount: number;
  plannedCount: number;
  onCalendarPress?: () => void;
}

export function TodayTopHeader({
  weekLabel,
  completedCount,
  plannedCount,
  onCalendarPress,
}: TodayTopHeaderProps) {
  const ratio = plannedCount > 0 ? completedCount / plannedCount : 0;

  return (
    <View style={styles.row}>
      <ProfileAvatarButton />

      <View style={styles.center}>
        <AppText style={styles.weekLabel}>{weekLabel}</AppText>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.min(100, ratio * 100)}%` }]} />
        </View>
        <AppText style={styles.progressMeta}>
          {completedCount}/{plannedCount} sessions
        </AppText>
      </View>

      <View style={styles.iconBtn} accessibilityElementsHidden={!onCalendarPress}>
        <Ionicons
          name="calendar-outline"
          size={22}
          color={onCalendarPress ? palette.text : palette.textSecondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  weekLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.text,
    letterSpacing: -0.2,
  },
  progressTrack: {
    width: '100%',
    maxWidth: 140,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.accent,
    borderRadius: 2,
  },
  progressMeta: {
    fontSize: 11,
    fontWeight: '500',
    color: palette.textSecondary,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: palette.bgCard,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
