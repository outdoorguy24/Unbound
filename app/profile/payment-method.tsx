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

const PaymentMethodScreen = () => {
  const insets = useSafeAreaInsets();
  
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
        
        <ScrollView
          style={[styles.keyboard, {marginBottom: insets.bottom + scaleVertical(16)}]}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >

          <View style={{
            backgroundColor: '#fff',
            padding: scale(20),
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 6,
            borderWidth: 2,
            borderColor: '#BE5E19',
          }}>
            <Image
              source={require("../../assets/new-images/icon-paypal.png")}
              style={{
                height: scale(37),
                width: scale(30),
                marginRight: scale(16)
              }}
            />

            <View style={{
              flex: 1,
              flexDirection: 'row',
            }}>
              <View style={{
                flex: 1,
              }}>
                <Text style={{
                    color: "rgba(0, 0, 0, 1)",
                    fontSize: scale(14),
                    fontFamily: "ZillaSlab-SemiBold",
                    letterSpacing: 0.5,
                    flex: 1,
                }}>
                  {"●●●● ●●●● ●●●● 4473"}
                </Text>

                <Text style={{
                    color: "rgba(0, 0, 0, 0.5)",
                    marginTop: scaleVertical(8),
                    fontSize: scale(14),
                    fontFamily: "ZillaSlab-SemiBold",
                    letterSpacing: 0.5,
                    flex: 1,
                }}>
                  {"Expiration date: 09/25"}
                </Text>
              </View>
            </View>

            <TouchableOpacity>
              <Text style={{
                  color: "#BE5E19",
                  fontSize: scale(16),
                  fontFamily: "ZillaSlab-SemiBold",
                  letterSpacing: 0.5,
                  marginLeft: scale(20)
              }}>
                {"Edit"}
              </Text>
            </TouchableOpacity>
          </View>



          <View style={{
            backgroundColor: '#fff',
            marginTop: scaleVertical(16),
            padding: scale(20),
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 6,
            borderWidth: 2,
            borderColor: 'transparent',
          }}>
            <Image
              source={require("../../assets/new-images/icon-mastercard.png")}
              style={{
                height: scale(32),
                width: scale(32),
                marginRight: scale(14)
              }}
            />

            <View style={{
              flex: 1,
              flexDirection: 'row',
            }}>
              <View style={{
                flex: 1,
              }}>
                <Text style={{
                    color: "rgba(0, 0, 0, 1)",
                    fontSize: scale(14),
                    fontFamily: "ZillaSlab-SemiBold",
                    letterSpacing: 0.5,
                    flex: 1,
                }}>
                  {"●●●● ●●●● ●●●● 3355"}
                </Text>

                <Text style={{
                    color: "rgba(0, 0, 0, 0.5)",
                    marginTop: scaleVertical(8),
                    fontSize: scale(14),
                    fontFamily: "ZillaSlab-SemiBold",
                    letterSpacing: 0.5,
                    flex: 1,
                }}>
                  {"Expiration date: 02/25"}
                </Text>
              </View>
            </View>

            <TouchableOpacity>
              <Text style={{
                  color: "#BE5E19",
                  fontSize: scale(16),
                  fontFamily: "ZillaSlab-SemiBold",
                  letterSpacing: 0.5,
                  marginLeft: scale(20)
              }}>
                {"Edit"}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>


        <TouchableOpacity
          style={[
            styles.primaryBtn,
            {marginBottom: insets.bottom + scaleVertical(16)}
          ]}
          onPress={() => {
          }}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryText}>{"Add card"}</Text>
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