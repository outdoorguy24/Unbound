import { useEffect, useRef } from "react";
import { Animated, Dimensions, ImageBackground, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export default function Screen11({ onFinish }: { onFinish: () => void }) {
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
          if (onFinish) onFinish();
        });
      }, 3000);
    });
  }, [onFinish, opacity]);

  return (
    <Animated.View style={[styles.container, { opacity }]}> 
      <ImageBackground
        source={require("../../assets/images/onboarding/fisherman.png")}
        style={styles.background}
        resizeMode="cover"
      />
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
    zIndex: 9999,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
