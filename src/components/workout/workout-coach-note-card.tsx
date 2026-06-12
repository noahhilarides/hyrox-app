import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';

interface WorkoutCoachNoteCardProps {
  note: string;
}

export function WorkoutCoachNoteCard({ note }: WorkoutCoachNoteCardProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <AppText style={styles.eyebrow}>Coach note</AppText>
        <AppText style={styles.body}>{note}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 0,
    position: 'relative',
  },
  card: {
    backgroundColor: palette.bgCard,
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
