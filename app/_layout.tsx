import SplashScreen from "@/components/SplashScreen";
import { COLORS } from "@/constants/theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useProfileCheck } from "@/hooks/useProfileCheck";
import { StripeProvider } from "@/lib/stripeProvider";
import { addNotificationListeners } from "@/utils/notifications";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

// Module-level variable to persist splash state across remounts
let splashShown = false;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Cinzel-Black": require("../assets/fonts/Cinzel-Black.ttf"),
    "Cinzel-Bold": require("../assets/fonts/Cinzel-Bold.ttf"),
    "Cinzel-Regular": require("../assets/fonts/Cinzel-Regular.ttf"),
    "ZillaSlab-Bold": require("../assets/fonts/ZillaSlab-Bold.ttf"),
    "ZillaSlab-Medium": require("../assets/fonts/ZillaSlab-Medium.ttf"),
    "ZillaSlab-Regular": require("../assets/fonts/ZillaSlab-Regular.ttf"),
    "ZillaSlab-SemiBold": require("../assets/fonts/ZillaSlab-SemiBold.ttf"),
    "Vollkorn-Bold": require("../assets/fonts/Vollkorn-Bold.ttf"),
    "Vollkorn-BoldItalic": require("../assets/fonts/Vollkorn-BoldItalic.ttf"),
    "Vollkorn-Italic": require("../assets/fonts/Vollkorn-Italic.ttf"),
    "Vollkorn-Medium": require("../assets/fonts/Vollkorn-Medium.ttf"),
    "Vollkorn-MediumItalic": require("../assets/fonts/Vollkorn-MediumItalic.ttf"),
    "Vollkorn-Regular": require("../assets/fonts/Vollkorn-Regular.ttf"),
    "Vollkorn-SemiBold": require("../assets/fonts/Vollkorn-Semibold.ttf"),
    "Vollkorn-SemiBoldItalic": require("../assets/fonts/Vollkorn-SemiboldItalic.ttf"),
    "SF-Pro-Display-Black": require("../assets/fonts/SF-Pro-Display-Black.otf"),
    "SF-Pro-Display-Semibold": require("../assets/fonts/SF-Pro-Display-Semibold.otf"),
    "SF-Pro-Display-Bold": require("../assets/fonts/SF-Pro-Display-Bold.otf"),
    "SF-Pro-Display-Heavy": require("../assets/fonts/SF-Pro-Display-Heavy.otf"),
    "SF-Pro-Display-Medium": require("../assets/fonts/SF-Pro-Display-Medium.otf"),
    "SF-Pro-Display-Regular": require("../assets/fonts/SF-Pro-Display-Regular.otf"),
    "Geist-Bold": require("../assets/fonts/Geist-Bold.otf"),
    "Geist-Black": require("../assets/fonts/Geist-Black.otf"),
  });
  const [showSplash, setShowSplash] = useState(!splashShown);
  const router = useRouter();

  const handleSplashFinish = () => {
    splashShown = true;
    setShowSplash(false);
  };

  // Set up push notifications
  useEffect(() => {
    // Only set up listeners here, not the registration prompt
    const cleanup = addNotificationListeners(
      (notification: any) => {
        console.log('Notification received:', notification);
      },
      (response: any) => {
        console.log('Notification tapped:', response);
        const screen = response?.notification?.request?.content?.data?.screen;
        if (screen === 'trail-log') {
          router.push('/(tabs)/trail');
        }
      }
    );

    return cleanup;
  }, [router]);

  return (
    <>
      {!loaded ? null : (
        <StripeProvider>
          <AuthProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
              {!showSplash && (
                <AppNavigator loaded={loaded} colorScheme={colorScheme} />
              )}
              <StatusBar style="auto" />
            </ThemeProvider>
          </AuthProvider>
        </StripeProvider>
      )}
    </>
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
        headerShown: false,
        headerStyle: {
          backgroundColor: '#F5F1E6',
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontFamily: 'Vollkorn-Bold',
        },
      }}
    >
      {!user ? (
        <Stack.Screen name="(onboarding)" />
      ) : !profile ? (
        <Stack.Screen name="(onboarding)/ScreenProfileSetup" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
      <Stack.Screen 
        name="messages/[partnerId]" 
        options={{ 
          headerShown: true,
          presentation: 'card',
        }} 
      />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="defend-modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="founder" options={{ title: "Talk with the Founder", headerShown: true }} />
      <Stack.Screen name="+not-found" options={{ headerShown: true }}/>
    </Stack>
  );
}
