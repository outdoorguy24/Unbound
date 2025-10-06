import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { scale, scaleVertical } from '@/constants/Scale';

const { height } = Dimensions.get("window");

const Screen19 = () => {
  
  return (
    <View style={styles.safe}>
      <Image source={require("../../assets/new-images/onboarding-screen-19.png")} style={styles.image} />
      {/* <Image source={require("../../assets/new-images/onboarding-overlay.png")} style={styles.overlayImage} /> */}
      
      <View style={styles.textContainer}>
        <Text style={styles.slogan}>
          {'It’s time to\nget your\nlife back'}
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