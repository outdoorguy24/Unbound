import { useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const WelcomeScreen = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/(auth)/signup");
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/welcome-screen.png")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Light gray overlay to reduce brightness */}
      <View style={styles.brightnessOverlay} />

      <View style={styles.content}>
        <Text style={styles.text}>Digital freedom starts here</Text>
      </View>

      {/* Black overlay background */}
      <View style={styles.overlay} />

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "80%",
  },
  brightnessOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // lightgray with 30% opacity
  },
  content: {
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginTop: 60,
  },
  text: {
    color: "#FFF",
    fontFamily: "Cinzel-Bold",
    fontSize: 45,
    lineHeight: 50,
    letterSpacing: 0.5,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 170, // increased height for better coverage
    backgroundColor: "black", // more opaque black overlay
  },
  bottomContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 24, // works in RN 0.71+. Otherwise, use marginTop on loginButton
  },
  getStartedButton: {
    width: "90%",
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#BE5E19",
  },
  getStartedText: {
    color: "#FFF",
    fontFamily: "Zilla-Slab-Bold",
    fontSize: 16,
    textAlign: "center",
  },
  loginButton: {
    width: "90%",
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.20)",
  },
  loginText: {
    color: "#FFF",
    fontFamily: "Zilla-Slab-Bold",
    fontSize: 16,
  },
});
