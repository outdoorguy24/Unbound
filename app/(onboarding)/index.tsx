import { router } from 'expo-router';
import ParadoxScreen from './ParadoxScreen';

export default function OnboardingIndex() {
  return (
    <ParadoxScreen
      onSubmit={() => {
        router.push("/(onboarding)/OnboardingPager");
      }}
      onLogin={() => {
        //TODO: FOR TESTING
        // router.push("/(tabs)/camp")
        
        router.push("/(auth)/login")
      }}
    />
  );
}
