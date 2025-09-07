import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnboardingCarousel from "./components/OnboardingCarousel";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

export default function OnboardingCarouselScreen() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  // Debug: Log current auth state
  useEffect(() => {
    console.log("🎠 Carousel screen mounted:", { user: user?.id, isLoggedIn });
  }, [user, isLoggedIn]);

  // Debug: Log when component renders
  useEffect(() => {
    console.log("🎠 Carousel component rendered");
  }, []);

  const handleComplete = () => {
    // Navigate to signup after completing onboarding carousel
    router.replace("/(auth)/signup");
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <OnboardingCarousel onComplete={handleComplete} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
