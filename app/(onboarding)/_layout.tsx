import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="ScreenTimePermission" />
        <Stack.Screen name="ScreenProfileSetup" />
        {/* <Stack.Screen name="Screen13" /> */}
        <Stack.Screen name="paywall-pricing" />
      </Stack>
    </OnboardingProvider>
  );
}
