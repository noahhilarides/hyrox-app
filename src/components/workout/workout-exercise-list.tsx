import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, spacing } from '@/constants/tokens';
import type { Exercise } from '@/types';

interface WorkoutExerciseListProps {
  exercises: Exercise[];
}

interface Section {
  title: string;
  note?: string;
  movements: string[];
}

/** Groups the flat exercise list into sections by header rows (non-empty name). */
function groupIntoSections(exercises: Exercise[]): Section[] {
  const sections: Section[] = [];
  for (const ex of exercises) {
    const isHeader = ex.name.trim().length > 0;
    if (isHeader) {
      sections.push({
        title: ex.name.trim(),
        note: ex.detail.trim() ? ex.detail.trim() : undefined,
        movements: [],
      });
    } else if (ex.detail.trim()) {
      if (sections.length === 0) {
        sections.push({ title: 'Session', movements: [] });
      }
      sections[sections.length - 1]!.movements.push(ex.detail.trim());
    }
  }
  return sections;
}

export function WorkoutExerciseList({ exercises }: WorkoutExerciseListProps) {
  const sections = groupIntoSections(exercises);

  return (
    <View style={styles.wrap}>
      {sections.map((section, si) => (
        <View key={`${section.title}-${si}`} style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <AppText style={styles.sectionTitle}>{section.title}</AppText>
            {section.note ? (
              <AppText style={styles.sectionNote}>{section.note}</AppText>
            ) : null}
          </View>
          <View style={styles.movementList}>
            {section.movements.map((m, mi) => (
              <View key={`${m}-${mi}`} style={styles.movementRow}>
                <View style={styles.index}>
                  <AppText style={styles.indexText}>{mi + 1}</AppText>
                </View>
                <AppText style={styles.movementText}>{m}</AppText>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeaderRow: {
    gap: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: palette.accent,
  },
  sectionNote: {
    fontSize: 13,
    fontWeight: '400',
    color: palette.textSecondary,
    opacity: 0.8,
  },
  movementList: {
    gap: spacing.md,
    paddingLeft: spacing.xs,
  },
  movementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  index: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: palette.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    marginTop: 1,
  },
  indexText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.accent,
  },
  movementText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    color: palette.text,
  },
});
