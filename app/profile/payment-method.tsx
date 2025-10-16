import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { scale, scaleVertical } from "@/constants/Scale";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const PaymentMethodScreen = () => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  const handleManagePaymentMethods = async () => {
    setIsLoading(true);
    try {
      // Redirect to platform-specific subscription management
      const platform = Platform.OS;
      
      if (platform === 'ios') {
        // Open App Store subscription management
        Linking.openURL('https://apps.apple.com/account/subscriptions');
      } else if (platform === 'android') {
        // Open Google Play subscription management
        Linking.openURL('https://play.google.com/store/account/subscriptions');
      }
      
      Alert.alert(
        "Payment Method Management",
        "You've been redirected to manage your payment methods. You can update your payment information, add new cards, or change your billing method there.",
        [{ text: "OK" }]
      );
      
    } catch (error) {
      console.error('Error managing payment methods:', error);
      Alert.alert(
        "Error",
        "There was an error accessing your payment methods. Please try again or contact support.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <View style={styles.safe}>
      <Image
        source={require("../../assets/new-images/onboarding-screen-4.png")}
        style={styles.image}
      />
      <Image
        source={require("../../assets/new-images/onboarding-overlay-full.png")}
        style={styles.overlayImage}
      />

      <View
        style={[
          styles.mainContainer,
          {
            marginTop: insets.top + scaleVertical(16),
          },
        ]}
      >
        <View
          style={styles.headerView}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.slogan}>{"Payment Method"}</Text>
            <TouchableOpacity
              style={styles.buttonBack}
              activeOpacity={0.8}
              onPress={() => router.back()}
            >
              <Image
                source={require("../../assets/new-images/icon-back.png")}
                style={{
                  height: scale(20),
                  width: scale(20),
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.keyboard, {marginBottom: insets.bottom + scaleVertical(16)}]}>
          <Text style={{
            color: "rgba(255, 255, 255, 1)",
            fontSize: scale(18),
            fontFamily: "ZillaSlab-Regular",
            letterSpacing: 0.5,
            lineHeight: scale(24),
            textAlign: 'center',
            marginTop: scaleVertical(40),
          }}>
            {"Your payment methods are managed through your device's subscription settings. Tap below to update your payment information."}
          </Text>
        </View>


        <TouchableOpacity
          style={[
            styles.primaryBtn,
            {marginBottom: insets.bottom + scaleVertical(16)}
          ]}
          onPress={handleManagePaymentMethods}
          activeOpacity={0.9}
          disabled={isLoading}
        >
          <Text style={styles.primaryText}>{"Manage Payment Methods"}</Text>
        </TouchableOpacity>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    position: "absolute",
    width: "100%",
    height: width * 0.939,
  },
  overlayImage: {
    position: "absolute",
    width: "100%",
    height: "95%",
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
    flex: 1,
    width: '100%',
  },
  slogan: {
    position: 'absolute',
    color: "#FFF",
    fontSize: scale(22),
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
    width: '100%',
    textAlign: 'center',
  },
  headerView: {
    width: '100%',
    paddingHorizontal: scale(24),
  },
  keyboard: {
    flex: 1,
    width: '100%',
    paddingHorizontal: scale(24),
    paddingTop: scaleVertical(40),
  },
  primaryBtn: {
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(20),
    marginHorizontal: scaleVertical(24),
    marginBottom: scaleVertical(24),
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
});

export default PaymentMethodScreen;