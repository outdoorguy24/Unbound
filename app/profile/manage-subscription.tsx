import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

import { scale, scaleVertical } from "@/constants/Scale";
import { useAuth } from "@/contexts/AuthContext";
import {
  formatRenewalDate,
  getAlternativePlan,
  getAlternativePlanPrice,
  getPlanDisplayName,
  getSubscriptionData,
  SubscriptionData
} from "@/lib/subscriptionService";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ManageSubscriptionScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user?.id) {
        setError('No user found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getSubscriptionData(user.id);
        setSubscriptionData(data);
      } catch (err) {
        console.error('Error fetching subscription data:', err);
        setError('Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user?.id]);

  const handleChangePlan = async () => {
    if (!subscriptionData) return;
    
    const alternativePlan = getAlternativePlan(subscriptionData.planType);
    const alternativePrice = getAlternativePlanPrice(alternativePlan);
    
    Alert.alert(
      "Change Subscription Plan",
      `Would you like to change to the ${alternativePlan} plan for $${alternativePrice}/${alternativePlan === 'yearly' ? 'year' : 'month'}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Change Plan",
          onPress: async () => {
            try {
              const platform = Platform.OS;
              
              if (platform === 'ios') {
                // Redirect to App Store subscription management
                Linking.openURL('https://apps.apple.com/account/subscriptions');
              } else if (platform === 'android') {
                // Redirect to Google Play subscription management
                Linking.openURL('https://play.google.com/store/account/subscriptions');
              }
              
              Alert.alert(
                "Subscription Management",
                "You've been redirected to manage your subscription. You can change your plan, update billing, or cancel your subscription there.",
                [{ text: "OK" }]
              );
              
            } catch (error) {
              console.error('Error managing subscription:', error);
              Alert.alert(
                "Error",
                "There was an error accessing subscription management. Please try again or contact support.",
                [{ text: "OK" }]
              );
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
            {loading ? (
              <View style={{ alignItems: 'center', paddingVertical: scaleVertical(20) }}>
                <ActivityIndicator color="#FFF" size="small" />
                <Text style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: scale(14),
                  fontFamily: "ZillaSlab-Regular",
                  marginTop: scaleVertical(8),
                }}>
                  {"Loading subscription..."}
                </Text>
              </View>
            ) : error ? (
              <View style={{ alignItems: 'center', paddingVertical: scaleVertical(20) }}>
                <Text style={{
                  color: "#FF4444",
                  fontSize: scale(14),
                  fontFamily: "ZillaSlab-Regular",
                  textAlign: 'center',
                }}>
                  {error}
                </Text>
              </View>
            ) : subscriptionData ? (
              <>
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
                      }}>{getPlanDisplayName(subscriptionData.planType)}</Text>
                    </View>
                    {subscriptionData.renewalDate && (
                      <Text style={ {
                          color: "rgba(255,255,255,0.5)",
                          fontSize: scale(12),
                          fontFamily: "ZillaSlab-Regular",
                          marginTop: scaleVertical(4),
                        }}>
                        {`Renews on ${formatRenewalDate(subscriptionData.renewalDate)}`}
                      </Text>
                    )}
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
                        {Math.floor(subscriptionData.price)}
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
                        {String(Math.round((subscriptionData.price % 1) * 100)).padStart(2, '0')}
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
                        /{subscriptionData.planType === 'yearly' ? 'yearly' : subscriptionData.planType === 'lifetime' ? 'lifetime' : 'monthly'}
                      </Text>
                    </View>
                  </View>
                </View>

                {subscriptionData.planType !== 'free' && subscriptionData.planType !== 'lifetime' && (
                  <>
                    <TouchableOpacity
                      style={[{
                        flexDirection: "row",
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        marginTop: scaleVertical(24),
                      }]}
                      activeOpacity={0.8}
                      onPress={handleChangePlan}
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
                            {`Change to ${getPlanDisplayName(getAlternativePlan(subscriptionData.planType))}`}
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
                        marginTop: scaleVertical(12),
                      }]}
                      activeOpacity={0.8}
                      onPress={() => {
                        Alert.alert(
                          "Change to Lifetime Plan",
                          "Would you like to upgrade to the Lifetime plan for $39.99 (one-time payment)? This gives you lifetime access to all premium features.",
                          [
                            {
                              text: "Cancel",
                              style: "cancel"
                            },
                            {
                              text: "Upgrade to Lifetime",
                              onPress: async () => {
                                try {
                                  const platform = Platform.OS;
                                  
                                  if (platform === 'ios') {
                                    // Redirect to App Store subscription management
                                    Linking.openURL('https://apps.apple.com/account/subscriptions');
                                  } else if (platform === 'android') {
                                    // Redirect to Google Play subscription management
                                    Linking.openURL('https://play.google.com/store/account/subscriptions');
                                  }
                                  
                                  Alert.alert(
                                    "Subscription Management",
                                    "You've been redirected to manage your subscription. You can upgrade to the Lifetime plan there.",
                                    [{ text: "OK" }]
                                  );
                                  
                                } catch (error) {
                                  console.error('Error managing subscription:', error);
                                  Alert.alert(
                                    "Error",
                                    "There was an error accessing subscription management. Please try again or contact support.",
                                    [{ text: "OK" }]
                                  );
                                }
                              }
                            }
                          ]
                        );
                      }}
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
                            {"Change to Lifetime"}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : null}
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