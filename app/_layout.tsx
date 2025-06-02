import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useContext, useState } from 'react';
import 'react-native-reanimated';

// Auth context for global state
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate async auth check (could add splash screen here)
  // For now, always start unauthenticated/unpaid

  const login = () => {
    setIsAuthenticated(true);
    setIsPaid(true);
  };
  const logout = () => {
    setIsAuthenticated(false);
    setIsPaid(false);
  };
  const pay = () => {
    setIsPaid(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isPaid, isLoading, login, logout, pay }}>
      {children}
    </AuthContext.Provider>
  );
}

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
  const { isAuthenticated, isPaid, isLoading } = useAuth();
  if (!loaded || isLoading) {
    return null;
  }
  const showOnboarding = !isAuthenticated || !isPaid;
  return (
    <Stack>
      {showOnboarding ? (
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="defend-modal" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="founder" options={{ title: 'Talk with the Founder' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
