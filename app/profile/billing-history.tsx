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
    getPlanDisplayName,
    getSubscriptionData,
    SubscriptionData
} from "@/lib/subscriptionService";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const BillingHistoryScreen = () => {
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

  const handleViewFullBillingHistory = async () => {
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
        "Billing History",
        "You've been redirected to view your complete billing history. You can see all payments, download receipts, and manage your subscription there.",
        [{ text: "OK" }]
      );
      
    } catch (error) {
      console.error('Error accessing billing history:', error);
      Alert.alert(
        "Error",
        "There was an error accessing your billing history. Please try again or contact support.",
        [{ text: "OK" }]
      );
    }
  };

  // Helper function to calculate previous billing dates
  const getPreviousBillingDate = (renewalDate: string, periodsBack: number, planType: string): string => {
    let daysPerPeriod = 30; // Default to monthly
    if (planType === 'yearly') {
      daysPerPeriod = 365;
    } else if (planType === 'lifetime') {
      daysPerPeriod = 36500; // 100 years for lifetime
    }
    
    const daysBack = daysPerPeriod * periodsBack;
    const previousDate = new Date(new Date(renewalDate).getTime() - daysBack * 24 * 60 * 60 * 1000);
    return previousDate.toISOString().split('T')[0];
  };

  const BillingItem = ({ title, date, amount, status = "Paid" }: {
    title: string;
    date: string;
    amount: number;
    status?: string;
  }) => {
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
              }}>{title}</Text>
            </View>
            <Text style={ {
                color: "rgba(255,255,255,0.5)",
                fontSize: scale(14),
                fontFamily: "ZillaSlab-Regular",
                marginTop: scaleVertical(4),
              }}>
              {date}
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
                {Math.floor(amount)}
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
                {String(Math.round((amount % 1) * 100)).padStart(2, '0')}
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
              {status}
            </Text>
          </View>

          <TouchableOpacity 
            style={{
              flexDirection: 'row', 
              alignItems: 'center',
            }}
            activeOpacity={0.9}
            onPress={handleViewFullBillingHistory}
          >
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
          
          {/* Current Subscription Info */}
          <Text style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: scale(16),
            fontFamily: "ZillaSlab-Medium",
            marginBottom: scaleVertical(8),
          }}>
            {"Current Subscription"}
          </Text>
          
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
            <View style={{
              padding: scale(16),
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: 6,
              marginBottom: scaleVertical(24),
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: scaleVertical(8) }}>
                <Text style={{
                  color: "#fff",
                  fontSize: scale(16),
                  fontFamily: "ZillaSlab-Medium",
                }}>
                  {`${getPlanDisplayName(subscriptionData.planType)} Plan`}
                </Text>
              </View>
              <Text style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: scale(14),
                fontFamily: "ZillaSlab-Regular",
                marginBottom: scaleVertical(4),
              }}>
                {`$${subscriptionData.price}${subscriptionData.planType === 'lifetime' ? ' (one-time)' : subscriptionData.planType === 'yearly' ? '/year' : '/month'}`}
              </Text>
              {subscriptionData.renewalDate && subscriptionData.planType !== 'lifetime' && (
                <Text style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: scale(14),
                  fontFamily: "ZillaSlab-Regular",
                }}>
                  {`Next renewal: ${formatRenewalDate(subscriptionData.renewalDate)}`}
                </Text>
              )}
              {subscriptionData.planType === 'lifetime' && (
                <Text style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: scale(14),
                  fontFamily: "ZillaSlab-Regular",
                }}>
                  {"No renewal needed - lifetime access"}
                </Text>
              )}
            </View>
          ) : null}

          {/* Recent Billing History */}
          <Text style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: scale(16),
            fontFamily: "ZillaSlab-Medium",
            marginBottom: scaleVertical(8),
          }}>
            {"Recent Billing History"}
          </Text>

          {/* Mock billing history items - calculated from subscription data */}
          {subscriptionData && subscriptionData.renewalDate && (
            <>
              <BillingItem 
                title={`${subscriptionData.planType === 'yearly' ? 'Yearly' : subscriptionData.planType === 'lifetime' ? 'Lifetime' : 'Monthly'} Subscription ${subscriptionData.planType === 'lifetime' ? 'Purchase' : 'Renewal'}`}
                date={formatRenewalDate(subscriptionData.renewalDate)}
                amount={subscriptionData.price}
                status="Paid"
              />
              
              {subscriptionData.planType !== 'lifetime' && (
                <>
                  <BillingItem 
                    title={`${subscriptionData.planType === 'yearly' ? 'Yearly' : 'Monthly'} Subscription Renewal`}
                    date={formatRenewalDate(getPreviousBillingDate(subscriptionData.renewalDate, 1, subscriptionData.planType))}
                    amount={subscriptionData.price}
                    status="Paid"
                  />
                  
                  <BillingItem 
                    title={`${subscriptionData.planType === 'yearly' ? 'Yearly' : 'Monthly'} Subscription Renewal`}
                    date={formatRenewalDate(getPreviousBillingDate(subscriptionData.renewalDate, 2, subscriptionData.planType))}
                    amount={subscriptionData.price}
                    status="Paid"
                  />
                </>
              )}
            </>
          )}

          {/* View Full History Button */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.2)",
              marginTop: scaleVertical(24),
              marginBottom: scaleVertical(16),
            }}
            activeOpacity={0.8}
            onPress={handleViewFullBillingHistory}
          >
            <View style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Text style={{
                color: "#FFF",
                fontSize: scale(18),
                fontFamily: "ZillaSlab-SemiBold",
                letterSpacing: 0,
                paddingVertical: scaleVertical(17),
              }}>
                {"View Full Billing History"}
              </Text>
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

export default BillingHistoryScreen;