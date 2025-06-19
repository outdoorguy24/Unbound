import { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
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
      <Image source={require("../assets/images/splash-screen.png")} style={styles.image} resizeMode="contain" />
      <View style={styles.textContainer}>
        <Text style={styles.slogan}>
          YOU WERE BORN{"\n"}TO DO MORE{"\n"}THAN SCROLL
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "#2C1A05",
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
  },
  textContainer: {
    position: "absolute",
    bottom: height * 0.2,
    width: "100%",
    alignItems: "center",
  },
  slogan: {
    color: "#BE6108",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Vollkorn-Bold",
    letterSpacing: 1,
  },
});
