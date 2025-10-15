import { scale, scaleVertical } from '@/constants/Scale';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    StyleSheet,
    View
} from 'react-native';

const { height } = Dimensions.get("window");

const Screen1 = ({ isActive }: { isActive?: boolean }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const slideAnim2 = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Only run animations when screen is active
    if (!isActive) return;
    // First animation: Main headline
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Second animation: Body text (staggered)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim2, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 400); // 400ms delay after first animation starts
  }, [isActive]);

  return (
    <View style={styles.safe}>
      <Image source={require("../../assets/new-images/onboarding-screen-1.png")} style={styles.image} />
      <Image source={require("../../assets/new-images/onboarding-overlay.png")} style={styles.overlayImage} />
      
      <View style={styles.textContainer}>
        <Animated.Text 
          style={[
            styles.slogan,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {'you come from men who built things '}
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.slogan2,
            {
              opacity: fadeAnim2,
              transform: [{ translateY: slideAnim2 }],
            }
          ]}
        >
          {'Men who hunted on open plains & told stories next to a fire under a blanket of stars. The world has changed, but your genetics haven\'t.'}
        </Animated.Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  image: {
    height: '75%',
    width: '100%',
  },

  overlayImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: "absolute",
    top: height < 700 ? height * 0.61 : height * 0.59,
    alignItems: "center",
    marginHorizontal: scale(24),
  },
  slogan: {
    color: "#FFF",
    fontSize: scale(25),
    textAlign: "center",
    fontFamily: "Cinzel-Bold",
    letterSpacing: 0.5,
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

export default Screen1;