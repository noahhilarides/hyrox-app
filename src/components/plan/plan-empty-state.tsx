import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { RecentPlansList } from '@/components/plan/recent-plans-list';
import { AppText } from '@/components/ui/text';
import { useApp } from '@/context/app-context';
import { palette, radius, spacing } from '@/constants/tokens';
import { getPlanHistory } from '@/lib/plan-history';
import type { PlanHistoryEntry } from '@/types';

export function PlanEmptyState() {
  const router = useRouter();
  const { restorePlanFromHistory } = useApp();
  const [showRecent, setShowRecent] = useState(false);
  const [history, setHistory] = useState<PlanHistoryEntry[]>([]);

  const loadHistory = useCallback(async () => {
    setHistory(await getPlanHistory());
  }, []);

  useEffect(() => {
    if (showRecent) loadHistory();
  }, [showRecent, loadHistory]);

  const handleGetStarted = () => {
    router.push('/(onboarding)/goal');
  };

  const handleRestore = async (entry: PlanHistoryEntry) => {
    await restorePlanFromHistory(entry);
    setShowRecent(false);
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        onPress={handleGetStarted}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        <AppText variant="headline" style={styles.cardTitle}>
          Get started
        </AppText>
        <AppText variant="body" muted style={styles.cardSub}>
          Build a personalized HYROX block from your goals and schedule.
        </AppText>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={() => setShowRecent((v) => !v)}
        style={styles.recentToggle}>
        <AppText variant="bodyMedium" accent>
          {showRecent ? 'Hide recent plans' : 'View recent plans'}
        </AppText>
      </Pressable>

      {showRecent ? (
        <RecentPlansList
          entries={history}
          onSelect={handleRestore}
          onRefresh={loadHistory}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingTop: spacing.xl,
  },
  card: {
    backgroundColor: palette.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    padding: spacing.xl,
    alignItems: 'center',
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  cardSub: {
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  recentToggle: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});
