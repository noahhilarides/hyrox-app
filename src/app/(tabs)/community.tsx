import { ScrollView, StyleSheet, View } from 'react-native';

import { TabScreenHeader } from '@/components/layout/tab-screen-header';
import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';

export default function CommunityScreen() {
  return (
    <Screen padded={false} edges={['top']}>
      <TabScreenHeader
        center={
          <AppText style={styles.headerTitle}>Community</AppText>
        }
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pad}>
          <View style={styles.heroCard}>
            <AppText style={styles.heroTitle}>Train together</AppText>
            <AppText style={styles.heroBody}>
              Connect with HYROX athletes, share race prep, and celebrate PRs. Coming soon.
            </AppText>
          </View>

          <View style={styles.card}>
            <AppText variant="label" muted>
              Clubs
            </AppText>
            <AppText variant="body" style={styles.cardTitle}>
              Find a local crew
            </AppText>
            <AppText variant="caption" muted>
              Browse hybrid training groups near you.
            </AppText>
          </View>

          <View style={styles.card}>
            <AppText variant="label" muted>
              Challenges
            </AppText>
            <AppText variant="body" style={styles.cardTitle}>
              Weekly leaderboards
            </AppText>
            <AppText variant="caption" muted>
              Compete on volume, streaks, and race simulations.
            </AppText>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.text,
    letterSpacing: -0.2,
  },
  scroll: {
    paddingBottom: 120,
  },
  pad: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  heroCard: {
    backgroundColor: palette.bgCard,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.text,
    letterSpacing: -0.3,
  },
  heroBody: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.textSecondary,
  },
  card: {
    backgroundColor: palette.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  cardTitle: {
    fontWeight: '600',
  },
});
