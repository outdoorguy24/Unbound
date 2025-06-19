import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { SPACING } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <View style={styles.backCircle}>
            <Feather name="arrow-left" size={22} color="#F9E7B0" />
          </View>
        </TouchableOpacity>
        <Text style={styles.header}>Privacy Policy</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>
          [Placeholder] Your privacy is important to us. This is where the privacy policy will go.
        </Text>
        {/* TODO: Replace with real privacy policy */}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  content: {
    padding: 16,
  },
  text: {
    fontSize: 15,
    color: "#2C1A05",
  },
});
