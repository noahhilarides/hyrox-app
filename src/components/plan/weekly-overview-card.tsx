import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';

interface WeeklyOverviewCardProps {
  structure: string[];
  focusAreas: string[];
  subtitle?: string;
}

export function WeeklyOverviewCard({ structure, focusAreas, subtitle }: WeeklyOverviewCardProps) {
  return (
    <View style={styles.card}>
      <AppText variant="headline" style={styles.title}>
        Your week at a glance
      </AppText>
      {subtitle ? (
        <AppText variant="body" muted style={styles.sub}>
          {subtitle}
        </AppText>
      ) : null}

      <AppText variant="label" muted style={styles.label}>
        Structure
      </AppText>
      {structure.map((line) => (
        <View key={line} style={styles.row}>
          <View style={styles.bullet} />
          <AppText variant="body">{line}</AppText>
        </View>
      ))}

      <AppText variant="label" muted style={[styles.label, styles.labelSpaced]}>
        Priorities
      </AppText>
      <View style={styles.chips}>
        {focusAreas.map((f) => (
          <View key={f} style={styles.chip}>
            <AppText variant="caption">{f}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.xs,
  },
  sub: {
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  label: {
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  labelSpaced: {
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.accent,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: palette.bgElevated,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
  },
});
