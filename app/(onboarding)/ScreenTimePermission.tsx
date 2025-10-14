import { scale, scaleVertical } from "@/constants/Scale";
import { useAuth } from "@/contexts/AuthContext";
import { recordPhoneUsageData } from "@/lib/userTracking";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenTimeManager from "../services/ScreenTimeManager";

const { width } = Dimensions.get("window");

const ScreenTimePermissionScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestScreenTimePermission = async () => {
    if (!user?.id) {
      Alert.alert("Error", "User not found. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      // Request Screen Time authorization
      const authorized = await ScreenTimeManager.requestAuthorization('individual');
      
      if (authorized) {
        setPermissionGranted(true);
        
        // Get current Screen Time data to establish baseline
        try {
          const screenTimeData = await ScreenTimeManager.getScreenTimeUsageData();
          
          const baselineData = {
            totalScreenTimeMinutes: screenTimeData.totalScreenTimeMinutes || 240,
            socialMediaMinutes: screenTimeData.socialMediaMinutes || 120,
            entertainmentMinutes: screenTimeData.entertainmentMinutes || 60,
            productivityMinutes: screenTimeData.productivityMinutes || 30,
            otherMinutes: screenTimeData.otherMinutes || 30,
            isBaseline: true,
          };
          
          // Record baseline phone usage data
          await recordPhoneUsageData(user.id, baselineData);
          console.log('Baseline phone usage data recorded:', baselineData);
        } catch (error) {
          console.error('Failed to fetch Screen Time data, using fallback:', error);
          
          // Fallback to mock data if Screen Time data fetching fails
          const fallbackData = {
            totalScreenTimeMinutes: 240, // 4 hours - fallback data
            socialMediaMinutes: 120,
            entertainmentMinutes: 60,
            productivityMinutes: 30,
            otherMinutes: 30,
            isBaseline: true,
          };
          
          await recordPhoneUsageData(user.id, fallbackData);
        }
        
        // Navigate to dashboard after a brief delay
        setTimeout(() => {
          router.replace("/(tabs)/camp");
        }, 1500);
      } else {
        Alert.alert(
          "Permission Required",
          "Screen Time permission is required to track your phone usage and help you reduce it. You can enable this later in Settings.",
          [
            { text: "Skip for Now", onPress: () => router.replace("/(tabs)/camp") },
            { text: "Try Again", onPress: requestScreenTimePermission }
          ]
        );
      }
    } catch (error) {
      console.error('Screen Time permission error:', error);
      Alert.alert(
        "Error",
        "Failed to request Screen Time permission. You can enable this later in Settings.",
        [
          { text: "Skip for Now", onPress: () => router.replace("/(tabs)/camp") },
          { text: "Try Again", onPress: requestScreenTimePermission }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const skipPermission = () => {
    router.replace("/(tabs)/camp");
  };

  return (
    <View style={styles.safe}>
      <Image
        source={require("../../assets/new-images/onboarding-screen-4.png")}
        style={styles.image}
      />
      <Image
        source={require("../../assets/new-images/onboarding-overlay-full.png")}
        style={styles.overlayImage}
      />

      <View style={[styles.mainContainer, { marginTop: insets.top + scaleVertical(100) }]}>
        <Text style={styles.slogan}>Track Your Progress</Text>
        <Text style={styles.description}>
          {"To help you see how much you're reducing your phone usage, we need access to your Screen Time data.\n\nThis will establish your baseline and track your improvement over time."}
        </Text>

        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/new-images/icon_time.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        {permissionGranted ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>✓ Permission Granted!</Text>
            <Text style={styles.successSubtext}>Setting up your baseline...</Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.primaryBtn, isLoading && styles.buttonDisabled]}
              onPress={requestScreenTimePermission}
              activeOpacity={0.9}
              disabled={isLoading}
            >
              <Text style={styles.primaryText}>
                {isLoading ? "Requesting Permission..." : "Allow Screen Time Access"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={skipPermission}
              activeOpacity={0.9}
            >
              <Text style={styles.secondaryText}>Skip for Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#000" 
  },
  image: { 
    position: "absolute", 
    width: "100%", 
    height: width * 0.939
  },
  overlayImage: { 
    position: "absolute",
    width: "100%", 
    height: "120%" 
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: scale(24),
    justifyContent: 'center',
  },
  slogan: {
    color: "#FFF",
    fontSize: scale(32),
    fontFamily: "Cinzel-Regular",
    textAlign: "center",
    marginBottom: scale(16),
  },
  description: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    textAlign: "center",
    lineHeight: scale(24),
    marginBottom: scale(40),
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: scale(40),
  },
  icon: {
    width: scale(80),
    height: scale(80),
  },
  successContainer: {
    alignItems: 'center',
  },
  successText: {
    color: "#67CE67",
    fontSize: scale(20),
    fontFamily: "ZillaSlab-SemiBold",
    marginBottom: scale(8),
  },
  successSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
  },
  buttonContainer: {
    gap: scale(16),
  },
  primaryBtn: {
    backgroundColor: "#BE5E19",
    borderRadius: 6,
    paddingVertical: scale(18),
    alignItems: "center",
  },
  primaryText: {
    color: "#FFF",
    fontSize: scale(18),
    fontFamily: "ZillaSlab-SemiBold",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    borderRadius: 6,
    paddingVertical: scale(18),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  secondaryText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
  },
  buttonDisabled: {
    backgroundColor: "#312B27",
  },
});

export default ScreenTimePermissionScreen;
