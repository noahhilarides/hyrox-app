import { Platform, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';

interface WorkoutCoachNoteCardProps {
  note: string;
}

export function WorkoutCoachNoteCard({ note }: WorkoutCoachNoteCardProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.glow} pointerEvents="none" />
      <View style={styles.card}>
        <AppText style={styles.eyebrow}>Coach note</AppText>
        <AppText style={styles.body}>{note}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xl,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: 8,
    left: 12,
    right: 12,
    height: '70%',
    borderRadius: radius.lg,
    backgroundColor: 'rgba(244, 229, 0, 0.14)',
    opacity: 0.6,
    ...Platform.select({
      ios: {
        shadowColor: palette.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {},
    }),
  },
  card: {
    backgroundColor: 'rgba(244, 229, 0, 0.14)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.accentBorderSubtle,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: 'rgba(244, 229, 0, 0.75)',
    marginBottom: spacing.sm + 2,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '500',
    color: palette.text,
  },
});
