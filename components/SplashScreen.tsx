import { scale } from "@/constants/Scale";
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const [displayedText, setDisplayedText] = useState("");
  const [displayedTagline, setDisplayedTagline] = useState("");
  const [showTagline, setShowTagline] = useState(false);

  const fullText = "UNBOUND";
  const fullTagline = "You were born\nto do more\nthan scroll";

  useEffect(() => {
    let typewriterInterval: NodeJS.Timeout | null = null;
    
    // Wait 0.5 seconds before starting typewriter effect for "UNBOUND"
    const startTimeout = setTimeout(() => {
      let currentIndex = 0;
      typewriterInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.substring(0, currentIndex + 1));
          
          // Add haptic feedback for each letter (except spaces and line breaks)
          const currentChar = fullText[currentIndex];
          if (currentChar !== ' ' && currentChar !== '\n') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          
          currentIndex++;
        } else {
          if (typewriterInterval) {
            clearInterval(typewriterInterval);
            typewriterInterval = null;
          }
          // Start tagline typewriter effect 0.5 seconds after "UNBOUND" completes
          setTimeout(() => {
            setShowTagline(true);
            // Set tagline opacity to 1 when starting
            taglineOpacity.setValue(1);
            startTaglineTypewriter();
          }, 500);
        }
      }, 240); // 240ms delay between letters (20% faster)
    }, 500); // 0.5 second delay before starting

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
          duration: 2200, // Increased fade out duration
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }, 3800); // Increased hold time
    });

    // Cleanup intervals on unmount
    return () => {
      clearTimeout(startTimeout);
      if (typewriterInterval) {
        clearInterval(typewriterInterval);
      }
    };
  }, [onFinish, opacity, fullText]);

  const startTaglineTypewriter = () => {
    console.log('Starting tagline typewriter effect');
    let currentIndex = 0;
    const taglineInterval = setInterval(() => {
      if (currentIndex < fullTagline.length) {
        setDisplayedTagline(fullTagline.substring(0, currentIndex + 1));
        
        // Add haptic feedback for each letter (except spaces and line breaks)
        const currentChar = fullTagline[currentIndex];
        if (currentChar !== ' ' && currentChar !== '\n') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        
        console.log('Tagline progress:', currentIndex + 1, '/', fullTagline.length);
        currentIndex++;
      } else {
        clearInterval(taglineInterval);
        console.log('Tagline typewriter complete');
        // Keep tagline visible throughout the entire fade-out
      }
    }, 40); // 40ms delay between characters for tagline (20% faster)
  };

  return (
    <Animated.View style={[{ opacity }]}>
      <Image source={require("../assets/new-images/splash-screen.png")} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.slogan}>
          {displayedText}
        </Text>
        {showTagline && (
          <Animated.Text style={[styles.slogan2, { opacity: taglineOpacity }]}>
            {displayedTagline}
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
