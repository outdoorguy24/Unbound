import { SPACING } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TermsScreen() {
  const router = useRouter();
  return (
    <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <View style={styles.backCircle}>
            <Feather name="arrow-left" size={22} color="#F9E7B0" />
          </View>
        </TouchableOpacity>
        <Text style={styles.header}>Terms & Conditions</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms & Conditions</Text>
        
        <Text style={styles.paragraph}>
          These terms and conditions apply to the Unbound app (hereinafter referred to as "Application") for mobile devices
          that was created by Unbound App LLC (hereinafter referred to as "Service Provider") as a Freemium service.
        </Text>

        <Text style={styles.paragraph}>
          By downloading or using the Application, you agree to these terms. Unauthorized copying, modification,
          reverse-engineering, or derivative creation of the Application is prohibited. All intellectual property rights
          remain with the Service Provider.
        </Text>

        <Text style={styles.sectionTitle}>Usage & App Functionality</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining access and security of your device. The Application provides screen time
          management and content blocking features that may affect your device's functionality and access to certain
          applications or websites.
        </Text>

        <Text style={styles.listTitle}>By using the Application, you acknowledge and agree to the following:</Text>
        <Text style={styles.listItem}>• The Application may install and configure VPN and/or device management profiles</Text>
        <Text style={styles.listItem}>• Jailbreaking or rooting your device is strongly discouraged</Text>
        <Text style={styles.listItem}>• The Application may prevent the installation or use of certain apps during blocking periods</Text>
        <Text style={styles.listItem}>• You are responsible for any consequences of missed notifications</Text>

        <Text style={styles.sectionTitle}>Screen Time Management & Blocking Features</Text>
        <Text style={styles.paragraph}>
          The Application's core functionality includes content and application blocking, screen time tracking and management,
          schedule-based restrictions, and adult content filtering.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or suggestions about the Terms and Conditions, please contact us at:
          howdy@unboundapp.live
        </Text>

        <View style={styles.bottomSpacing} />
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.xxxl,
    marginBottom: 0,
    paddingHorizontal: 18,
  },
  backBtn: {
    padding: 0,
    marginRight: 16,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#564110",
    borderWidth: 1.5,
    borderColor: "#E6D3A7",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 27,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    textAlign: "left",
    flex: 1,
    marginLeft: SPACING.sm,
  },
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: 24,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: "Vollkorn-Regular",
    color: "#2C1A05",
    marginBottom: SPACING.md,
    lineHeight: 24,
  },
  listTitle: {
    fontSize: 16,
    fontFamily: "Vollkorn-SemiBold",
    color: "#2C1A05",
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  listItem: {
    fontSize: 16,
    fontFamily: "Vollkorn-Regular",
    color: "#2C1A05",
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.md,
    lineHeight: 24,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
}); 