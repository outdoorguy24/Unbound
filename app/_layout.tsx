import SplashScreen from "@/components/SplashScreen";
import { AuthProvider } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useProfileCheck } from "@/hooks/useProfileCheck";
import { StripeProvider } from "@/lib/stripeProvider";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import "react-native-reanimated";

// Module-level variable to persist splash state across remounts
let splashShown = false;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [showSplash, setShowSplash] = useState(!splashShown);

  const handleSplashFinish = () => {
    splashShown = true;
    setShowSplash(false);
  };

  return (
    <StripeProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
          {!showSplash && <AppNavigator loaded={loaded} colorScheme={colorScheme} />}
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </StripeProvider>
  );
}

function AppNavigator({ loaded, colorScheme }: { loaded: boolean; colorScheme: any }) {
  const { user, profile, loading } = useProfileCheck();
  if (!loaded || loading) {
    return null;
  }
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
        },
        headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
      }}
    >
      {!user ? (
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      ) : !profile ? (
        <Stack.Screen name="(onboarding)/ScreenProfileSetup" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="defend-modal" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="founder" options={{ title: "Talk with the Founder" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
