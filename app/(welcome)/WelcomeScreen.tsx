import { useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WelcomeGradient from "./components/WelcomeGradient";

const WelcomeScreen = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    console.log("🚀 WelcomeScreen: Get Started button pressed");
    router.replace("/(onboarding)/carousel");
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/welcome-screen.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.brightnessOverlay} />
        <View style={styles.content}>
          <Text style={styles.text}>Digital freedom starts here</Text>
        </View>
      </ImageBackground>
      
      <View style={styles.gradientContainer}>
        <WelcomeGradient />
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    width: "100%",
    height: "90%",
  },
  brightnessOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
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
  gradientContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
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
