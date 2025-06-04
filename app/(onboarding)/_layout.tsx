import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="paywall" options={{ headerShown: false }} />
      <Stack.Screen name="payment" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="Screen5" options={{ headerShown: false }} />
      <Stack.Screen name="Screen10" options={{ headerShown: false }} />
      <Stack.Screen name="Screen6" options={{ headerShown: false }} />
      <Stack.Screen name="Screen9" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
} 