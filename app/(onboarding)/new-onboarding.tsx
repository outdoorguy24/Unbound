import React from 'react';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import NewOnboardingFlow from './NewOnboardingFlow';

export default function NewOnboardingScreen() {
  return (
    <OnboardingProvider>
      <NewOnboardingFlow />
    </OnboardingProvider>
  );
}
