import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { OnboardingNavBar } from '@/components/onboarding/onboarding-nav-bar';
import { onboardingTheme } from '@/data/onboarding/theme';
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation';
import { useOnboardingProgress } from '@/hooks/use-onboarding-progress';

export default function OnboardingLayout() {
  const { showProgress, progress, currentStep } = useOnboardingProgress();
  const { goBack, closeOnboarding, canGoBack } = useOnboardingNavigation();

  const isSummary = currentStep?.id === 'summary';

  return (
    <View style={styles.root}>
      {!isSummary ? (
        <OnboardingNavBar
          showBack={canGoBack}
          showProgress={showProgress}
          progress={progress}
          onBack={goBack}
          onClose={closeOnboarding}
        />
      ) : null}
      <View style={styles.stack}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: onboardingTheme.bg },
            animation: 'slide_from_right',
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: onboardingTheme.bg,
  },
  stack: {
    flex: 1,
  },
});
