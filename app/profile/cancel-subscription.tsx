import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { height, scale, scaleVertical } from "@/constants/Scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const CancelSubscriptionScreen = () => {
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
            <Text style={styles.slogan}>{"Cancel Subscription"}</Text>
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
          style={styles.keyboard}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text style={{
              color: "rgba(255, 255, 255, 1)",
              fontSize: scale(20),
              fontFamily: "ZillaSlab-Regular",
              letterSpacing: 0.5,
              lineHeight: scale(24),
            }}>
              {"Your focus journey doesn’t have to end here.\n\nAre you sure you want to cancel and lose your premium benefits?"}
          </Text>
        </ScrollView>

        <View style={{
          marginHorizontal: scale(24),
          marginBottom: insets.bottom + scaleVertical(16),
        }}>
          <TouchableOpacity
            style={[
              styles.primaryBtn,
            ]}
            onPress={async () => {
              
            }}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryText}>{"Keep subscription"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[{
              flexDirection: "row",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#FD4949",
              marginTop: scaleVertical(16),
              marginBottom: scaleVertical(16)
            }]}
            activeOpacity={0.8}
          >
            <View style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}>
              <View style={{
                flex: 1,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Text style={[{
                  color: "#FD4949",
                  fontSize: scale(18),
                  fontFamily: "ZillaSlab-SemiBold",
                  letterSpacing: 0,
                  paddingVertical: scaleVertical(18),
                }]}>
                  {"Cancel subscription"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: scale(24),
    marginTop: scaleVertical(40),
  },
  primaryBtn: {
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(20),
    width: '100%',
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
});

export default CancelSubscriptionScreen;