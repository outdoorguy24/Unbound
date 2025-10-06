import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { scale, scaleVertical } from "@/constants/Scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const { width } = Dimensions.get("window"); 

const SavedFocusSessionScreen = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.safe}>
      <Image
        source={require("../../../assets/new-images/onboarding-screen-4.png")}
        style={styles.image}
      />
      <Image
        source={require("../../../assets/new-images/onboarding-overlay-full.png")}
        style={styles.overlayImage}
      />
      <Image
        source={require("../../../assets/new-images/doing-great-bg.png")}
        style={styles.doingGreatImage}
      />


      <View style={[styles.mainContainer, { marginTop: insets.top + scaleVertical(100) }]}>  

        <Text style={styles.slogan}>SCHEDULE SAVED</Text>
        <Text style={styles.description}>{"Your block is setup and ready to roll.\nNow get outside and live a little."}</Text>

        <View style={{
          top: 0,
                  justifyContent: 'center', position: 'absolute', bottom: 0, left: 0, right: 0
                  }}>
      <TouchableOpacity
       style={[
         styles.primaryBtn,
         //  {marginBottom: insets.bottom + scaleVertical(17)}
         {marginTop: -scaleVertical(24)}
        ]}
        onPress={() => {
          router.navigate('/defend')
        }}
        activeOpacity={0.9}
        >
        <Text style={styles.primaryText}>{"Go to Dashboard"}</Text>
        </TouchableOpacity>
          </View>
      </View>

 

    </View>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#000" 
  },
  image: { 
    position: "absolute", 
    width: "100%", 
    height: width * 0.939
  },
  doingGreatImage: { 
    position: "absolute",
    width: "100%", 
    height: "100%" 
  },
  overlayImage: { 
    position: "absolute",
    width: "100%", 
    height: "120%" 
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: scale(24),
    alignItems: 'center',
    // backgroundColor: 'pink'
  },
  slogan: {
    marginTop: scale(24),
    color: "#FFF",
    fontSize: scale(32),
    fontFamily: "Cinzel-Regular",
  },
  description: {
    marginTop: scale(4),
    color: "rgba(255,255,255,0.7)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    textAlign: 'center',
  },

  primaryBtn: {
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(20),
    width: '100%',
    // marginBottom: scaleVertical(24),
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
  buttonBack: {
    backgroundColor: "#000",
    width: scale(40),
    aspectRatio: 1,
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SavedFocusSessionScreen;