import { format, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileAvatarButton } from '@/components/layout/profile-avatar-button';
import { SettingsGroup } from '@/components/profile/settings-group';
import { SettingsRow } from '@/components/profile/settings-row';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { palette, spacing } from '@/constants/tokens';
import { useApp } from '@/context/app-context';
import { formatHyroxFinishTime } from '@/lib/hyrox-race-time';
import { getPlanTitle, hasActivePlan } from '@/lib/plan-insights';

const GOAL_LABELS: Record<string, string> = {
  hyrox_race: 'HYROX race',
  hybrid_fitness: 'Hybrid fitness',
  endurance: 'Endurance',
  strength: 'Strength',
  return_to_fitness: 'Return to fitness',
  performance_training: 'Performance Training',
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, plan, resetApp } = useApp();
  const active = hasActivePlan(plan);

  return (
    <Screen padded={false} edges={['top', 'bottom']}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <ProfileAvatarButton />
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.close}>
          <AppText style={styles.closeText}>Done</AppText>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pad}>
          <View style={styles.avatarLarge}>
            <AppText variant="hero" style={styles.avatarText}>
              {(profile?.goal?.[0] ?? 'H').toUpperCase()}
            </AppText>
          </View>
          <AppText variant="title" style={styles.name}>
            Hybrid athlete
          </AppText>
          <AppText variant="body" muted style={styles.planLine}>
            {active ? getPlanTitle(profile, plan) : 'No active plan'}
          </AppText>

          <SettingsGroup title="Training">
            <SettingsRow
              label="Goal"
              value={profile ? GOAL_LABELS[profile.goal] : undefined}
              placeholder="Not set"
            />
            <SettingsRow
              label="Race date"
              value={
                profile?.raceDate
                  ? format(parseISO(profile.raceDate), 'MMM d, yyyy')
                  : undefined
              }
              placeholder="Not set"
            />
            <SettingsRow
              label="Race experience"
              value={
                profile?.hasRacedBefore === true && profile.previousRaceTimeSeconds != null
                  ? formatHyroxFinishTime(profile.previousRaceTimeSeconds)
                  : profile?.hasRacedBefore === false
                    ? 'First race'
                    : profile?.hasRacedBefore === true
                      ? 'Prior finisher'
                      : undefined
              }
              placeholder="Not set"
              last
            />
          </SettingsGroup>

          <SettingsGroup title="Connections">
            <SettingsRow label="Apple Health" placeholder="Connect" onPress={() => {}} />
            <SettingsRow label="Garmin" placeholder="Connect" onPress={() => {}} last />
          </SettingsGroup>

          <SettingsGroup title="Preferences">
            <SettingsRow
              label="Workout length"
              value={profile ? `${profile.workoutLength} min` : undefined}
              placeholder="—"
            />
            <SettingsRow
              label="Days per week"
              value={profile ? `${profile.daysPerWeek}` : undefined}
              placeholder="—"
            />
            <SettingsRow label="Notifications" placeholder="Off" onPress={() => {}} last />
          </SettingsGroup>

          <SettingsGroup title="Support">
            <SettingsRow label="Help center" placeholder="View" onPress={() => {}} />
            <SettingsRow label="Send feedback" placeholder="Email" onPress={() => {}} />
            <SettingsRow
              label="Workout library"
              value="Browse templates"
              onPress={() => router.push('/workout-library')}
              last
            />
          </SettingsGroup>

          {active ? (
            <View style={styles.btn}>
              <Button
                label="Edit plan"
                variant="secondary"
                onPress={() => router.push('/(onboarding)/goal')}
              />
            </View>
          ) : null}

          <View style={styles.btn}>
            <Button label="Start new plan" onPress={() => router.push('/(onboarding)/goal')} />
          </View>

          <Button
            label="Reset app (dev)"
            variant="ghost"
            size="md"
            onPress={async () => {
              await resetApp();
              router.back();
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  close: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.accent,
  },
  scroll: {
    paddingBottom: spacing.xxxl,
  },
  pad: {
    paddingHorizontal: spacing.lg,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.accentDim,
    borderWidth: 1,
    borderColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    color: palette.accent,
    fontSize: 28,
  },
  name: {
    marginBottom: spacing.xs,
  },
  planLine: {
    marginBottom: spacing.xl,
  },
  btn: {
    marginTop: spacing.md,
  },
});
