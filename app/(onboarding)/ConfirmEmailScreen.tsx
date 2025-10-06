import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { scale, scaleVertical } from "@/constants/Scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get("window");

const ConfirmEmailScreen = () => {
  const insets = useSafeAreaInsets();
  const [incorrectCode, setIncorrectCode] = useState(false);

  useEffect(() => {

    if (incorrectCode) {
      return
    }
    const alertTimer = setTimeout(() => {
      setIncorrectCode(true);
    }, 3000);

    // const timer = setTimeout(() => {
    //   router.replace("/(auth)/BiometricScreen");
    // }, 3000);

    return () => {
      clearTimeout(alertTimer);
      // clearTimeout(timer);
    };
  }, [incorrectCode]);

  return (
    <View style={styles.safe}>
      <Image
        source={require("../../assets/new-images/confirm-email.png")}
        style={styles.image}
      />
      <Image
        source={require("../../assets/new-images/confirm-email-overlay.png")}
        style={styles.overlayImage}
      />

      <View
        style={[styles.mainContainer, { top: insets.top + scaleVertical(16) }]}
      >
        <TouchableOpacity
          style={styles.buttonBack}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Image
            source={require("../../assets/new-images/icon-back.png")}
            // resizeMode="center"
            style={{
              height: scale(20),
              width: scale(20),
            }}
          />
        </TouchableOpacity>

        <Text style={styles.slogan}>Confirming your email…</Text>
          <Image
            source={require("../../assets/new-images/loading-circle.png")}
            resizeMode={"cover"}
            style={styles.loader}
          />
      </View>

      {incorrectCode && 
        <BlurView style={styles.alertContainer} tint={'dark'} intensity={100}>
          <View style={styles.alertView}>
            <TouchableOpacity style={styles.btnClose} onPress={() => setIncorrectCode(false)}>
              <Image
                source={require("../../assets/new-images/icon-close-black.png")}
                // resizeMode={"center"}
                style={{
                  height: scale(24),
                  width: scale(24),
                }}
              />
            </TouchableOpacity>
            <View style={styles.dangerView}>
              <Image
              source={require("../../assets/new-images/icon-danger-red.png")}
              // resizeMode={"center"}
              style={styles.cautionImage}
              />
              <Text style={styles.incorrectCode}>{"Incorect code entered"}</Text>            
              <Text style={styles.incorrectCodeDesc}>{"Please check your code and try again"}</Text>            


              <TouchableOpacity
                style={[
                  styles.retryBtn,
                ]}
                onPress={() => {
                  router.replace("/(onboarding)/BiometricScreen");
                }}
                activeOpacity={0.9}
              >
                <Text style={styles.retryText}>{"Retry"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.resendBtn,
                ]}
                onPress={() => {
                  router.replace("/(onboarding)/BiometricScreen");
                }}
                activeOpacity={0.9}
              >
                <Text style={styles.resendText}>{"Resend code"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      }

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
    height: '100%' 
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
    right: scale(24) 
  },
  slogan: {
    marginTop: scaleVertical(24),
    color: "#000",
    fontSize: scale(40),
    fontFamily: "Cinzel-Regular",
    lineHeight: scale(44),
  },
  loader: {
    marginTop: scaleVertical(60),
    height: scaleVertical(48),
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
});

export default ConfirmEmailScreen;