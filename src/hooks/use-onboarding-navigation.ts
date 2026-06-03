import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { getActiveFlow } from '@/data/onboarding/flow';
import { useOnboardingStore } from '@/store/onboarding-store';
import type { OnboardingStepId } from '@/types/onboarding';

import { useOnboardingProgress } from './use-onboarding-progress';

export function useOnboardingNavigation() {
  const router = useRouter();
  const goal = useOnboardingStore((s) => s.goal);
  const reset = useOnboardingStore((s) => s.reset);
  const { currentId, flow } = useOnboardingProgress();

  const goToStep = useCallback(
    (id: OnboardingStepId) => {
      router.push(`/(onboarding)/${id}`);
    },
    [router]
  );

  const goNext = useCallback(() => {
    const activeFlow = getActiveFlow(goal);
    const index = activeFlow.findIndex((s) => s.id === currentId);
    const next = activeFlow[index + 1];
    if (next) {
      router.push(next.route);
    }
  }, [currentId, goal, router]);

  const goBack = useCallback(() => {
    const activeFlow = getActiveFlow(goal);
    const index = activeFlow.findIndex((s) => s.id === currentId);
    if (index > 0) {
      router.back();
      return;
    }
    router.back();
  }, [currentId, goal, router]);

  const closeOnboarding = useCallback(() => {
    router.replace('/(tabs)/today');
  }, [router]);

  const restartOnboarding = useCallback(() => {
    reset();
    router.replace('/(onboarding)/goal');
  }, [reset, router]);

  const canGoBack = useCallback(() => {
    const activeFlow = getActiveFlow(goal);
    const index = activeFlow.findIndex((s) => s.id === currentId);
    return index > 0;
  }, [currentId, goal]);

  return {
    flow,
    currentId,
    goToStep,
    goNext,
    goBack,
    closeOnboarding,
    restartOnboarding,
    canGoBack: canGoBack(),
  };
}
