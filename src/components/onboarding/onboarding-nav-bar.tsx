import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProgressBar } from '@/components/onboarding/progress-bar';
import { onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';

interface OnboardingNavBarProps {
  showBack: boolean;
  showProgress: boolean;
  progress: number;
  onBack: () => void;
  onClose: () => void;
}

export function OnboardingNavBar({
  showBack,
  showProgress,
  progress,
  onBack,
  onClose,
}: OnboardingNavBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + onboardingSpacing.md }]}>
      <View style={styles.row}>
        <View style={styles.side}>
          {showBack ? (
            <Pressable onPress={onBack} hitSlop={12} style={styles.iconBtn} accessibilityLabel="Back">
              <Ionicons name="chevron-back" size={24} color={onboardingTheme.text} />
            </Pressable>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </View>
        <View style={styles.side}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.iconBtn} accessibilityLabel="Close">
            <Ionicons name="close" size={22} color={onboardingTheme.textMuted} />
          </Pressable>
        </View>
      </View>
      {showProgress ? (
        <View style={styles.progressWrap}>
          <ProgressBar progress={progress} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: onboardingTheme.bg,
    paddingHorizontal: onboardingSpacing.lg,
    paddingBottom: onboardingSpacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  side: {
    width: 44,
    alignItems: 'flex-start',
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
  },
  progressWrap: {
    marginTop: onboardingSpacing.md,
    marginBottom: onboardingSpacing.xs,
  },
});
