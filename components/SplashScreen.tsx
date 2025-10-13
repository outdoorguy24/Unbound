import { scale } from "@/constants/Scale";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const [displayedText, setDisplayedText] = useState("");
  const [showTagline, setShowTagline] = useState(false);
  
  const fullText = "UNBOUND";

  useEffect(() => {
    // Start typewriter effect
    let currentIndex = 0;
    const typewriterInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typewriterInterval);
        // Show tagline 1 second after typewriter completes
        setTimeout(() => {
          setShowTagline(true);
          // Fade in tagline over 0.5 seconds
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            // Show for 1 second, then fade out
            setTimeout(() => {
              Animated.timing(taglineOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
              }).start();
            }, 1000);
          });
        }, 1000);
      }
    }, 300); // 300ms delay between letters

    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    }).start(() => {
      // Stay for 3.8 seconds to allow all animations to complete, then fade out
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }, 2000); //2000

      //TODO: FOR TESTING
      
    });

    // Cleanup interval on unmount
    return () => {
      clearInterval(typewriterInterval);
    };
  }, [onFinish, opacity, fullText]);

  return (
    <Animated.View style={[{ opacity }]}>
      <Image source={require("../assets/new-images/splash-screen.png")} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.slogan}>
          {displayedText}
        </Text>
        {showTagline && (
          <Animated.Text style={[styles.slogan2, { opacity: taglineOpacity }]}>
            {'You were born\nto do more\nthan scroll'}
          </Animated.Text>
        )}
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
