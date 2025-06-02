import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import OnboardingPager from './OnboardingPager';

export default function OnboardingIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/(onboarding)/Screen1');
  }, []);
  return null;
}

export { OnboardingPager };
