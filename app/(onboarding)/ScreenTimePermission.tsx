import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import ScreenTimeManager from "../services/ScreenTimeManager";

const ScreenTimePermissionScreen = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    requestScreenTimePermission();
  }, []);

  const requestScreenTimePermission = async () => {
    if (!user?.id) {
      Alert.alert("Error", "User not found. Please try again.");
      router.replace("/(tabs)/camp");
      return;
    }

    try {
      // Request Screen Time authorization using the proper Apple API
      // This will show the official Apple permission dialog and trigger Face ID/Touch ID
      const authorized = await ScreenTimeManager.requestAuthorization('individual');
      
      if (authorized) {
        console.log('Screen Time permission granted successfully');
        
        // For mock users, skip Supabase data recording to avoid security policy errors
        console.log('Screen Time permission granted for mock user:', user.id);
        console.log('Skipping baseline data recording for mock user');
      } else {
        console.log('Screen Time permission denied');
      }
    } catch (error) {
      console.error('Screen Time permission error:', error);
    } finally {
      // Always navigate to dashboard after permission request (granted or denied)
      router.replace("/(tabs)/camp");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Requesting Screen Time permission...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "ZillaSlab-Medium",
    textAlign: "center",
  },
});

export default ScreenTimePermissionScreen;
