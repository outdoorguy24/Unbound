import { SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, Animated, ImageBackground, Linking, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TouchableOpacity } from "react-native";
import FounderModal from "../components/FounderModal";

const ACCOUNT = [
  {
    label: "Terms of Use",
    icon: <Feather name="file-text" size={24} color="#564110" style={{ marginRight: 16 }} />,
    action: "terms",
  },
  {
    label: "Privacy Policy",
    icon: <Feather name="lock" size={24} color="#564110" style={{ marginRight: 16 }} />,
    action: "privacy",
  },
  {
    label: "Notifications",
    icon: <Feather name="bell" size={24} color="#564110" style={{ marginRight: 16 }} />,
    action: "notifications",
  },
];
const COMMUNITY = [
  {
    label: "Talk with the Founder",
    icon: <MaterialIcons name="message" size={24} color="#564110" style={{ marginRight: 16 }} />,
    route: "/profile/founder",
  },
  {
    label: "Leave a review",
    icon: <Feather name="star" size={24} color="#564110" style={{ marginRight: 16 }} />,
    action: "review",
  },
  {
    label: "Refer a friend",
    icon: <Feather name="send" size={24} color="#564110" style={{ marginRight: 16 }} />,
    action: "refer",
  },
  {
    label: "Test Notification (Dev)",
    icon: <Feather name="bell" size={24} color="#564110" style={{ marginRight: 16 }} />,
    action: "testNotification",
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [founderModalVisible, setFounderModalVisible] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout>();
  const animatedValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(animatedValue, {
      toValue: 0.5,
      duration: 150,
      useNativeDriver: true,
    }).start();

    pressTimer.current = setTimeout(() => {
      Alert.alert("🎉 Founder Mode Activated");
      setFounderModalVisible(true);
    }, 5000); // 5 seconds
  };

  const handlePressOut = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();

    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleAccountPress = async (item: typeof ACCOUNT[0]) => {
    if (item.route) {
      router.push(item.route);
    }
    if (item.action === "terms") {
      try {
        await Linking.openURL("https://www.unboundapp.live/terms-of-use");
      } catch (error) {
        console.error("Error opening terms:", error);
      }
    }
    if (item.action === "privacy") {
      try {
        await Linking.openURL("https://www.unboundapp.live/privacy-policy");
      } catch (error) {
        console.error("Error opening privacy policy:", error);
      }
    }
    if (item.action === "notifications") {
      try {
        if (Platform.OS === 'ios') {
          await Linking.openURL('app-settings:');
        } else {
          await Linking.openSettings();
        }
      } catch (error) {
        console.error("Error opening settings:", error);
      }
    }
    if (item.action === "testNotification") {
      try {
        await sendTestNotification();
        Alert.alert("Test Notification", "Local notification sent! Check if you received it.");
      } catch (error) {
        console.error("Error sending test notification:", error);
        Alert.alert("Error", "Failed to send test notification.");
      }
    }
  };

  const handleCommunityPress = async (item: typeof COMMUNITY[0]) => {
    if (item.action === "refer") {
      Share.share({
        message: "Try Unbound! Reclaim your time: https://yourapp.com/referral",
      });
      return;
    }
    if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Profile</Text>
        <Text style={styles.sectionTitle}>Community</Text>
        {COMMUNITY.map((item) => {
          if (item.action === "refer") {
            return (
              <Pressable
                key={item.label}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => handleCommunityPress(item)}
              >
                <Animated.View style={[styles.menuCard, { opacity: animatedValue }]}>
                  {item.icon}
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Feather name="chevron-right" size={22} color="#564110" style={{ marginLeft: "auto" }} />
                </Animated.View>
              </Pressable>
            );
          }
          return (
            <TouchableOpacity
              key={item.label}
              style={styles.menuCard}
              onPress={() => handleCommunityPress(item)}
            >
              {item.icon}
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Feather name="chevron-right" size={22} color="#564110" style={{ marginLeft: "auto" }} />
            </TouchableOpacity>
          );
        })}
        <Text style={styles.sectionTitle}>Account</Text>
        {ACCOUNT.map((item) => (
          <TouchableOpacity 
            key={item.label} 
            style={styles.menuCard} 
            onPress={() => handleAccountPress(item)}
          >
            {item.icon}
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Feather name="chevron-right" size={22} color="#564110" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
      <FounderModal visible={founderModalVisible} onClose={() => setFounderModalVisible(false)} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    padding: 0,
    paddingBottom: 32,
  },
  header: {
    fontSize: 35,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    top: SPACING.xl,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl * 1.35,
    textAlign: "left",
    marginLeft: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    marginBottom: SPACING.md,
    marginLeft: 24,
    textAlign: "left",
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9E7B0",
    borderRadius: SPACING.md,
    borderWidth: 1.5,
    borderColor: "#E6D3A7",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  menuLabel: {
    fontSize: 18,
    fontFamily: "Vollkorn-SemiBold",
    color: "#2C1A05",
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: "#4B3415",
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.md,
    marginHorizontal: 24,
  },
  logoutText: {
    color: "#fff",
    fontFamily: "Vollkorn-SemiBold",
    fontSize: 18,
  },
});
