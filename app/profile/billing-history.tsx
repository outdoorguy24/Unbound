import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";

import { height, scale, scaleVertical } from "@/constants/Scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const BillingHistoryScreen = () => {
  const insets = useSafeAreaInsets();
  
  const Item = () => {
    return (
      <View
              style={{
                padding: scale(16),
                marginTop: scaleVertical(12),
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: 6,
              }}
            >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{
                    color: "#fff",
                    fontSize: scale(16),
                    fontFamily: "ZillaSlab-Medium",
                  }}>{"Yearly Subscription Renewal"}</Text>
                </View>
                <Text style={ {
                    color: "rgba(255,255,255,0.5)",
                    fontSize: scale(14),
                    fontFamily: "ZillaSlab-Regular",
                    marginTop: scaleVertical(4),
                  }}>
                  {"Aug 1, 2025"}
                </Text>
              </View>

              <View style={{ justifyContent: "center" }}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      color: "#FFF",
                      fontFamily: "ZillaSlab-SemiBold",
                      fontSize: scale(24),
                      marginRight: scale(4),
                    }}
                  >
                    $
                  </Text>

                  <Text
                    style={{
                      color: "#FFF",
                      fontFamily: "ZillaSlab-Bold",
                      fontSize: scale(24),
                    }}
                  >
                    59
                  </Text>

                  <Text
                    style={{
                      color: "#FFF",
                      fontFamily: "ZillaSlab-Bold",
                      fontSize: scale(16),
                      marginLeft: scale(2),
                      transform: [
                        { translateY: -Math.round(scale(16) * 0.2) },
                      ],
                    }}
                  >
                    99
                  </Text>
                </View>
              </View>

            </View>
            <View style={{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: scaleVertical(20),
            }}>
              
              <View style={{
                alignItems: 'center', 
                backgroundColor: '#DCFFE5', 
                paddingHorizontal: scale(8), 
                paddingVertical: scaleVertical(4), 
                borderRadius: 4
              }}>
                <Text style={{
                  color: "#0AB337",
                  fontSize: scale(12),
                  fontFamily: "ZillaSlab-SemiBold",
                }}>
                  {"Paid"}
                </Text>
              </View>

              <TouchableOpacity style={{
                flexDirection: 'row', 
                alignItems: 'center',
              }}
              activeOpacity={0.9}>
                <Text style={{
                  color: "#FFCA91",
                  marginRight: scale(6),
                  fontSize: scale(16),
                  fontFamily: "ZillaSlab-SemiBold",
                }}>
                  {"View more"}
                </Text>

                <Image
                  source={require("../../assets/new-images/right-arrow.png")}
                  style={{
                    height: scale(24),
                    width: scale(24),
                  }}
                />
              </TouchableOpacity>
            </View>
            
          </View>
    );
  }
  
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
            <Text style={styles.slogan}>{"Billing History"}</Text>
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
          style={[styles.keyboard, {marginBottom: insets.bottom + scaleVertical(16)}]}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          
          <Item />
          <Item />
          <Item />
          
        </ScrollView>
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
    paddingTop: scaleVertical(50),
  },
  secondaryBtn: {
    marginTop: scaleVertical(16),
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    paddingVertical: scaleVertical(20),
    flexDirection: 'row'
  },
  secondaryText: {
    color: "#F44",
    fontSize: scale(16),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
  },
});

export default BillingHistoryScreen;