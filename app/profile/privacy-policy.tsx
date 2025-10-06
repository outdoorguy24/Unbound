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
            <Text style={styles.slogan}>{"Privacy and Policy"}</Text>
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
            {"1. Your Privacy Matters"}
          </Text>

          <Text style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Regular",
              letterSpacing: 0.5,
              marginTop: scaleVertical(24),
              lineHeight: scale(22),
          }}>
            {"We built Unbound to help you reclaim your time — not to take your data. This Privacy Policy explains what we collect, how we use it, and how we keep it safe."}
          </Text>

          <Text style={{
              color: "#FFF",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Bold",
              letterSpacing: 0.5,
              marginTop: scaleVertical(24),
              lineHeight: scale(22),
          }}>
            {"2. What We Collect"}
          </Text>

          <Text style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Regular",
              letterSpacing: 0.5,
              marginTop: scaleVertical(24),
              lineHeight: scale(22),
          }}>
            {"  • Account info: your name, email, or phone number (if you sign up with one).\n\n  • Usage data: how you interact with the app (e.g., session length, features used).\n\n  • Device info: basic data like device model, OS, and language settings"}
          </Text>

          <Text style={{
              color: "#FFF",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Bold",
              letterSpacing: 0.5,
              marginTop: scaleVertical(24),
              lineHeight: scale(22),
          }}>
            {"3. What We Don’t Collect"}
          </Text>

          <Text style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Regular",
              letterSpacing: 0.5,
              marginTop: scaleVertical(24),
              lineHeight: scale(22),
          }}>
            {"  • Your exact location\n\n  • Your contacts, photos, or files\n\n  • Sensitive personal identifiers (like social security numbers)\n\nWe also do not sell or trade your data — ever."}
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