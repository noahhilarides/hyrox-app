import { addDays, format, isSameDay, parseISO, startOfWeek } from 'date-fns';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { CALENDAR_WEEK_STARTS_ON } from '@/components/calendar/calendar-utils';
import { AppText } from '@/components/ui/text';
import { palette, radius, spacing, workoutColors } from '@/constants/tokens';
import type { Workout } from '@/types';

interface WeekCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  workouts: Workout[];
  compact?: boolean;
}

export function WeekCalendar({
  selectedDate,
  onSelectDate,
  workouts,
  compact,
}: WeekCalendarProps) {
  const anchor = parseISO(selectedDate);
  const weekStart = startOfWeek(anchor, { weekStartsOn: CALENDAR_WEEK_STARTS_ON });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const selected = isSameDay(day, anchor);
        const workout = workouts.find((w) => w.date === dateStr);
        const isRest = !workout;
        const dotColor = workout ? workoutColors[workout.type] : undefined;

        return (
          <Pressable
            key={dateStr}
            onPress={() => onSelectDate(dateStr)}
            style={[
              styles.day,
              compact && styles.dayCompact,
              selected && styles.daySelected,
              isRest && !selected && styles.dayRest,
            ]}>
            <AppText variant="caption" muted style={selected ? styles.labelSelected : undefined}>
              {format(day, 'EEE')}
            </AppText>
            <AppText variant="bodyMedium" style={selected ? styles.numSelected : undefined}>
              {format(day, 'd')}
            </AppText>
            <View style={styles.dotRow}>
              {dotColor ? (
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: dotColor },
                    workout?.completed && styles.dotDone,
                  ]}
                />
              ) : (
                <View style={styles.restDot} />
              )}
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  day: {
    width: 48,
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    backgroundColor: palette.bgElevated,
    marginRight: spacing.sm,
  },
  dayCompact: {
    width: 44,
    paddingVertical: spacing.sm,
  },
  daySelected: {
    backgroundColor: palette.accentDim,
    borderWidth: 1,
    borderColor: palette.accent,
  },
  dayRest: {
    opacity: 0.85,
  },
  labelSelected: {
    color: palette.accent,
  },
  numSelected: {
    fontWeight: '700',
  },
  dotRow: {
    height: 8,
    marginTop: 6,
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotDone: {
    opacity: 0.45,
  },
  restDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.border,
  },
});
