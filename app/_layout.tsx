import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useProfileCheck } from '@/hooks/useProfileCheck';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppNavigator loaded={loaded} />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppNavigator({ loaded }) {
  const { user, profile, loading } = useProfileCheck();
  if (!loaded || loading) {
    return null;
  }
  return (
    <Stack>
      {!user ? (
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      ) : !profile ? (
        <Stack.Screen name="(onboarding)/ScreenProfileSetup" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="defend-modal" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="founder" options={{ title: 'Talk with the Founder' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
