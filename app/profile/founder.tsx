import { SPACING } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ImageBackground, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FounderScreen() {
  const router = useRouter();
  return (
    <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <View style={styles.backCircle}>
            <Feather name="arrow-left" size={22} color="#F9E7B0" />
          </View>
        </TouchableOpacity>
        <Text style={styles.header}>Talk with the Founder</Text>
      </View>
      <View style={styles.content}>
        <Image source={require("../../assets/images/founder.png")} style={styles.founderImg} />
        <Text style={styles.intro}>
          I&rsquo;m <Text style={styles.name}>Alex</Text>, the founder of Unbound.
        </Text>
        <Text style={styles.body}>
          This picture makes my beard and hairline look way better than it is, but I&rsquo;ll take it. I built Unbound
          because with a young family and plenty of goals, I was done watching my time disappear into a screen.
          I&rsquo;m glad you&rsquo;re here & would love to hear from you.
        </Text>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            Feel free to <Text style={styles.messageHighlight}>send me your best joke</Text>, suggest a feature, or give
            feedback.
          </Text>
        </View>
        <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL("sms:+1234567890")}>
          <Image source={require("../../assets/images/message.png")} style={styles.actionIcon} />
          <Text style={styles.actionBtnText}>Send a Text</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { marginTop: 18 }]}
          onPress={() => Linking.openURL("mailto:alex@unboundapp.com")}
        >
          <Image source={require("../../assets/images/email.png")} style={styles.actionIcon} />
          <Text style={styles.actionBtnText}>Email Me</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
  founderImg: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginVertical: 12,
  },
  intro: {
    fontSize: 20,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    textAlign: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  name: {
    color: "#3D7A4C",
    fontFamily: "Vollkorn-Bold",
  },
  body: {
    fontSize: 18,
    fontFamily: "Vollkorn-SemiBold",
    color: "#2C1A05",
    textAlign: "center",
    marginBottom: SPACING.md,
    marginTop: 0,
    lineHeight: 26,
  },
  messageBox: {
    backgroundColor: "#F9E7B0",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E6D3A7",
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 24,
    marginTop: 0,
    width: "100%",
  },
  messageText: {
    fontSize: 17,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    textAlign: "center",
  },
  messageHighlight: {
    color: "#3D7A4C",
    fontFamily: "Vollkorn-Bold",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3D7A4C",
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginTop: 0,
    width: "100%",
    justifyContent: "center",
  },
  actionIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 14,
    tintColor: "#F9E7B0",
  },
  actionBtnText: {
    color: "#F9E7B0",
    fontFamily: "Vollkorn-Bold",
    fontSize: 18,
    textAlign: "center",
  },
});
