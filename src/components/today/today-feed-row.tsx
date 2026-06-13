import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { TodayFeedCard } from '@/components/today/today-feed-card';
import { TodaySectionHeader } from '@/components/today/today-section-header';
import type { TodayFeedModule } from '@/data/today/feed-modules';
import { spacing } from '@/constants/tokens';

interface TodayFeedRowProps {
  title: string;
  modules: TodayFeedModule[];
  leadingTile?: ReactNode;
}

export function TodayFeedRow({ title, modules, leadingTile }: TodayFeedRowProps) {
  if (modules.length === 0 && !leadingTile) return null;

  return (
    <View style={styles.section}>
      <TodaySectionHeader title={title} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {leadingTile}
        {modules.map((module, index) => (
          <TodayFeedCard key={module.id} module={module} tall={index === 0} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  scroll: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
  },
});
