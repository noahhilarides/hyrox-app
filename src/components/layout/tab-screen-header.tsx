import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ProfileAvatarButton } from '@/components/layout/profile-avatar-button';
import { spacing } from '@/constants/tokens';

interface TabScreenHeaderProps {
  center?: ReactNode;
  right?: ReactNode;
}

/** Shared top row: profile avatar (left) + optional center/right slots. */
export function TabScreenHeader({ center, right }: TabScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <ProfileAvatarButton />
      <View style={styles.center}>{center}</View>
      <View style={styles.right}>{right ?? <View style={styles.rightPlaceholder} />}</View>
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
    justifyContent: 'center',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightPlaceholder: {
    width: 40,
    height: 40,
  },
});
