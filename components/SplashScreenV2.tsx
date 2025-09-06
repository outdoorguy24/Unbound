import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreenV2({ onFinish }: { onFinish: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;

 useEffect(() => {
    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    }).start(() => {
      // Stay for 4 seconds, then fade out
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }, 4000);
    });
  }, [onFinish, opacity]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <ImageBackground
        source={require("../assets/images/splash-screen-v2.png")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Centered text image */}
        <Animated.View
          style={{
            position: "absolute",
            top: height / 2 - 60, // force center vertically
            left: width / 2 - 60, // force center horizontally
            width: 200,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/images/splash-screen-text.png")}
            style={{
              width: 250,
              height: 150,
              resizeMode: "contain",
            }}
          />
        </Animated.View>

        {/* Gradient overlay ON TOP of background but BELOW the center image */}
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)", "#000"]}
          locations={[0.4, 0.75, 1]}
          style={styles.gradient}
        />
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: width * 1.2, // zoom in by 20%
    height: height * 1.4, // zoom in by 20%
    marginLeft: -(width * 0.1), // re-center horizontally
    marginTop: -(height * 0.1), // re-center vertically
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.6, // was 0.4 → more coverage
    zIndex: 0, // keep below image
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  centerImage: {
    width: width * 0.7,
    height: width * 0.25, // give it a height instead of undefined
    resizeMode: "contain",
  },
});
