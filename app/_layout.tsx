import SplashScreenV2 from "@/components/SplashScreenV2";
import { COLORS } from "@/constants/theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";
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
    "Vollkorn-Bold": require("../assets/fonts/Vollkorn-Bold.ttf"),
    "Vollkorn-BoldItalic": require("../assets/fonts/Vollkorn-BoldItalic.ttf"),
    "Vollkorn-Italic": require("../assets/fonts/Vollkorn-Italic.ttf"),
    "Vollkorn-Medium": require("../assets/fonts/Vollkorn-Medium.ttf"),
    "Vollkorn-MediumItalic": require("../assets/fonts/Vollkorn-MediumItalic.ttf"),
    "Vollkorn-Regular": require("../assets/fonts/Vollkorn-Regular.ttf"),
    "Vollkorn-SemiBold": require("../assets/fonts/Vollkorn-Semibold.ttf"),
    "Vollkorn-SemiBoldItalic": require("../assets/fonts/Vollkorn-SemiboldItalic.ttf"),
    "Cinzel-Regular": require("../assets/fonts/Cinzel-Regular.ttf"),
    "Cinzel-Medium": require("../assets/fonts/Cinzel-Medium.ttf"),
    "Cinzel-Bold": require("../assets/fonts/Cinzel-Bold.ttf"),
    "Zilla-Slab": require("../assets/fonts/ZillaSlab-Regular.ttf"),
    "Zilla-Slab-Bold": require("../assets/fonts/ZillaSlab-Bold.ttf"),
    "Zilla-Slab-Medium": require("../assets/fonts/ZillaSlab-Medium.ttf"),
    "Zilla-Slab-Regular": require("../assets/fonts/ZillaSlab-Regular.ttf"),
  });
  const [showSplash, setShowSplash] = useState(!splashShown);
  const router = useRouter();

  const handleSplashFinish = () => {
    splashShown = true;
    setShowSplash(false);
    // Navigate to Welcome Screen after splash
    router.replace("/(welcome)/WelcomeScreen");
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
    <StripeProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          {showSplash && <SplashScreenV2 onFinish={handleSplashFinish} />}
          {!showSplash && <AppNavigator loaded={loaded} colorScheme={colorScheme} />}
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </StripeProvider>
  );
}

function AppNavigator({ loaded, colorScheme }: { loaded: boolean; colorScheme: any }) {
  // const { user, profile, loading } = useProfileCheck();
  // if (!loaded || loading) {
  //   return null;
  // }
  if (!loaded) {
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
      {/* Always include all possible screens - let AuthContext handle routing */}
      <Stack.Screen name="(welcome)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen 
        name="messages/[partnerId]" 
        options={{ 
          headerShown: true,
          presentation: 'card',
        }} 
      />
      <Stack.Screen name="defend-modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="founder" options={{ title: "Talk with the Founder", headerShown: true }} />
      <Stack.Screen name="+not-found" options={{ headerShown: true }}/>
    </Stack>
  );
}
