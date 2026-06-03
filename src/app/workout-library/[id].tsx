import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { WorkoutExerciseList } from '@/components/workout/workout-exercise-list';
import { WorkoutFocusChips } from '@/components/workout/workout-focus-chips';
import { WorkoutTypeBadge } from '@/components/workout-type-badge';
import { palette, radius, spacing } from '@/constants/tokens';
import { getTemplateById } from '@/data/workout-library';
import { formatLibraryCategory } from '@/lib/workout-library-display';

export default function WorkoutLibraryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const template = id ? getTemplateById(id) : undefined;

  if (!template) {
    return (
      <Screen>
        <AppText variant="headline">Template not found</AppText>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <AppText style={styles.backLink}>← Library</AppText>
        </Pressable>
      </Screen>
    );
  }

  const exercises = template.workoutBlocks.map((b) => ({
    name: b.name,
    detail: b.detail,
  }));

  return (
    <Screen padded={false} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pad}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <AppText style={styles.backLink}>← Library</AppText>
          </Pressable>

          <View style={styles.badgeRow}>
            <WorkoutTypeBadge type={template.workoutType} />
            <View style={styles.catPill}>
              <AppText style={styles.catText}>{formatLibraryCategory(template.category)}</AppText>
            </View>
          </View>

          <AppText variant="title" style={styles.name}>
            {template.name}
          </AppText>
          <AppText style={styles.id}>{template.id}</AppText>
          <AppText variant="body" muted style={styles.description}>
            {template.description}
          </AppText>

          <View style={styles.metaGrid}>
            <MetaCell label="Difficulty" value={template.difficulty} />
            <MetaCell label="Duration" value={`${template.duration} min`} />
            <MetaCell label="Variant" value={template.variant ?? '—'} />
            <MetaCell label="Blocks" value={`${template.workoutBlocks.length}`} />
          </View>

          {template.focus.length > 0 ? (
            <View style={styles.focusWrap}>
              <WorkoutFocusChips tags={template.focus} />
            </View>
          ) : null}

          {template.equipment.length > 0 ? (
            <View style={styles.equipment}>
              <AppText style={styles.equipmentLabel}>Equipment</AppText>
              <AppText style={styles.equipmentValue}>{template.equipment.join(' · ')}</AppText>
            </View>
          ) : null}

          <CoachingSection title="Progression" body={template.progressionNotes} />
          {template.rpeGuidance ? (
            <CoachingSection title="RPE guide" body={template.rpeGuidance} />
          ) : null}
          {template.coachingCues.length > 0 ? (
            <CoachingSection
              title="Station cues"
              body={template.coachingCues.map((c) => `• ${c}`).join('\n')}
            />
          ) : null}
          <CoachingSection title="Substitutions" body={template.substitutionGuidance} />

          <WorkoutExerciseList exercises={exercises} />
        </View>
      </ScrollView>
    </Screen>
  );
}

function CoachingSection({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.coachingSection}>
      <AppText style={styles.coachingTitle}>{title}</AppText>
      <AppText style={styles.coachingBody}>{body}</AppText>
    </View>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaCell}>
      <AppText style={styles.metaLabel}>{label}</AppText>
      <AppText style={styles.metaValue}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xxxl,
  },
  pad: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backBtn: {
    marginTop: spacing.md,
  },
  backLink: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.accent,
    marginBottom: spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  catPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: palette.bgElevated,
    borderWidth: 1,
    borderColor: palette.border,
  },
  catText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  name: {
    marginBottom: spacing.xs,
  },
  id: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: palette.textMuted,
    marginBottom: spacing.sm,
  },
  description: {
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metaCell: {
    minWidth: '45%',
    flexGrow: 1,
    backgroundColor: palette.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: palette.textMuted,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.text,
    textTransform: 'capitalize',
  },
  focusWrap: {
    marginBottom: spacing.md,
  },
  equipment: {
    marginBottom: spacing.md,
  },
  equipmentLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: palette.textSecondary,
    marginBottom: spacing.xs,
  },
  equipmentValue: {
    fontSize: 14,
    color: palette.textSecondary,
    lineHeight: 20,
  },
  coachingSection: {
    marginBottom: spacing.md,
    backgroundColor: palette.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
  },
  coachingTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: palette.textSecondary,
    marginBottom: spacing.xs,
  },
  coachingBody: {
    fontSize: 14,
    color: palette.text,
    lineHeight: 21,
  },
});
