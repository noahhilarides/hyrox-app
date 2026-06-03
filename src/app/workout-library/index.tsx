import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { WorkoutTypeBadge } from '@/components/workout-type-badge';
import { palette, radius, spacing } from '@/constants/tokens';
import {
  ALL_WORKOUT_TEMPLATES,
  WORKOUT_CATEGORIES,
  WORKOUT_LIBRARY,
} from '@/data/workout-library';
import { formatLibraryCategory } from '@/lib/workout-library-display';
import type { WorkoutTemplate } from '@/types/workout';

export default function WorkoutLibraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_WORKOUT_TEMPLATES;
    return ALL_WORKOUT_TEMPLATES.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.id.toLowerCase().includes(q) ||
        w.category.includes(q) ||
        w.focus.some((f) => f.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <Screen padded={false} edges={['top', 'bottom']}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <AppText style={styles.back}>← Back</AppText>
        </Pressable>
        <AppText variant="title" style={styles.title}>
          Workout library
        </AppText>
        <AppText variant="caption" muted>
          {ALL_WORKOUT_TEMPLATES.length} templates · dev browser
        </AppText>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search name, id, focus…"
          placeholderTextColor={palette.textMuted}
          style={styles.search}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {query.trim() === '' ? (
          WORKOUT_CATEGORIES.map((category) => (
            <CategorySection
              key={category}
              category={category}
              items={WORKOUT_LIBRARY[category]}
              onPressItem={(id) => router.push(`/workout-library/${id}`)}
            />
          ))
        ) : (
          <View style={styles.pad}>
            <AppText style={styles.searchMeta}>
              {filtered.length} match{filtered.length === 1 ? '' : 'es'}
            </AppText>
            {filtered.map((item) => (
              <LibraryRow
                key={item.id}
                item={item}
                onPress={() => router.push(`/workout-library/${item.id}`)}
              />
            ))}
          </View>
        )}

        {filtered.length === 0 && query.trim() !== '' ? (
          <View style={styles.pad}>
            <AppText muted>No workouts match your search.</AppText>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function CategorySection({
  category,
  items,
  onPressItem,
}: {
  category: (typeof WORKOUT_CATEGORIES)[number];
  items: WorkoutTemplate[];
  onPressItem: (id: string) => void;
}) {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <View style={styles.section}>
      <AppText style={styles.sectionTitle}>
        {formatLibraryCategory(category)} ({sorted.length})
      </AppText>
      <View style={styles.sectionList}>
        {sorted.map((item) => (
          <LibraryRow key={item.id} item={item} onPress={() => onPressItem(item.id)} />
        ))}
      </View>
    </View>
  );
}

function LibraryRow({ item, onPress }: { item: WorkoutTemplate; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <View style={styles.rowTop}>
        <AppText style={styles.rowName} numberOfLines={2}>
          {item.name}
        </AppText>
        <WorkoutTypeBadge type={item.workoutType} compact />
      </View>
      <AppText style={styles.rowMeta} numberOfLines={1}>
        {item.id} · {item.difficulty} · {item.duration} min
        {item.variant ? ` · ${item.variant}` : ''}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
  },
  back: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.accent,
    marginBottom: spacing.sm,
  },
  title: {
    marginBottom: spacing.xs,
  },
  search: {
    marginTop: spacing.md,
    backgroundColor: palette.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
    color: palette.text,
  },
  scroll: {
    paddingBottom: spacing.xxxl,
  },
  pad: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  searchMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.textMuted,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  section: {
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: palette.textSecondary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    backgroundColor: palette.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
  },
  rowPressed: {
    opacity: 0.85,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  rowName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
  },
  rowMeta: {
    fontSize: 12,
    color: palette.textMuted,
  },
});
