import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette } from '@/constants/tokens';
import { useApp } from '@/context/app-context';
import { getProfileInitials } from '@/lib/profile-display';

interface ProfileAvatarButtonProps {
  size?: number;
}

export function ProfileAvatarButton({ size = 40 }: ProfileAvatarButtonProps) {
  const router = useRouter();
  const { profile } = useApp();
  const initials = getProfileInitials(profile?.raceCity, profile?.raceName);
  const radius = size / 2;

  return (
    <Pressable
      onPress={() => router.push('/profile')}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: radius },
      ]}
      accessibilityLabel="Profile and settings"
      accessibilityRole="button">
      <AppText style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: palette.bgCard,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
    color: palette.accent,
    letterSpacing: 0.5,
  },
});
