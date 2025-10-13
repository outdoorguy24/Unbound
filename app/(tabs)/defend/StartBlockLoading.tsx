import { scale, scaleVertical } from "@/constants/Scale";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    View
} from "react-native";

const StartBlockLoadingScreen = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const { duration } = useLocalSearchParams();

  useEffect(() => {
    // Start the spinning animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000, // 1 second for 1 rotation
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    // Navigate after 3 seconds
    setTimeout(() => {
      router.push({
        pathname: '/defend/FocusSession',
        params: { duration: duration }
      });
    }, 3000)

    // Cleanup animation on unmount
    return () => {
      spinAnimation.stop();
    };
  }, [spinValue])
  return (
    <View style={styles.safe}>
      <Image
        source={require("../../../assets/new-images/start-block-loading-bg.png")}
        style={styles.image}
        resizeMode="cover"
      />
      <Image
        source={require("../../../assets/new-images/start-block-loading-overlay.png")}
        style={styles.overlayImage}
      />

      <View
        style={[styles.mainContainer]}
      >
        <Text style={styles.headerText}>{'your block is initiating...'}</Text>
        <Animated.Image
          source={require("../../../assets/new-images/loading-circle.png")}
          resizeMode={"cover"}
          style={[
            styles.loader,
            {
              transform: [
                {
                  rotate: spinValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
        <Image
          source={require("../../../assets/new-images/start-block-loading-text.png")}
          resizeMode={"contain"}
          style={{
            marginTop: scaleVertical(70),
            height: scale(96),
            width: '90%',
          }}
        />
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
    width: "100%", 
    height: "86%",
    // marginBottom: ,
  },
  overlayImage: {
    position: "absolute",
    width: "100%", 
    height: "100%",
  },
  buttonBack: {
    backgroundColor: "#000",
    width: scale(40),
    aspectRatio: 1,
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: { 
    position: "absolute", 
    left: scale(24), 
    right: scale(24),
    bottom: scale(68),
    alignItems: 'center',
    justifyContent: 'center',
  },
  slogan: {
    marginTop: scaleVertical(24),
    color: "#000",
    fontSize: scale(40),
    fontFamily: "Cinzel-Regular",
    lineHeight: scale(44),
  },
  loader: {
    marginTop: scaleVertical(20),
    height: scaleVertical(80),
    aspectRatio: 1,
  },
  alertContainer: {
    position: 'absolute', 
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0, 
    justifyContent: 'center'
  },
  alertView: {
    backgroundColor: 'white', 
    marginHorizontal: scale(24), 
    borderRadius: 6
  },
  btnClose: {
    width: scale(34), 
    aspectRatio: 1, 
    alignSelf: 'flex-end', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
    marginTop: scale(16)
  },
  dangerView: {
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: scale(24),
    marginHorizontal: scale(24)
  },
  cautionImage: {
    height: scaleVertical(48),
    aspectRatio: 1,
  },
  incorrectCode: {
    marginTop: scaleVertical(16),
    color: "#000",
    fontSize: scale(20),
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
  },
  incorrectCodeDesc: {
    marginTop: scaleVertical(8),
    color: "rgba(0,0,0,0.6)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
  },
  retryBtn: {
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(20),
    width: '100%',
    marginTop: scaleVertical(32),
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
  },
  resendBtn: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(20),
    width: '100%',
    marginTop: scaleVertical(16),
  },
  resendText: {
    color: "#000",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
  },
  headerText: {
    color: "#fff",
    fontSize: scale(32),
    fontFamily: "Cinzel-Regular",
    lineHeight: scale(34),
    textAlign: 'center',
  },
});

export default StartBlockLoadingScreen;