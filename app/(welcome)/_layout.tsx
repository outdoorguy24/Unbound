import { useAuth } from "@/contexts/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";

export default function WelcomeLayout() {
  const { user, isLoadingAuth } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // TODO: DISABLED - Routing logic commented out to prevent navigation interference
  // Issue: This was causing Login button to redirect back to Welcome screen
  // Future: Need to implement proper routing logic that doesn't interfere with user navigation
  //
  // useEffect(() => {
  //   if (isLoadingAuth) return;

  //   const inAuthGroup = segments[0] === "(welcome)";

  //   if (!user && !inAuthGroup) {
  //     // Redirect to login if not authenticated and not in auth group
  //     router.replace("/(welcome)/WelcomeScreen");
  //   } else if (user && inAuthGroup) {
  //     // Redirect to home if authenticated and in auth group
  //     router.replace("/(onboarding)/Screen13");
  //   }
  // }, [user, segments, isLoadingAuth, router]);

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
