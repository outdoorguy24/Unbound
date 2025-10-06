import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { scale, scaleVertical } from "@/constants/Scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
const { width } = Dimensions.get("window");


const NewPasswordSuccessScreen = () => {
  const insets = useSafeAreaInsets();
  const [buttonHeight, setButtonHeight] = useState(0);

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
        style={[styles.mainContainer, { top: insets.top + scaleVertical(16) }]}
      >

        <Image
          style={styles.icon}
          source={require("../../assets/new-images/password-updated.png")}
        />
        <Text style={styles.slogan}>Your password has been updated</Text>
        <Text style={styles.description}>
          You can now use it to sign in.
        </Text>
      </View>

        <View style={{position: 'absolute', bottom: insets.bottom + scaleVertical(16), width: '100%'}}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.btn]}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text style={styles.btnText}>Sign in</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#000" 
  },
  image: { width: "100%", height: width * 0.939 },
  overlayImage: { position: "absolute", width: "100%", height: "95%" },
  buttonBack: {
    backgroundColor: "#000",
    width: scale(40),
    aspectRatio: 1,
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: { 
    position: "absolute", 
    left: scale(24), 
    right: scale(24),
  },
  slogan: {
    marginTop: scale(24),
    color: "#FFF",
    fontSize: scale(32),
    fontFamily: "Cinzel-Regular",
    lineHeight: scale(44),
    textAlign: 'center',
  },
  description: {
    marginTop: scale(4),
    color: "rgba(255,255,255,0.7)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    textAlign: 'center',
  },
  btn: {
    backgroundColor: "#BE5E19",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scaleVertical(20),
    marginHorizontal: scale(24)
  },
  btn2: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scaleVertical(20),
    marginTop: scaleVertical(16), 
    marginHorizontal: scale(24)
  },
  btnText: { color: "#fff", fontSize: scale(18), fontFamily: "ZillaSlab-Bold" },
  icon: {
    marginTop: scaleVertical(40), 
    height: scale(100), 
    aspectRatio: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    alignSelf: 'center',
  }
});

export default NewPasswordSuccessScreen;