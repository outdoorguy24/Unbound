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

const ManageSubscriptionScreen = () => {
  const insets = useSafeAreaInsets();
  const [toggle, setToggle] = useState(false);
  
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
            <Text style={styles.slogan}>{"Manage subscription"}</Text>
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

          <Text style={ {
              color: "rgba(255,255,255,0.5)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Medium",
            }}>
            {"Current plan"}
          </Text>
          
          <View
              style={{
                padding: scale(24),
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
                  
                  <Image
                    source={require("../../assets/new-images/icon-bill.png")}
                    style={{
                      height: scale(16),
                      width: scale(16),
                      marginRight: scale(6)
                    }}
                  />
                  <Text style={{
                    color: "#fff",
                    fontSize: scale(16),
                    fontFamily: "ZillaSlab-Medium",
                  }}>{"Monthly"}</Text>
                </View>
                <Text style={ {
                    color: "rgba(255,255,255,0.5)",
                    fontSize: scale(12),
                    fontFamily: "ZillaSlab-Regular",
                    marginTop: scaleVertical(4),
                  }}>
                  {"Renews on 8 Sept 2025"}
                </Text>
              </View>

              <View style={{ justifyContent: "center" }}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      color: "#FFF",
                      fontFamily: "ZillaSlab-SemiBold",
                      fontSize: scale(32),
                      marginRight: scale(4),
                    }}
                  >
                    $
                  </Text>

                  <Text
                    style={{
                      color: "#FFF",
                      fontFamily: "ZillaSlab-Bold",
                      fontSize: scale(32),
                    }}
                  >
                    6
                  </Text>

                  <Text
                    style={{
                      color: "#FFF",
                      fontFamily: "ZillaSlab-Bold",
                      fontSize: scale(20),
                      marginLeft: scale(2),
                      transform: [
                        { translateY: -Math.round(scale(20) * 0.2) },
                      ],
                    }}
                  >
                    99
                  </Text>

                  <Text
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontFamily: "ZillaSlab-Regular",
                      fontSize: scale(14),
                      alignSelf: "flex-end",
                      transform: [{ translateY: -scale(3) }],
                    }}
                  >
                    /monthly
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[{
                flexDirection: "row",
                borderRadius: 6,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
                marginTop: scaleVertical(24),
              }]}
              activeOpacity={0.8}
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
                    paddingVertical: scaleVertical(17),
                  }]}>
                    {"Change to Yearly"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Payment method */}
          <TouchableOpacity onPress={() => router.push('/profile/payment-method')}>  
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: scaleVertical(48),
            }}>
              <Image
                source={require("../../assets/new-images/icon-payment-method.png")}
                style={{
                  height: scale(24),
                  width: scale(24),
                  marginRight: scale(10)
                }}
              />
              <Text style={{
                  color: "rgba(255, 255, 255, 1)",
                  fontSize: scale(16),
                  fontFamily: "ZillaSlab-SemiBold",
                  letterSpacing: 0.5,
                  flex: 1,
              }}>
                {"Payment Method"}
              </Text>
              

                <Image
                  source={require("../../assets/new-images/right-arrow-white.png")}
                  style={{
                    height: scale(24),
                    width: scale(24),
                  }}
                />

            </View>
          </TouchableOpacity>
          
          <View style={{
            width: "100%",
            height: 1, 
            backgroundColor: "#D9D9D9", 
            opacity: 0.15,
            marginVertical: scaleVertical(24),
          }} />


          {/* Billing history */}
          <TouchableOpacity onPress={() => {
            router.push('/profile/billing-history')
          }}>  
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Image
                source={require("../../assets/new-images/icon-billing-history.png")}
                style={{
                  height: scale(24),
                  width: scale(24),
                  marginRight: scale(10)
                }}
              />
              <Text style={{
                  color: "rgba(255, 255, 255, 1)",
                  fontSize: scale(16),
                  fontFamily: "ZillaSlab-SemiBold",
                  letterSpacing: 0.5,
                  flex: 1,
              }}>
                {"Billing History"}
              </Text>
              

                <Image
                  source={require("../../assets/new-images/right-arrow-white.png")}
                  style={{
                    height: scale(24),
                    width: scale(24),
                  }}
                />

            </View>
            
            <View style={{
              width: "100%",
              height: 1, 
              backgroundColor: "#D9D9D9", 
              opacity: 0.15,
              marginVertical: scaleVertical(24),
            }} />
          </TouchableOpacity>



          {/* Cancel subscription */}
          <TouchableOpacity onPress={() => {
            router.push('/profile/cancel-subscription')
          }}>  
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Image
                source={require("../../assets/new-images/icon-cancel-subscription.png")}
                style={{
                  height: scale(24),
                  width: scale(24),
                  marginRight: scale(10)
                }}
              />
              <Text style={{
                  color: "#FF4444",
                  fontSize: scale(16),
                  fontFamily: "ZillaSlab-SemiBold",
                  letterSpacing: 0.5,
                  flex: 1,
              }}>
                {"Cancel Subscription"}
              </Text>
              

                <Image
                  source={require("../../assets/new-images/right-arrow-white.png")}
                  style={{
                    height: scale(24),
                    width: scale(24),
                  }}
                />

            </View>
          </TouchableOpacity>

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

export default ManageSubscriptionScreen;