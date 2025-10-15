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

const Screen13 = ({ isActive }: { isActive?: boolean }) => {
  // Animation values - Option 2: Soft Slide-Up with Fade
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    // Only run animations when screen is active
    if (!isActive) return;
    
    // Option 2: Soft slide-up with fade
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  return (
    <View style={styles.safe}>
      <Image source={require("../../assets/new-images/onboarding-screen-13.png")} style={styles.image} />
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
          {'with unbound you get community & accountability'}
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
    height: height < 700 ? '65%' : '61%',
    width: '100%',
  },

  overlayImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: "absolute",
    top: height < 700 ? height * 0.66 : height * 0.64,
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

export default Screen13;