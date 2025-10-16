import { scale, scaleVertical } from "@/constants/Scale";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CONTACT_PHONE = process.env.EXPO_PUBLIC_CONTACT_PHONE || "+19164207262"; // Unbound contact number

const CancelSubscriptionScreen = () => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendText = () => {
    // Format the phone number to ensure it works on all devices
    const formattedPhone = CONTACT_PHONE.replace(/[^\d+]/g, '');
    Linking.openURL(`sms:${formattedPhone}`);
  };

  const handleKeepSubscription = () => {
    // Simply go back to the previous screen
    router.back();
  };

  const handleCancelSubscription = async () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your subscription? You'll lose access to all premium features.",
      [
        {
          text: "Keep Subscription",
          style: "cancel",
          onPress: handleKeepSubscription
        },
        {
          text: "Cancel Subscription",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              // For iOS, redirect to App Store subscription management
              // For Android, redirect to Google Play subscription management
              const platform = Platform.OS;
              
              if (platform === 'ios') {
                // Open App Store subscription management
                Linking.openURL('https://apps.apple.com/account/subscriptions');
              } else if (platform === 'android') {
                // Open Google Play subscription management
                Linking.openURL('https://play.google.com/store/account/subscriptions');
              }
              
              Alert.alert(
                "Subscription Management",
                "You've been redirected to manage your subscription. You can cancel there and your subscription will remain active until the end of your current billing period.",
                [
                  {
                    text: "OK",
                    onPress: () => router.back()
                  }
                ]
              );
              
            } catch (error) {
              console.error('Error managing subscription:', error);
              Alert.alert(
                "Error",
                "There was an error managing your subscription. Please try again or contact support.",
                [
                  {
                    text: "OK"
                  }
                ]
              );
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
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
            <Text style={styles.slogan}>{"Cancel Subscription"}</Text>
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
        
        <ScrollView
          style={styles.keyboard}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text style={{
              color: "rgba(255, 255, 255, 1)",
              fontSize: scale(20),
              fontFamily: "ZillaSlab-Regular",
              letterSpacing: 0.5,
              lineHeight: scale(24),
            }}>
              {"Damn, I thought we were cool.\n\nAre you sure you want to cancel and go back to your old ways?\n\nShoot me a text and tell me why you're cancelling and I'll give you 3 months free."}
          </Text>
        </ScrollView>

        <View style={{
          marginHorizontal: scale(24),
          marginBottom: insets.bottom + scaleVertical(16),
        }}>
          <TouchableOpacity
            style={[
              styles.primaryBtn,
            ]}
            onPress={handleKeepSubscription}
            activeOpacity={0.9}
            disabled={isLoading}
          >
            <Text style={styles.primaryText}>{"Keep subscription"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[{
              flexDirection: "row",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#FD4949",
              marginTop: scaleVertical(16),
              marginBottom: scaleVertical(16)
            }]}
            activeOpacity={0.8}
            onPress={handleCancelSubscription}
            disabled={isLoading}
          >
            <View style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}>
              <View style={{
                flex: 1,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Text style={[{
                  color: "#FD4949",
                  fontSize: scale(18),
                  fontFamily: "ZillaSlab-SemiBold",
                  letterSpacing: 0,
                  paddingVertical: scaleVertical(18),
                }]}>
                  {"Cancel subscription"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[{
              flexDirection: "row",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.2)",
              marginBottom: scaleVertical(16)
            }]}
            activeOpacity={0.8}
            onPress={handleSendText}
          >
            <View style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}>
              <View style={{
                flex: 1,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Text style={[{
                  color: "#FFF",
                  fontSize: scale(18),
                  fontFamily: "ZillaSlab-SemiBold",
                  letterSpacing: 0,
                  paddingVertical: scaleVertical(18),
                }]}>
                  {"Send me a text"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
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
    marginTop: scaleVertical(40),
  },
  primaryBtn: {
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(20),
    width: '100%',
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
});

export default CancelSubscriptionScreen;