import { format, parseISO } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { WorkoutCoachNoteCard } from '@/components/workout/workout-coach-note-card';
import { WorkoutExerciseList } from '@/components/workout/workout-exercise-list';
import { WorkoutFocusChips } from '@/components/workout/workout-focus-chips';
import { WorkoutIntensityIndicator } from '@/components/workout/workout-intensity-indicator';
import { WorkoutTypeBadge } from '@/components/workout-type-badge';
import { palette, spacing, typography } from '@/constants/tokens';
import { useApp } from '@/context/app-context';
import { getWorkoutIntensityDisplay } from '@/lib/workout-display';

export default function WorkoutDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getWorkoutForDate, completeWorkout, markWorkoutMissed } = useApp();

  const workout = date ? getWorkoutForDate(date) : undefined;

  if (!workout) {
    return (
      <Screen>
        <AppText variant="headline">No workout found</AppText>
        <Button label="Back to plan" onPress={() => router.back()} variant="secondary" />
      </Screen>
    );
  }

  const intensity = getWorkoutIntensityDisplay(workout);

  const handleComplete = async () => {
    await completeWorkout(workout.date);
    router.back();
  };

  const handleMissed = async () => {
    await markWorkoutMissed(workout.date);
    router.back();
  };

  return (
    <Screen padded={false} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.pad}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
            <AppText style={styles.backLabel}>← Plan</AppText>
          </Pressable>

          <AppText style={styles.date}>
            {format(parseISO(workout.date), 'EEEE, MMMM d')}
          </AppText>

          <View style={styles.headerMeta}>
            <WorkoutTypeBadge type={workout.type} compact />
            <WorkoutIntensityIndicator
              label={intensity.label}
              tone={intensity.tone}
              color={intensity.color}
              inline
            />
          </View>

          <AppText style={styles.title}>{workout.title}</AppText>

          <AppText style={styles.subtitle}>
            {workout.subtitle} · {workout.durationMinutes} min
          </AppText>

          <WorkoutFocusChips tags={workout.focus} />

          <View style={styles.sectionSpacer} />

          <WorkoutCoachNoteCard note={workout.coachNote} />

          <View style={styles.sectionFade} />

          <WorkoutExerciseList exercises={workout.exercises} />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.lg) },
        ]}>
        <View style={styles.footerFade} pointerEvents="none" />
        {!workout.completed ? (
          <>
            <Button
              label="Mark complete"
              onPress={handleComplete}
              size="md"
              style={styles.completeBtn}
            />
            <Button
              label="I missed this session"
              variant="ghost"
              size="md"
              onPress={handleMissed}
            />
          </>
        ) : (
          <View style={styles.completedBanner}>
            <AppText style={styles.completedText}>✓ Completed — nice work</AppText>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 180,
  },
  pad: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  backLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.textSecondary,
    letterSpacing: 0.2,
  },
  date: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: palette.textSecondary,
    opacity: 0.75,
    marginBottom: spacing.md,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.hero,
    fontSize: 32,
    lineHeight: 38,
    color: palette.text,
    letterSpacing: -0.8,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: palette.textSecondary,
    opacity: 0.72,
    maxWidth: '95%',
  },
  sectionSpacer: {
    height: spacing.md,
  },
  sectionFade: {
    height: spacing.xl,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + spacing.sm,
    gap: spacing.sm,
    backgroundColor: palette.bg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  footerFade: {
    position: 'absolute',
    top: -24,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: palette.bg,
    opacity: 0.5,
  },
  completeBtn: {
    minHeight: 48,
    borderRadius: 14,
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  completedBanner: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: palette.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.accentBorderSubtle,
  },
  completedText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.accent,
  },
});
