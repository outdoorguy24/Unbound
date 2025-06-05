import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Screen1" options={{ headerShown: false }} />
      <Stack.Screen name="Screen2" options={{ headerShown: false }} />
      <Stack.Screen name="Screen3" options={{ headerShown: false }} />
      <Stack.Screen name="Screen4" options={{ headerShown: false }} />
      <Stack.Screen name="Screen5" options={{ headerShown: false }} />
      <Stack.Screen name="Screen6" options={{ headerShown: false }} />
      <Stack.Screen name="Screen7" options={{ headerShown: false }} />
      <Stack.Screen name="Screen10" options={{ headerShown: false }} />
      <Stack.Screen name="Screen8" options={{ headerShown: false }} />
      <Stack.Screen name="paywall-pricing" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="ScreenProfileSetup" options={{ headerShown: false }} />
      <Stack.Screen name="Screen9" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
} 