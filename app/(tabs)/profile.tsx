import { SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { registerForPushNotificationsAsync, sendTestNotification } from "@/utils/notifications";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ImageBackground, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity } from "react-native";

const SETTINGS = [
  {
    label: "Weekly Summary",
    icon: <Feather name="calendar" size={24} color="#564110" style={{ marginRight: 16 }} />,
    route: "/profile/weekly-summary",
  },
  {
    label: "Privacy Policy",
    icon: <Feather name="lock" size={24} color="#564110" style={{ marginRight: 16 }} />,
    route: "/profile/privacy-policy",
  },
];
const ACCOUNT = [
  {
    label: "Export Data",
    icon: <Feather name="download" size={24} color="#564110" style={{ marginRight: 16 }} />,
    route: "/profile/export-data",
  },
  {
    label: "Delete Account",
    icon: <Feather name="trash-2" size={24} color="#564110" style={{ marginRight: 16 }} />,
    route: "/profile/delete-account",
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
];

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  return (
    <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Profile</Text>
        <Text style={styles.subtitle}>All the fun stuff</Text>
        <Text style={styles.sectionTitle}>Settings</Text>
        {SETTINGS.map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuCard} onPress={() => router.push(item.route)}>
            {item.icon}
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Feather name="chevron-right" size={22} color="#564110" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>
        ))}
        <Text style={styles.sectionTitle}>Account</Text>
        {ACCOUNT.map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuCard} onPress={() => router.push(item.route)}>
            {item.icon}
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Feather name="chevron-right" size={22} color="#564110" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>
        ))}
        <Text style={styles.sectionTitle}>Community</Text>
        {COMMUNITY.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuCard}
            onPress={async () => {
              if (item.route) router.push(item.route);
              if (item.action === "review") {
                const url =
                  Platform.OS === "ios"
                    ? "https://apps.apple.com/app/idYOUR_APP_ID"
                    : "https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME";
                Share.share({ message: url });
              }
              if (item.action === "refer") {
                Share.share({
                  message: "Try Unbound! Reclaim your time: https://yourapp.com/referral",
                });
              }
            }}
          >
            {item.icon}
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Feather name="chevron-right" size={22} color="#564110" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        {/* DEV-ONLY: Push notification test button */}
        {__DEV__ && (
          <>
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: "#F7E0A3", marginTop: SPACING.md }]}
              onPress={registerForPushNotificationsAsync}
            >
              <Text style={[styles.logoutText, { color: "#4B3415" }]}>Register for Push Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: "#F7E0A3", marginTop: SPACING.md }]}
              onPress={sendTestNotification}
            >
              <Text style={[styles.logoutText, { color: "#4B3415" }]}>Send Test Notification</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
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
    marginBottom: SPACING.sm,
    textAlign: "left",
    marginLeft: 24,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Vollkorn-SemiBold",
    color: "#2C1A05",
    marginBottom: 32,
    marginTop: SPACING.xl,
    marginLeft: 24,
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    marginTop: SPACING.sm,
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
