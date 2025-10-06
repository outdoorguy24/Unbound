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

const Screen16 = () => {
  
  return (
    <View style={styles.safe}>
      <Image source={require("../../assets/new-images/onboarding-screen-16.png")} style={styles.image} />
      <Image source={require("../../assets/new-images/onboarding-overlay-bottom.png")} style={styles.overlayImage} />
      
      <View style={styles.textContainer}>
        <Text style={styles.slogan}>
          {'UNBOUND will supercharge your ability to focus'}
        </Text>
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
    height: height - scale(152),
    width: '100%',
    marginTop: scale(152),
  },

  overlayImage: {
    position: 'absolute',
    width: '100%',
    height: height - (height < 700 ? scale(20) : scale(20)),
    bottom: height < 700 ? scale(60) : scale(70),
  },
  textContainer: {
    position: "absolute",
    top: height < 700 ? height * 0.07 : height * 0.13,
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

export default Screen16;