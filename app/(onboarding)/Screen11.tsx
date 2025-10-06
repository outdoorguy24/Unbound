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

const Screen11 = () => {
  
  return (
    <View style={styles.safe}>
      <Image source={require("../../assets/new-images/onboarding-screen-11.png")} style={styles.image} />
      <Image source={require("../../assets/new-images/onboarding-overlay.png")} style={styles.overlayImage} />
      
      <View style={styles.textContainer}>
        <Text style={styles.slogan}>
          {'so Unbound blocks distracting apps, websites, and porn with '}
        <Text style={styles.underline}>
          {'zero'}
        </Text>
        <Text style={styles.slogan}>
          {' workarounds'}
        </Text>
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
    height: '65%',
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
    top: height * 0.62,
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
  underline: {
    color: "#FFF",
    fontSize: scale(25),
    textAlign: "center",
    fontFamily: "Cinzel-Bold",
    letterSpacing: 0.5,
    textDecorationLine: "underline",
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

export default Screen11;