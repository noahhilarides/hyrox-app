import { addMonths, format, isSameMonth, startOfMonth } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { CalendarDayCell } from '@/components/calendar/calendar-day-cell';
import {
  buildMonthGridDays,
  CALENDAR_WEEKDAY_LABELS,
} from '@/components/calendar/calendar-utils';
import { AppText } from '@/components/ui/text';
import { palette, spacing } from '@/constants/tokens';
import type { Workout } from '@/types';

const ROW_HEIGHT = 44;
const MONTH_SPRING = { damping: 26, stiffness: 400, mass: 0.6 };
const DRAG_SNAP_SPRING = { damping: 24, stiffness: 340, mass: 0.65 };

interface MonthGridProps {
  days: Date[];
  visibleMonth: Date;
  selectedDate: string;
  workoutByDate: Map<string, Workout>;
  onSelectDate: (dateStr: string) => void;
  onShiftMonth: (delta: number) => void;
  expanded?: boolean;
}

function chunkWeeks(dayList: Date[]): Date[][] {
  const weeks: Date[][] = [];
  for (let i = 0; i < dayList.length; i += 7) {
    weeks.push(dayList.slice(i, i + 7));
  }
  return weeks;
}

interface MonthPageProps {
  month: Date;
  days: Date[];
  pageWidth: number;
  selectedDate: string;
  workoutByDate: Map<string, Workout>;
  onSelectDate: (dateStr: string) => void;
  onShiftMonth: (delta: number) => void;
  isNeighbor?: boolean;
}

function MonthPage({
  month,
  days,
  pageWidth,
  selectedDate,
  workoutByDate,
  onSelectDate,
  onShiftMonth,
  isNeighbor,
}: MonthPageProps) {
  const weeks = useMemo(() => chunkWeeks(days), [days]);

  return (
    <View style={[styles.page, { width: pageWidth }, isNeighbor && styles.pageNeighbor]}>
      <View style={styles.cornerHeader}>
        <AppText style={styles.monthCorner}>{format(month, 'MMMM yyyy')}</AppText>
      </View>

      <View style={styles.weekdayRow}>
        {CALENDAR_WEEKDAY_LABELS.map((label, i) => (
          <View key={`${label}-${i}`} style={styles.weekdayCell}>
            <AppText style={styles.weekdayText}>{label}</AppText>
          </View>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} style={styles.weekRow}>
          {week.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const inMonth = isSameMonth(day, month);
            return (
              <View key={dateStr} style={styles.dayCell}>
                <CalendarDayCell
                  day={day}
                  selectedDate={selectedDate}
                  workout={workoutByDate.get(dateStr)}
                  dimmed={!inMonth}
                  onPress={(d) => {
                    onSelectDate(d);
                    if (!inMonth) {
                      Haptics.selectionAsync();
                      onShiftMonth(startOfMonth(day) < month ? -1 : 1);
                    }
                  }}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export function MonthGrid({
  days,
  visibleMonth,
  selectedDate,
  workoutByDate,
  onSelectDate,
  onShiftMonth,
  expanded,
}: MonthGridProps) {
  const [pageWidth, setPageWidth] = useState(0);
  const stripX = useSharedValue(0);
  const pageWidthShared = useSharedValue(0);

  const monthAnchor = useMemo(() => startOfMonth(visibleMonth), [visibleMonth]);
  const prevMonth = useMemo(() => addMonths(monthAnchor, -1), [monthAnchor]);
  const nextMonth = useMemo(() => addMonths(monthAnchor, 1), [monthAnchor]);

  const prevDays = useMemo(() => buildMonthGridDays(prevMonth), [prevMonth]);
  const nextDays = useMemo(() => buildMonthGridDays(nextMonth), [nextMonth]);

  const onContainerLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width - spacing.sm * 2;
      if (w > 0 && w !== pageWidth) {
        setPageWidth(w);
        pageWidthShared.value = w;
        stripX.value = -w;
      }
    },
    [pageWidth, pageWidthShared, stripX]
  );

  const shiftMonthWithSnap = useCallback(
    (delta: number) => {
      onShiftMonth(delta);
    },
    [onShiftMonth]
  );

  const monthNavigation = useMemo(() => {
    const settleStrip = (delta: number) => {
      'worklet';
      const w = pageWidthShared.value;
      if (w <= 0) return;
      if (delta > 0) {
        stripX.value = stripX.value + w;
      } else if (delta < 0) {
        stripX.value = stripX.value - w;
      }
      stripX.value = withSpring(-w, MONTH_SPRING);
    };

    const panSwipe = Gesture.Pan()
      .enabled(!!expanded)
      .activeOffsetX([-10, 10])
      .failOffsetY([-22, 22])
      .onUpdate((e) => {
        const w = pageWidthShared.value;
        if (w <= 0) return;
        stripX.value = -w + e.translationX;
      })
      .onEnd((e) => {
        const w = pageWidthShared.value;
        if (w <= 0) return;

        const threshold = w * 0.2;
        const goPrev = e.translationX > threshold || e.velocityX > 260;
        const goNext = e.translationX < -threshold || e.velocityX < -260;

        if (goNext) {
          runOnJS(shiftMonthWithSnap)(1);
          settleStrip(1);
          return;
        }
        if (goPrev) {
          runOnJS(shiftMonthWithSnap)(-1);
          settleStrip(-1);
          return;
        }

        stripX.value = withSpring(-w, DRAG_SNAP_SPRING);
      });

    const flingPrev = Gesture.Fling()
      .enabled(!!expanded)
      .direction(Directions.RIGHT)
      .onEnd(() => {
        runOnJS(shiftMonthWithSnap)(-1);
        settleStrip(-1);
      });

    const flingNext = Gesture.Fling()
      .enabled(!!expanded)
      .direction(Directions.LEFT)
      .onEnd(() => {
        runOnJS(shiftMonthWithSnap)(1);
        settleStrip(1);
      });

    return Gesture.Exclusive(panSwipe, flingPrev, flingNext);
  }, [expanded, shiftMonthWithSnap, pageWidthShared, stripX]);

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: stripX.value }],
  }));

  return (
    <GestureDetector gesture={monthNavigation}>
      <View
        style={[styles.body, expanded && styles.bodyExpanded]}
        onLayout={onContainerLayout}>
        {pageWidth > 0 ? (
          <View style={styles.viewport}>
            <Animated.View style={[styles.strip, stripStyle]}>
              <MonthPage
                month={prevMonth}
                days={prevDays}
                pageWidth={pageWidth}
                selectedDate={selectedDate}
                workoutByDate={workoutByDate}
                onSelectDate={onSelectDate}
                onShiftMonth={onShiftMonth}
                isNeighbor
              />
              <MonthPage
                month={monthAnchor}
                days={days}
                pageWidth={pageWidth}
                selectedDate={selectedDate}
                workoutByDate={workoutByDate}
                onSelectDate={onSelectDate}
                onShiftMonth={onShiftMonth}
              />
              <MonthPage
                month={nextMonth}
                days={nextDays}
                pageWidth={pageWidth}
                selectedDate={selectedDate}
                workoutByDate={workoutByDate}
                onSelectDate={onSelectDate}
                onShiftMonth={onShiftMonth}
                isNeighbor
              />
            </Animated.View>
          </View>
        ) : null}
      </View>
    </GestureDetector>
  );
}

/** Predictable height for the expand clip (header + weekdays + rows). */
export function estimateMonthGridHeight(weekRowCount: number): number {
  return 28 + 28 + weekRowCount * ROW_HEIGHT + spacing.sm;
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.sm,
    paddingTop: 2,
    paddingBottom: spacing.sm,
  },
  bodyExpanded: {
    paddingTop: spacing.sm,
  },
  viewport: {
    overflow: 'hidden',
    width: '100%',
  },
  strip: {
    flexDirection: 'row',
  },
  page: {
    flexShrink: 0,
  },
  pageNeighbor: {
    opacity: 0.88,
  },
  cornerHeader: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
    paddingLeft: 2,
  },
  monthCorner: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: palette.textSecondary,
    opacity: 0.85,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 9,
    fontWeight: '600',
    color: palette.textSecondary,
    opacity: 0.45,
    letterSpacing: -0.2,
  },
  weekRow: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    alignItems: 'center',
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
