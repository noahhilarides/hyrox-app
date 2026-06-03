import { CalendarSheet } from '@/components/calendar/calendar-sheet';
import type { TrainingPlan } from '@/types';

interface TodayCalendarPanelProps {
  plan: TrainingPlan;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export function TodayCalendarPanel({
  plan,
  selectedDate,
  onSelectDate,
  expanded,
  onExpandedChange,
}: TodayCalendarPanelProps) {
  if (plan.workouts.length === 0) return null;

  return (
    <CalendarSheet
      selectedDate={selectedDate}
      workouts={plan.workouts}
      expanded={expanded}
      onSelectDate={onSelectDate}
      onExpandedChange={onExpandedChange}
    />
  );
}
