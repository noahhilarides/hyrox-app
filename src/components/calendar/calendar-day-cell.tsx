import { format, isSameDay } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, workoutColors } from '@/constants/tokens';
import type { Workout } from '@/types';

interface CalendarDayCellProps {
  day: Date;
  selectedDate: string;
  workout?: Workout;
  showWeekday?: boolean;
  dimmed?: boolean;
  onPress: (dateStr: string) => void;
}

export function CalendarDayCell({
  day,
  selectedDate,
  workout,
  showWeekday,
  dimmed,
  onPress,
}: CalendarDayCellProps) {
  const dateStr = format(day, 'yyyy-MM-dd');
  const selected = dateStr === selectedDate;
  const isToday = isSameDay(day, new Date());
  const dotColor = workout ? workoutColors[workout.type] : undefined;

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress(dateStr);
      }}
      style={styles.cell}>
      {showWeekday ? (
        <AppText style={[styles.weekday, selected && styles.weekdayOn]}>
          {format(day, 'EEE')}
        </AppText>
      ) : null}
      <View style={[styles.circle, selected && styles.circleSelected]}>
        <AppText
          style={[
            styles.dayNum,
            dimmed && styles.dayDimmed,
            isToday && !selected && !dimmed && styles.dayToday,
            selected && styles.dayNumSelected,
          ]}>
          {format(day, 'd')}
        </AppText>
      </View>
      <View style={styles.dotSlot}>
        {dotColor && !dimmed ? (
          <View
            style={[
              styles.dot,
              { backgroundColor: dotColor },
              workout?.completed && styles.dotDone,
            ]}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    gap: 3,
    paddingVertical: 1,
  },
  weekday: {
    fontSize: 10,
    fontWeight: '600',
    color: palette.textSecondary,
    opacity: 0.55,
    letterSpacing: -0.2,
  },
  weekdayOn: {
    opacity: 0.85,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleSelected: {
    backgroundColor: '#F0F0F2',
  },
  dayNum: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  dayToday: {
    color: palette.text,
  },
  dayDimmed: {
    opacity: 0.28,
  },
  dayNumSelected: {
    color: '#0A0A0A',
    fontWeight: '700',
  },
  dotSlot: {
    height: 4,
    justifyContent: 'center',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  dotDone: {
    opacity: 0.3,
  },
});
