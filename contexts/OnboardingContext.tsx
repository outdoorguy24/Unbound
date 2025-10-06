import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define the shape of the context data
interface OnboardingState {
  traps: string[];
  setTraps: (traps: string[]) => void;
  scrollTimes: string[];
  setScrollTimes: (times: string[]) => void;
  concerns: string[];
  setConcerns: (concerns: string[]) => void;
  improvementOptions: string[];
  setImprovementOptions: (improvementOptions: string[]) => void;
  // Add other onboarding states here as needed
}

// Create the context with a default undefined value
const OnboardingContext = createContext<OnboardingState | undefined>(undefined);

// Create the provider component
export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [traps, setTraps] = useState<string[]>([]);
  const [scrollTimes, setScrollTimes] = useState<string[]>([]);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [improvementOptions, setImprovementOptions] = useState<string[]>([]);

  const value = {
    traps,
    setTraps,
    scrollTimes,
    setScrollTimes,
    concerns,
    setConcerns,
    improvementOptions,
    setImprovementOptions,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

// Create a custom hook for easy access to the context
export const useOnboarding = (): OnboardingState => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}; 