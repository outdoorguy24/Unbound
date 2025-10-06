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

const Screen2 = () => {
  
  return (
    <View style={styles.safe}>
      <Image source={require("../../assets/new-images/onboarding-screen-2.png")} style={styles.image} />
      <Image source={require("../../assets/new-images/onboarding-overlay.png")} style={styles.overlayImage} />
      
      <View style={styles.textContainer}>
        <Text style={styles.slogan}>
          {'phone use is stealing your potential'}
        </Text>
        <Text style={styles.slogan2}>
          {'With every swipe, corporations harvest your attention for profit while that promotion, workout, or relationship is put on hold'}
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

export default Screen2;