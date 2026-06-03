import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';
import type { Exercise } from '@/types';

interface WorkoutExerciseListProps {
  exercises: Exercise[];
}

export function WorkoutExerciseList({ exercises }: WorkoutExerciseListProps) {
  return (
    <View style={styles.wrap}>
      <AppText style={styles.sectionLabel}>Session</AppText>
      <View style={styles.list}>
        {exercises.map((ex, i) => {
          const hasTitle = ex.name.trim().length > 0;
          return (
            <View key={`${ex.name}-${ex.detail}-${i}`} style={styles.row}>
              <View style={styles.index}>
                <AppText style={styles.indexText}>{i + 1}</AppText>
              </View>
              <View style={styles.body}>
                {hasTitle ? (
                  <>
                    <AppText style={styles.stepTitle}>{ex.name}</AppText>
                    <AppText style={styles.stepDetail}>{ex.detail}</AppText>
                  </>
                ) : (
                  <AppText style={styles.stepLine}>{ex.detail}</AppText>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xxl,
    paddingTop: spacing.lg,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: palette.textSecondary,
    opacity: 0.7,
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.lg + 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  index: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: palette.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    marginTop: 1,
  },
  indexText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.accent,
    letterSpacing: 0.2,
  },
  body: {
    flex: 1,
    gap: 5,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 22,
    color: palette.text,
  },
  stepDetail: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    color: palette.textSecondary,
    opacity: 0.88,
  },
  stepLine: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 22,
    color: palette.text,
  },
});
