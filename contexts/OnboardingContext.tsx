import React, { createContext, ReactNode, useContext, useState } from 'react';
import { OnboardingResponses, getDefaultResponses } from '@/data/onboardingData';

// Define the shape of the context data
interface OnboardingState {
  responses: OnboardingResponses;
  updateResponse: (key: string, value: any) => void;
  getAllResponses: () => OnboardingResponses;
  resetResponses: () => void;
  currentScreen: number;
  setCurrentScreen: (screen: number) => void;
  // Legacy support for existing components
  traps: string[];
  setTraps: (traps: string[]) => void;
  scrollTimes: string[];
  setScrollTimes: (times: string[]) => void;
  concerns: string[];
  setConcerns: (concerns: string[]) => void;
}

// Create the context with a default undefined value
const OnboardingContext = createContext<OnboardingState | undefined>(undefined);

// Create the provider component
export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [responses, setResponses] = useState<OnboardingResponses>(getDefaultResponses());
  const [currentScreen, setCurrentScreen] = useState(0);

  // Legacy state for backward compatibility
  const [traps, setTraps] = useState<string[]>([]);
  const [scrollTimes, setScrollTimes] = useState<string[]>([]);
  const [concerns, setConcerns] = useState<string[]>([]);

  const updateResponse = (key: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Update legacy states for backward compatibility
    if (key === 'digital_traps') {
      setTraps(value);
    } else if (key === 'daily_scroll_time') {
      setScrollTimes([value]);
    } else if (key === 'main_concerns') {
      setConcerns(value);
    }
  };

  const getAllResponses = () => responses;

  const resetResponses = () => {
    setResponses(getDefaultResponses());
    setCurrentScreen(0);
    setTraps([]);
    setScrollTimes([]);
    setConcerns([]);
  };

  const value = {
    responses,
    updateResponse,
    getAllResponses,
    resetResponses,
    currentScreen,
    setCurrentScreen,
    // Legacy support
    traps,
    setTraps: (newTraps: string[]) => {
      setTraps(newTraps);
      updateResponse('digital_traps', newTraps);
    },
    scrollTimes,
    setScrollTimes: (newTimes: string[]) => {
      setScrollTimes(newTimes);
      updateResponse('daily_scroll_time', newTimes[0] || '');
    },
    concerns,
    setConcerns: (newConcerns: string[]) => {
      setConcerns(newConcerns);
      updateResponse('main_concerns', newConcerns);
    },
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