import { scale } from "@/constants/Scale";
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
      }, 2000); //2000

      //TODO: FOR TESTING
      
    });
  }, [onFinish, opacity]);

  return (
    <Animated.View style={[{ opacity }]}>
      <Image source={require("../assets/new-images/splash-screen.png")} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.slogan}>
          {'UNBOUND'}
        </Text>
        <Text style={styles.slogan2}>
          {'You were born\nto do more\nthan scroll'}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: width,
    height: height,
  },
  textContainer: {
    position: "absolute",
    top: height * 0.43,
    width: "100%",
    alignItems: "center",
  },
  slogan: {
    color: "#000",
    fontSize: scale(55),
    textAlign: "center",
    fontFamily: "Cinzel-Black",
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  slogan2: {
    color: "#000",
    fontSize: scale(24),
    lineHeight: scale(28),
    textAlign: "center",
    fontFamily: "Cinzel-Bold",
    letterSpacing: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    marginHorizontal: scale(65),
  },
});
