import type { OnboardingStepId } from '@/types/onboarding';

export interface OnboardingFlowStep {
  id: OnboardingStepId;
  /** Path segment under `/(onboarding)/` */
  route: `/(onboarding)/${OnboardingStepId}`;
  title: string;
  /** Shown in shared header when step is active */
  headerTitle?: string;
  /** Skip when goal is not HYROX race */
  skipUnlessHyroxRace?: boolean;
  /** Count toward progress bar (summary excluded) */
  countsInProgress?: boolean;
}

export const ONBOARDING_FLOW: OnboardingFlowStep[] = [
  {
    id: 'goal',
    route: '/(onboarding)/goal',
    title: 'Your goal',
    headerTitle: 'Goal',
    countsInProgress: true,
  },
  {
    id: 'race',
    route: '/(onboarding)/race',
    title: 'Your race',
    headerTitle: 'Race',
    skipUnlessHyroxRace: true,
    countsInProgress: true,
  },
  {
    id: 'running-level',
    route: '/(onboarding)/running-level',
    title: 'Running',
    headerTitle: 'Running',
    countsInProgress: true,
  },
  {
    id: 'strength-level',
    route: '/(onboarding)/strength-level',
    title: 'Strength',
    headerTitle: 'Strength',
    countsInProgress: true,
  },
  {
    id: 'weaknesses',
    route: '/(onboarding)/weaknesses',
    title: 'Weaknesses',
    headerTitle: 'Focus areas',
    countsInProgress: true,
  },
  {
    id: 'availability',
    route: '/(onboarding)/availability',
    title: 'Availability',
    headerTitle: 'Schedule',
    countsInProgress: true,
  },
  {
    id: 'equipment',
    route: '/(onboarding)/equipment',
    title: 'Equipment',
    headerTitle: 'Equipment',
    countsInProgress: true,
  },
  {
    id: 'interests',
    route: '/(onboarding)/interests',
    title: 'Interests',
    headerTitle: 'Expansion',
    countsInProgress: true,
  },
  {
    id: 'plan-start',
    route: '/(onboarding)/plan-start',
    title: 'Start date',
    headerTitle: 'Start',
    countsInProgress: true,
  },
  {
    id: 'summary',
    route: '/(onboarding)/summary',
    title: 'Summary',
    countsInProgress: false,
  },
];

export function getActiveFlow(goal: string | null | undefined): OnboardingFlowStep[] {
  return ONBOARDING_FLOW.filter((step) => {
    if (step.skipUnlessHyroxRace && goal !== 'hyrox_race') return false;
    return true;
  });
}

export function getFlowStep(id: OnboardingStepId): OnboardingFlowStep | undefined {
  return ONBOARDING_FLOW.find((s) => s.id === id);
}
