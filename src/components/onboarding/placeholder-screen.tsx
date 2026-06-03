import { OnboardingContainer } from '@/components/onboarding/onboarding-container';
import { ContinueButton } from '@/components/onboarding/continue-button';
import { QuestionCard } from '@/components/onboarding/question-card';
import { AppText } from '@/components/ui/text';
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation';
import { onboardingSpacing } from '@/data/onboarding/theme';

interface PlaceholderScreenProps {
  title: string;
  subtitle?: string;
  stepLabel: string;
}

export function PlaceholderScreen({ title, subtitle, stepLabel }: PlaceholderScreenProps) {
  const { goNext } = useOnboardingNavigation();

  return (
    <OnboardingContainer
      footer={<ContinueButton label="Continue" onPress={goNext} />}>
      <QuestionCard title={title} subtitle={subtitle}>
        <AppText variant="body" muted>
          {stepLabel} — screen placeholder. Wire up options and validation here.
        </AppText>
      </QuestionCard>
    </OnboardingContainer>
  );
}
