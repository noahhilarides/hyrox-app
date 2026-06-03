import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProgressBar } from '@/components/onboarding/progress-bar';
import { AppText } from '@/components/ui/text';
import { onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';

interface OnboardingHeaderProps {
  title?: string;
  showBack: boolean;
  showClose: boolean;
  showProgress: boolean;
  progress: number;
  onBack: () => void;
  onClose: () => void;
}

export function OnboardingHeader({
  title,
  showBack,
  showClose,
  showProgress,
  progress,
  onBack,
  onClose,
}: OnboardingHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + onboardingSpacing.sm }]}>
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

        <View style={styles.center}>
          {title ? (
            <AppText variant="bodyMedium" style={styles.title}>
              {title}
            </AppText>
          ) : null}
        </View>

        <View style={[styles.side, styles.sideRight]}>
          {showClose ? (
            <Pressable onPress={onClose} hitSlop={12} style={styles.iconBtn} accessibilityLabel="Close">
              <Ionicons name="close" size={22} color={onboardingTheme.textMuted} />
            </Pressable>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
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
    borderBottomWidth: 1,
    borderBottomColor: onboardingTheme.borderSoft,
    paddingHorizontal: onboardingSpacing.lg,
    paddingBottom: onboardingSpacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  side: {
    width: 44,
    alignItems: 'flex-start',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 44,
    height: 44,
  },
  progressWrap: {
    marginTop: onboardingSpacing.md,
  },
});
