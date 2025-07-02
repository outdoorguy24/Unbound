import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { sendTestNotification } from "@/utils/notifications";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as Notifications from 'expo-notifications';
import { useRouter } from "expo-router";
import * as StoreReview from 'expo-store-review';
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, ImageBackground, Linking, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FounderModal from "../components/FounderModal";

type AccountItem = {
  label: string;
  icon: React.ReactNode;
  action?: string;
  route?: string;
};
const ACCOUNT: AccountItem[] = [
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
    label: "Weekly Summary Notifications",
    icon: <Feather name="bar-chart-2" size={24} color="#564110" style={{ marginRight: 16 }} />,
    action: "weeklyNotifications",
  },
];

type CommunityItem = {
  label: string;
  icon: React.ReactNode;
  action?: string;
  route?: string;
};
const COMMUNITY: CommunityItem[] = [
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
];

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [founderModalVisible, setFounderModalVisible] = useState(false);
  const [weeklyNotificationsEnabled, setWeeklyNotificationsEnabled] = useState(true);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const animatedValue = useRef(new Animated.Value(1)).current;

  // Load user's notification preferences
  useEffect(() => {
    const loadNotificationPreferences = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('notification_preferences')
          .eq('user_id', user.id)
          .single();
        
        if (!error && data?.notification_preferences) {
          setWeeklyNotificationsEnabled(data.notification_preferences.weekly_summary ?? true);
        }
      } catch (error) {
        console.error('Error loading notification preferences:', error);
      }
    };
    
    loadNotificationPreferences();
  }, [user?.id]);

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
    if (item?.route) {
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
    if (item.action === "weeklyNotifications") {
      const newValue = !weeklyNotificationsEnabled;

      // If user is trying to ENABLE notifications, check for permission first
      if (newValue === true) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Enable Notifications',
            'To receive weekly summaries, please enable push notifications for Unbound in your phone\'s settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
          return; // Don't update the toggle state or database
        }
      }

      // If we're here, either they are disabling notifications, or they have permission
      setWeeklyNotificationsEnabled(newValue);
      
      // Update in database
      if (user?.id) {
        supabase
          .from('user_profiles')
          .update({ 
            notification_preferences: { weekly_summary: newValue }
          })
          .eq('user_id', user.id)
          .then(({ error }) => {
            if (error) {
              console.error('Error updating notification preferences:', error);
              Alert.alert('Error', 'Failed to update notification preferences');
              setWeeklyNotificationsEnabled(!newValue); // Revert on error
            } else {
              Alert.alert(
                'Updated', 
                `Weekly summary notifications ${newValue ? 'enabled' : 'disabled'}`
              );
            }
          });
      }
    }
  };

  const handleCommunityPress = async (item: typeof COMMUNITY[0]) => {
    if (item?.route) {
      router.push(item.route);
    }
    if (item.action === "review") {
      try {
        if (await StoreReview.hasAction()) {
          await StoreReview.requestReview();
        }
      } catch (error) {
        console.error("Error requesting review:", error);
      }
    }
    if (item.action === "refer") {
      try {
        await Share.share({
          message: "Check out Unbound, the app that helps you reclaim your focus: https://www.unboundapp.live/",
        });
      } catch (error) {
        console.error("Error sharing:", error);
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

  return (
    <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg}>
      <ScreenContainer style={{ backgroundColor: 'transparent', paddingHorizontal: 0, paddingTop: 0 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.header} numberOfLines={1}>Profile</Text>
          <Text style={styles.sectionTitle} numberOfLines={1}>Community</Text>
          {COMMUNITY.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuCard}
              onPress={() => handleCommunityPress(item)}
              onPressIn={item.action === "refer" ? handlePressIn : undefined}
              onPressOut={item.action === "refer" ? handlePressOut : undefined}
            >
              {item.icon}
              <Text style={styles.menuLabel} numberOfLines={1}>{item.label}</Text>
              <Feather name="chevron-right" size={22} color="#564110" style={{ marginLeft: "auto" }} />
            </TouchableOpacity>
          ))}
          <Text style={styles.sectionTitle} numberOfLines={1}>Account</Text>
          {ACCOUNT.map((item) => (
            <TouchableOpacity 
              key={item.label} 
              style={styles.menuCard} 
              onPress={() => handleAccountPress(item)}
              activeOpacity={item.action === "weeklyNotifications" ? 1 : 0.2}
            >
              <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                {item.icon}
                <Text style={styles.menuLabel} numberOfLines={1}>{item.label}</Text>
              </View>
              
              {item.action === "weeklyNotifications" ? (
                <View style={[styles.toggle, weeklyNotificationsEnabled && styles.toggleActive]}>
                  <Animated.View style={[styles.toggleThumb, weeklyNotificationsEnabled && styles.toggleThumbActive]} />
                </View>
              ) : (
                <Feather name="chevron-right" size={22} color="#564110" />
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText} numberOfLines={1}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
        <FounderModal visible={founderModalVisible} onClose={() => setFounderModalVisible(false)} />
      </ScreenContainer>
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
    justifyContent: "space-between",
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
    flexShrink: 1,
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
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "#564110",
    backgroundColor: "#E6D3A7",
    justifyContent: "center",
    padding: 2,
  },
  toggleActive: {
    backgroundColor: "#265C28",
    borderColor: "#265C28",
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
});
