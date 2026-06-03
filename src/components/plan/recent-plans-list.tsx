import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';
import { formatPlanHistoryDate } from '@/lib/plan-history';
import type { PlanHistoryEntry } from '@/types';

interface RecentPlansListProps {
  entries: PlanHistoryEntry[];
  onSelect: (entry: PlanHistoryEntry) => void;
  onRefresh?: () => void;
}

export function RecentPlansList({ entries, onSelect, onRefresh }: RecentPlansListProps) {
  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <AppText variant="body" muted style={styles.emptyText}>
          No recent plans yet. Quit or finish a block and it will show up here.
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {entries.map((entry) => (
        <Pressable
          key={entry.id}
          accessibilityRole="button"
          onPress={() => {
            Haptics.selectionAsync();
            onSelect(entry);
          }}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
          <View style={styles.copy}>
            <AppText variant="bodyMedium">{entry.title}</AppText>
            <AppText variant="caption" muted>
              {entry.weeksTotal} weeks · {entry.completedWorkouts} completed ·{' '}
              {formatPlanHistoryDate(entry.createdAt)}
            </AppText>
          </View>
          <AppText variant="body" muted style={styles.chevron}>
            ›
          </AppText>
        </Pressable>
      ))}
      {onRefresh ? (
        <Pressable onPress={onRefresh} style={styles.refresh}>
          <AppText variant="caption" muted>
            Refresh list
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    padding: spacing.md,
    gap: spacing.md,
  },
  rowPressed: {
    opacity: 0.9,
    borderColor: palette.accent,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '300',
  },
  empty: {
    padding: spacing.lg,
    backgroundColor: palette.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 22,
  },
  refresh: {
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
});
