import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';

interface WorkoutFocusChipsProps {
  tags: string[];
}

export function WorkoutFocusChips({ tags }: WorkoutFocusChipsProps) {
  if (tags.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}>
      {tags.map((tag, index) => {
        const emphasized = index === 0;
        return (
          <View key={tag} style={[styles.chip, emphasized && styles.chipEmphasized]}>
            <AppText style={[styles.chipText, emphasized && styles.chipTextEmphasized]}>
              {tag}
            </AppText>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginTop: spacing.lg,
    marginHorizontal: -spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: palette.bgCard,
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipEmphasized: {
    backgroundColor: 'rgba(244, 229, 0, 0.1)',
    borderColor: palette.accentBorderSubtle,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: palette.textSecondary,
  },
  chipTextEmphasized: {
    color: palette.accent,
  },
});
