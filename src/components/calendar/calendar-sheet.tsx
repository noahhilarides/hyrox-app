import { addMonths, parseISO, startOfMonth } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { buildMonthGridDays, buildWorkoutMap } from '@/components/calendar/calendar-utils';
import { DRAG_HANDLE_HEIGHT, DragHandle } from '@/components/calendar/drag-handle';
import { estimateMonthGridHeight, MonthGrid } from '@/components/calendar/month-grid';
import { WeekStrip } from '@/components/calendar/week-strip';
import { palette, radius, spacing } from '@/constants/tokens';
import type { Workout } from '@/types';

const SNAP_SPRING = { damping: 28, stiffness: 185, mass: 0.9 };
const FALLBACK_WEEK_HEIGHT = 56;

interface CalendarSheetProps {
  selectedDate: string;
  workouts: Workout[];
  expanded: boolean;
  onSelectDate: (date: string) => void;
  onExpandedChange: (expanded: boolean) => void;
}

export function CalendarSheet({
  selectedDate,
  workouts,
  expanded,
  onSelectDate,
  onExpandedChange,
}: CalendarSheetProps) {
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(parseISO(selectedDate))
  );

  const expandProgress = useSharedValue(expanded ? 1 : 0);
  const dragStartProgress = useSharedValue(0);
  const weekBodyHeight = useSharedValue(FALLBACK_WEEK_HEIGHT);
  const gridBodyHeight = useSharedValue(300);

  const workoutByDate = useMemo(() => buildWorkoutMap(workouts), [workouts]);

  const monthDays = useMemo(
    () => buildMonthGridDays(visibleMonth),
    [visibleMonth]
  );

  const estimatedGridHeight = useMemo(
    () => estimateMonthGridHeight(Math.ceil(monthDays.length / 7)),
    [monthDays.length]
  );

  useEffect(() => {
    gridBodyHeight.value = estimatedGridHeight;
  }, [estimatedGridHeight, gridBodyHeight]);

  const commitExpanded = useCallback(
    (open: boolean) => onExpandedChange(open),
    [onExpandedChange]
  );

  useEffect(() => {
    setVisibleMonth(startOfMonth(parseISO(selectedDate)));
  }, [selectedDate]);

  useEffect(() => {
    expandProgress.value = withSpring(expanded ? 1 : 0, SNAP_SPRING);
  }, [expanded, expandProgress]);

  const onWeekLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      if (h > 0) weekBodyHeight.value = h;
    },
    [weekBodyHeight]
  );

  const onGridLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      if (h >= estimatedGridHeight * 0.85) {
        gridBodyHeight.value = h;
      }
    },
    [gridBodyHeight, estimatedGridHeight]
  );

  const shiftMonth = useCallback((delta: number) => {
    Haptics.selectionAsync();
    setVisibleMonth((m) => startOfMonth(addMonths(m, delta)));
  }, []);

  const panGesture = Gesture.Pan()
    .activeOffsetY([-6, 6])
    .onBegin(() => {
      dragStartProgress.value = expandProgress.value;
    })
    .onUpdate((e) => {
      const range = weekBodyHeight.value + gridBodyHeight.value;
      expandProgress.value = Math.min(
        1,
        Math.max(0, dragStartProgress.value + e.translationY / range)
      );
    })
    .onEnd((e) => {
      const shouldExpand = e.translationY > 24 || e.velocityY > 220;
      const shouldCollapse = e.translationY < -24 || e.velocityY < -220;
      let next = expandProgress.value > 0.5 ? 1 : 0;
      if (shouldExpand) next = 1;
      if (shouldCollapse) next = 0;

      expandProgress.value = withSpring(next, SNAP_SPRING);
      runOnJS(commitExpanded)(next === 1);
    });

  const weekSlotStyle = useAnimatedStyle(() => {
    const p = expandProgress.value;
    const weekH =
      weekBodyHeight.value > 0 ? weekBodyHeight.value : FALLBACK_WEEK_HEIGHT;
    return {
      opacity: interpolate(p, [0, 1], [1, 0], Extrapolation.CLAMP),
      height: interpolate(p, [0, 1], [weekH, 0], Extrapolation.CLAMP),
      overflow: 'hidden' as const,
    };
  });

  const gridSlotStyle = useAnimatedStyle(() => {
    const p = expandProgress.value;
    return {
      height: interpolate(
        p,
        [0, 1],
        [0, gridBodyHeight.value],
        Extrapolation.CLAMP
      ),
      opacity: interpolate(p, [0, 1], [0, 1], Extrapolation.CLAMP),
      overflow: 'hidden' as const,
    };
  });

  return (
    <View style={styles.sheet}>
      <Animated.View
        style={weekSlotStyle}
        pointerEvents={expanded ? 'none' : 'auto'}>
        <View style={styles.weekInner} onLayout={onWeekLayout}>
          <WeekStrip
            selectedDate={selectedDate}
            workoutByDate={workoutByDate}
            onSelectDate={onSelectDate}
          />
        </View>
      </Animated.View>

      <Animated.View
        style={gridSlotStyle}
        pointerEvents={expanded ? 'auto' : 'box-none'}>
        <View onLayout={onGridLayout}>
          <MonthGrid
            days={monthDays}
            visibleMonth={visibleMonth}
            selectedDate={selectedDate}
            workoutByDate={workoutByDate}
            onSelectDate={onSelectDate}
            onShiftMonth={shiftMonth}
            expanded
          />
        </View>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <View style={styles.handleHit}>
          <DragHandle />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: '#121214',
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  weekInner: {
    minHeight: FALLBACK_WEEK_HEIGHT,
    paddingHorizontal: spacing.xs,
  },
  handleHit: {
    minHeight: DRAG_HANDLE_HEIGHT,
  },
});
