import { addDays, format, parseISO, startOfWeek } from 'date-fns';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { CalendarDayCell } from '@/components/calendar/calendar-day-cell';
import { CALENDAR_WEEK_STARTS_ON } from '@/components/calendar/calendar-utils';
import { spacing } from '@/constants/tokens';
import type { Workout } from '@/types';

interface WeekStripProps {
  selectedDate: string;
  workoutByDate: Map<string, Workout>;
  onSelectDate: (dateStr: string) => void;
}

/** Sun–Sat for the week containing the selected date. */
export function WeekStrip({ selectedDate, workoutByDate, onSelectDate }: WeekStripProps) {
  const days = useMemo(() => {
    const anchor = parseISO(selectedDate);
    const weekStart = startOfWeek(anchor, { weekStartsOn: CALENDAR_WEEK_STARTS_ON });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [selectedDate]);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          return (
            <View key={dateStr} style={styles.dayCell}>
              <CalendarDayCell
                day={day}
                selectedDate={selectedDate}
                workout={workoutByDate.get(dateStr)}
                showWeekday
                onPress={onSelectDate}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 6,
    paddingBottom: 4,
    paddingHorizontal: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    overflow: 'visible',
  },
});
