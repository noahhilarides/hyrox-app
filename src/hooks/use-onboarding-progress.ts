import { useMemo } from 'react';
import { usePathname } from 'expo-router';

import { getActiveFlow } from '@/data/onboarding/flow';
import { useOnboardingStore } from '@/store/onboarding-store';
import type { OnboardingStepId } from '@/types/onboarding';

function stepIdFromPathname(pathname: string): OnboardingStepId | null {
  const segment = pathname.split('/').filter(Boolean).pop();
  if (!segment) return null;
  return segment as OnboardingStepId;
}

export function useOnboardingProgress() {
  const pathname = usePathname();
  const goal = useOnboardingStore((s) => s.goal);

  return useMemo(() => {
    const flow = getActiveFlow(goal);
    const progressSteps = flow.filter((s) => s.countsInProgress);
    const currentId = stepIdFromPathname(pathname);
    const currentIndex = progressSteps.findIndex((s) => s.id === currentId);
    const step = flow.find((s) => s.id === currentId);

    const progress =
      currentIndex >= 0 && progressSteps.length > 0
        ? (currentIndex + 1) / progressSteps.length
        : 0;

    return {
      flow,
      progressSteps,
      currentId,
      currentStep: step,
      currentIndex: Math.max(currentIndex, 0),
      totalSteps: progressSteps.length,
      progress,
      showProgress: step?.countsInProgress ?? false,
    };
  }, [pathname, goal]);
}
