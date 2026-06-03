import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';
import type { TrainingPhase } from '@/lib/plan-insights';
import { getPhaseLabel } from '@/lib/plan-insights';

interface PhaseBannerProps {
  phase: TrainingPhase;
  weekLabel: string;
  raceDateLabel?: string;
}

export function PhaseBanner({ phase, weekLabel, raceDateLabel }: PhaseBannerProps) {
  return (
    <View style={styles.banner}>
      <View style={styles.top}>
        <AppText variant="label" accent>
          {getPhaseLabel(phase)}
        </AppText>
        <AppText variant="caption" muted>
          {weekLabel}
        </AppText>
      </View>
      {raceDateLabel ? (
        <AppText variant="body" muted style={styles.race}>
          {raceDateLabel}
        </AppText>
      ) : null}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            phase === 'base' && { width: '25%' },
            phase === 'build' && { width: '50%' },
            phase === 'peak' && { width: '78%' },
            phase === 'taper' && { width: '95%' },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: palette.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    marginBottom: spacing.lg,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  race: {
    marginBottom: spacing.md,
  },
  track: {
    height: 4,
    backgroundColor: palette.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: palette.accent,
    borderRadius: 2,
  },
});
