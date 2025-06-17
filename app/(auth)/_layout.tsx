import { useAuth } from "@/contexts/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { user, isLoadingAuth } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoadingAuth) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Redirect to home if authenticated and in auth group
      router.replace("/(onboarding)/Screen9");
    }
  }, [user, segments, isLoadingAuth, router]);

  if (isLoadingAuth) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}
