import { scale, scaleVertical } from '@/constants/Scale';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

const { height } = Dimensions.get("window");

const Screen19 = ({ isActive }: { isActive?: boolean }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  const fullText = "It's time to\nget your\nlife back";

  useEffect(() => {
    // Only run typewriter effect when screen is active
    if (!isActive) return;
    
    let typewriterInterval: any = null;
    
    // Wait 0.5 seconds before starting typewriter effect
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
        }
      }, 80); // 80ms delay between characters (slower than splash for readability)
    }, 500); // 0.5 second delay before starting

    // Cleanup intervals on unmount
    return () => {
      clearTimeout(startTimeout);
      if (typewriterInterval) {
        clearInterval(typewriterInterval);
      }
    };
  }, [isActive, fullText]);

  return (
    <View style={styles.safe}>
      <Image source={require("../../assets/new-images/onboarding-screen-19.png")} style={styles.image} />
      {/* <Image source={require("../../assets/new-images/onboarding-overlay.png")} style={styles.overlayImage} /> */}
      
      <View style={styles.textContainer}>
        <Text style={styles.slogan}>
          {displayedText}
        </Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#000',
    alignItems: "center",
  },
  image: {
    height: '100%',
    width: '100%',
  },
  textContainer: {
    position: "absolute",
    top: scale(90),
    marginHorizontal: scale(24),
  },
  slogan: {
    color: "#000",
    fontSize: scale(50),
    textAlign: "center",
    fontFamily: "Cinzel-Bold",
    letterSpacing: 0.5,
    lineHeight: scale(60),
    textShadowColor: "#00000040",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  slogan2: {
    color: "#FFF",
    fontSize: scale(20),
    opacity: 0.7,
    textAlign: "center",
    fontFamily: "ZillaSlab-Regular",
    letterSpacing: 0.5,
    marginTop: scaleVertical(10),
  },
});

export default Screen19;