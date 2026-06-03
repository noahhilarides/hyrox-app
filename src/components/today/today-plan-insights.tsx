import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';

interface TodayPlanInsightsProps {
  focusAreas: string[];
  weeklyStructure: string[];
  runnerLabel?: string;
  strengthLabel?: string;
}

export function TodayPlanInsights({
  focusAreas,
  weeklyStructure,
  runnerLabel,
  strengthLabel,
}: TodayPlanInsightsProps) {
  return (
    <View style={styles.card}>
      {(runnerLabel || strengthLabel) && (
        <View style={styles.levelRow}>
          {runnerLabel ? (
            <View style={styles.levelPill}>
              <AppText style={styles.levelText}>{runnerLabel}</AppText>
            </View>
          ) : null}
          {strengthLabel ? (
            <View style={styles.levelPill}>
              <AppText style={styles.levelText}>{strengthLabel}</AppText>
            </View>
          ) : null}
        </View>
      )}

      <AppText style={styles.sectionTitle}>Focus areas</AppText>
      <View style={styles.chips}>
        {focusAreas.map((area) => (
          <View key={area} style={styles.chip}>
            <AppText style={styles.chipText}>{area}</AppText>
          </View>
        ))}
      </View>

      {weeklyStructure.length > 0 ? (
        <>
          <AppText style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
            Weekly structure
          </AppText>
          {weeklyStructure.map((line) => (
            <View key={line} style={styles.structureRow}>
              <View style={styles.dot} />
              <AppText style={styles.structureText}>{line}</AppText>
            </View>
          ))}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingTop: spacing.lg,
    marginBottom: spacing.md,
  },
  levelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  levelPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
    color: palette.textSecondary,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: palette.textSecondary,
    opacity: 0.55,
    marginBottom: spacing.sm,
  },
  sectionTitleSpaced: {
    marginTop: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: 'rgba(244, 229, 0, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(244, 229, 0, 0.15)',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: palette.accent,
    opacity: 0.9,
  },
  structureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs + 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.textSecondary,
    opacity: 0.4,
  },
  structureText: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.textSecondary,
    opacity: 0.85,
  },
});
