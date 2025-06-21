import SplashScreen from "@/components/SplashScreen";
import { AuthProvider } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useProfileCheck } from "@/hooks/useProfileCheck";
import { StripeProvider } from "@/lib/stripeProvider";
import { supabase } from "@/lib/supabaseClient";
import { addNotificationListeners, registerForPushNotificationsAsync } from "@/utils/notifications";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
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
  });
  const [showSplash, setShowSplash] = useState(!splashShown);

  const handleSplashFinish = () => {
    splashShown = true;
    setShowSplash(false);
  };

  // Set up push notifications
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Register for push notifications
        const token = await registerForPushNotificationsAsync();
        console.log('Push notification token:', token);
        
        // Save token to database if user is logged in
        if (token) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { error } = await supabase
              .from('user_profiles')
              .update({ push_token: token })
              .eq('user_id', user.id);
            
            if (error) {
              console.error('Error saving push token:', error);
            } else {
              console.log('Push token saved to database');
            }
          }
        }
        
        // Set up notification listeners
        const cleanup = addNotificationListeners(
          (notification: any) => {
            console.log('Notification received:', notification);
          },
          (response: any) => {
            console.log('Notification tapped:', response);
            // Handle notification tap - navigate to trail log if it's a weekly summary
            if (response?.notification?.request?.content?.data?.screen === 'trail-log') {
              // Navigate to trail log screen
              // This will be handled by the notification tap listener in the app
            }
          }
        );
        
        return cleanup;
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };
    
    setupNotifications();
  }, []);

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
        headerShown: false,
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
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="defend-modal" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="founder" options={{ title: "Talk with the Founder", headerShown: true }} />
      <Stack.Screen name="+not-found" options={{ headerShown: true }} />
    </Stack>
  );
}
