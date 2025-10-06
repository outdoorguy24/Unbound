import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { scale, scaleVertical } from "@/constants/Scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const TermsOfUseScreen = () => {
  const insets = useSafeAreaInsets();

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

      <View
        style={[
          styles.mainContainer,
          {
            marginTop: insets.top + scaleVertical(16),
          },
        ]}
      >
        <View
          style={styles.headerView}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.slogan}>{"Terms of use"}</Text>
            <TouchableOpacity
              style={styles.buttonBack}
              activeOpacity={0.8}
              onPress={() => router.back()}
            >
              <Image
                source={require("../../assets/new-images/icon-back.png")}
                style={{
                  height: scale(20),
                  width: scale(20),
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView
          style={[styles.keyboard, {marginTop: scaleVertical(16), marginBottom: insets.bottom + scaleVertical(16)}]}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text style={{
              color: "#FFF",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Bold",
              letterSpacing: 0.5,
              lineHeight: scale(22),
          }}>
            {"1. Introduction"}
          </Text>

          <Text style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Regular",
              letterSpacing: 0.5,
              marginTop: scaleVertical(24),
              lineHeight: scale(22),
          }}>
            {"This is how the trail works.\nBy using Unbound, you agree to follow the terms outlined below. These are here to protect both you and us, and to make sure everything runs fairly, clearly, and respectfully."}
          </Text>

          <Text style={{
              color: "#FFF",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Bold",
              letterSpacing: 0.5,
              marginTop: scaleVertical(24),
              lineHeight: scale(22),
          }}>
            {"2. Who can use Unbound"}
          </Text>

          <Text style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Regular",
              letterSpacing: 0.5,
              marginTop: scaleVertical(24),
              lineHeight: scale(22),
          }}>
            {"You must be at least 16 years old to use Unbound. By creating an account, you confirm that:\n\nYou are legally able to enter into this agreement.\n\nThe information you provide is accurate and up to date."}
          </Text>

          <Text style={{
              color: "#FFF",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Bold",
              letterSpacing: 0.5,
              marginTop: scaleVertical(24),
              lineHeight: scale(22),
          }}>
            {"3. Your Account"}
          </Text>

          <Text style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Regular",
              letterSpacing: 0.5,
              marginTop: scaleVertical(24),
              lineHeight: scale(22),
          }}>
            {"You’re responsible for:\n\nKeeping your login credentials secure.\n\nAll activity that happens under your account.\n\nIf you believe someone has accessed your account without permission, let us know immediately."}
          </Text>

          <Text style={{
              color: "#FFF",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-SemiBold",
              letterSpacing: 0.5,
              marginTop: scaleVertical(24),
              lineHeight: scale(22),
          }}>
            {"4. Acceptable Use"}
          </Text>

          <Text style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Regular",
              letterSpacing: 0.5,
              marginTop: scaleVertical(24),
              lineHeight: scale(22),
          }}>
            {"You agree to use Unbound only for personal, lawful purposes. Don’t:\n\nTry to hack, reverse engineer, or misuse the platform.\n\nShare or sell access to your account.\n\nUse Unbound to spread harmful, abusive, or misleading content."}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    position: "absolute",
    width: "100%",
    height: width * 0.939,
  },
  overlayImage: {
    position: "absolute",
    width: "100%",
    height: "95%",
  },
  buttonBack: {
    backgroundColor: "#000",
    width: scale(40),
    aspectRatio: 1,
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    width: '100%',
  },
  slogan: {
    position: 'absolute',
    color: "#FFF",
    fontSize: scale(22),
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
    width: '100%',
    textAlign: 'center',
  },
  headerView: {
    width: '100%',
    paddingHorizontal: scale(24),
  },
  keyboard: {
    flex: 1,
    width: '100%',
    paddingHorizontal: scale(16),
    paddingTop: scaleVertical(40),
  },
});

export default TermsOfUseScreen;