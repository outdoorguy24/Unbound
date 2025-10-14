import { height, scale, scaleVertical } from "@/constants/Scale";
import { SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Purchases, {
    CustomerInfo,
    PurchasesOffering,
    PurchasesPackage,
} from "react-native-purchases";

const termsUrl = "https://yourdomain.com/terms";
const privacyUrl = "https://yourdomain.com/privacy";
const testimonial = `"Unbound helped\nme reclaim 12\nhours a week-\nnow I hike, train,\nand read again."`;
const testimonialAuthor = "James M., Texas";

const COLORS = {
  background: "#F3E2C7",
  accent: "#A05A1A",
  dark: "#2C1A05",
  mid: "#4B3415",
  green: "#265C28",
  white: "#F3E2C7",
  orange: "#E2C89A",
  gold: "#F1D593",
};

// Add debugging and better error handling
const REVENUECAT_API_KEY = "appl_BYmaCExMCUEVMmUPdbhHAqZMqSx";

// Set to true to test RevenueCat in development
const FORCE_PRODUCTION_MODE = false;

export default function PaywallPricing() {
  const router = useRouter();
  const { user } = useAuth();
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [selected, setSelected] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupRevenueCat() {
      setLoading(true);
      setError(null);
      console.log("🔄 Setting up RevenueCat...");

      try {
        // Skip RevenueCat in development mode unless forced
        // if (__DEV__ && !FORCE_PRODUCTION_MODE) {
        //   console.log("⚠️ Development mode - RevenueCat disabled");
        //   setError("Development mode - subscription disabled");
        //   setLoading(false);
        //   return;
        // }

        console.log("🔑 Configuring RevenueCat with API key...");
        await Purchases.configure({ apiKey: REVENUECAT_API_KEY });

        if (user?.id) {
          console.log("👤 Logging in user:", user.id);
          await Purchases.logIn(user.id);
        }

        console.log("📦 Fetching offerings...");
        const { current } = await Purchases.getOfferings();

        if (current && current.availablePackages.length > 0) {
          console.log(
            "✅ Offerings loaded:",
            current.availablePackages.length,
            "packages"
          );
          current.availablePackages.forEach((pkg) => {
            console.log(`  - ${pkg.identifier}: ${pkg.product.priceString}`);
          });
          setOfferings(current);
          // Select annual package by default if available
          const annualPackage = current.availablePackages.find((pkg) =>
            pkg.identifier.includes("annual")
          );
          setSelected(annualPackage || current.availablePackages[0]);
        } else {
          console.log(
            "❌ No offerings available - this is expected in testing"
          );
          console.log(
            "💡 To fix: Configure StoreKit in Xcode scheme or set up RevenueCat dashboard"
          );
          setError(
            "Configuration needed: StoreKit testing not enabled or RevenueCat dashboard not configured. See console for details."
          );
        }
      } catch (e: any) {
        console.error("❌ RevenueCat setup error:", e);
        setError(
          "RevenueCat configuration error. Check console for solutions."
        );
      }
      setLoading(false);
    }

    setupRevenueCat();
  }, [user]);

  const handlePurchase = async () => {
    // if (__DEV__ && !FORCE_PRODUCTION_MODE) {
    if (!FORCE_PRODUCTION_MODE) {
      // Go to create account in dev mode
      router.push("/(auth)/SignupOptionsScreen");
      return;
    }

    if (!selected) {
      setError("Please select a subscription plan.");
      return;
    }

    setPurchasing(true);
    setError(null);
    console.log("💳 Starting purchase for package:", selected.identifier);

    try {
      const { customerInfo } = await Purchases.purchasePackage(selected);
      console.log("✅ Purchase completed, checking entitlements...");

      if (customerInfo.activeSubscriptions.length > 0) {
        console.log("🎉 Active subscription found, navigating to create account");
        // Navigate to create account screen
        router.replace("/(auth)/SignupOptionsScreen");
      } else {
        console.log("❌ No active subscription after purchase");
        setError(
          "Subscription not activated. Please try again or contact support."
        );
      }
    } catch (e: any) {
      console.error("❌ Purchase error:", e);
      setError(e.message || "Purchase failed. Please try again.");
    }
    setPurchasing(false);
  };

  const handleRestore = async () => {
    setPurchasing(true);
    setError(null);
    console.log("🔄 Restoring purchases...");

    try {
      const info: CustomerInfo = await Purchases.restorePurchases();
      console.log("📱 Restore completed, checking active subscriptions...");

      if (info.activeSubscriptions.length > 0) {
        console.log("✅ Active subscription found during restore");
        router.replace("/(tabs)/camp");
      } else {
        console.log("❌ No active subscriptions found");
        setError(
          "No active subscription found. Please purchase a subscription or contact support."
        );
      }
    } catch (e: any) {
      console.error("❌ Restore error:", e);
      setError(e.message || "Restore failed. Please try again.");
    }
    setPurchasing(false);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.image,
          styles.loader,
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Loading subscription options…</Text>
      </View>
    );
  }

  // Find packages for selection
  const monthlyPkg = offerings?.availablePackages.find((pkg) =>
    pkg.identifier.includes("month")
  );
  const annualPkg = offerings?.availablePackages.find(
    (pkg) =>
      pkg.identifier.includes("year") || pkg.identifier.includes("annual")
  );

  return (
    <View style={styles.safe}>
      <Image
        source={require("../../assets/new-images/onboarding-screen-paywall.png")}
        style={styles.image}
      />
      <Image
        source={require("../../assets/new-images/onboarding-overlay-payment.png")}
        style={styles.overlayImage}
      />

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{"Unlock your journey"}</Text>
          <Text style={styles.subTitle}>
            {"Get focused. Choose your plan."}
          </Text>
          <View style={styles.features}>
            <View style={styles.featureRow}>
              <Image
                source={require("../../assets/new-images/icon-green-checked.png")}
                style={styles.featureIconImg}
              />
              <Text style={styles.featureText}>
                {"Auto-block distractions"}
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Image
                source={require("../../assets/new-images/icon-green-checked.png")}
                style={styles.featureIconImg}
              />
              <Text style={styles.featureText}>
                {"Reduce screen time without friction"}
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Image
                source={require("../../assets/new-images/icon-green-checked.png")}
                style={styles.featureIconImg}
              />
              <Text style={styles.featureText}>
                {"Track your reclaimed time"}
              </Text>
            </View>
            <View style={[styles.featureRow]}>
              <Image
                source={require("../../assets/new-images/icon-green-checked.png")}
                style={styles.featureIconImg}
              />
              <Text style={styles.featureText}>
                {"Private, secure, and easy to use"}
              </Text>
            </View>
            <View style={[styles.featureRow]}>
              <Image
                source={require("../../assets/new-images/icon-green-checked.png")}
                style={styles.featureIconImg}
              />
              <Text style={styles.featureText}>
                {"Level up through progress milestones"}
              </Text>
            </View>
          </View>

          <View style={styles.pricingWrap}>
            <View style={styles.monthlyBoxWrap}>
              <TouchableOpacity
                style={[
                  styles.pricingBoxMonthly,
                  selected?.identifier !== annualPkg?.identifier
                    ? {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        borderWidth: 1,
                      }
                    : { borderColor: "rgba(255, 202, 145, 1)", borderWidth: 2 },
                ]}
                onPress={() => {
                  setSelected(annualPkg || null);
                }}
                activeOpacity={0.8}
              >
                {/* <Text style={styles.priceMonthly}>{monthlyPkg?.product.priceString || "$2.99/month"}</Text> */}
                <View
                  style={styles.subscriptionsView}
                >
                  <View style={styles.flex}>
                    <Text style={styles.priceMonthly}>{"Annual"}</Text>
                    <Text style={styles.trialText}>
                      {annualPkg?.product.introPrice
                        ? `${
                            annualPkg.product.introPrice.periodNumberOfUnits ||
                            7
                          } days free`
                        : "7-day free trial"}
                    </Text>
                  </View>

                  <View style={styles.justifyContent}>
                    <View style={styles.flexDirection}>
                      <Text
                        style={styles.currency}
                      >
                        $
                      </Text>

                      <Text
                        style={styles.dollars}
                      >
                        19
                      </Text>

                      <Text
                        style={styles.superscript}
                      >
                        99
                      </Text>

                      <Text
                        style={styles.time}
                      >
                        /year
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.mostPopularTag}>
                <Text style={styles.mostPopularText}>{"save 58%"}</Text>
              </View>
              {/* <TouchableOpacity
                style={purchasing || !selected ? styles.disabledStartTrialBtn : styles.startTrialBtn}
                onPress={() => {
                  handlePurchase();
                }}
                disabled={purchasing || !selected}
              >
                <Text style={styles.startTrialBtnText}>{purchasing ? "Processing…" : "Start Free Trial"}</Text>
              </TouchableOpacity> */}
            </View>
            <View style={styles.monthlyBoxWrap}>
              <TouchableOpacity
                style={[
                  styles.pricingBoxMonthly,
                  selected?.identifier !== monthlyPkg?.identifier
                    ? {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        borderWidth: 1,
                      }
                    : { borderColor: "rgba(255, 202, 145, 1)", borderWidth: 2 },
                ]}
                onPress={() => {
                  setSelected(monthlyPkg || null);
                }}
                activeOpacity={0.8}
              >
                <View
                  style={styles.subscriptionsView}
                >
                  <View style={styles.flex}>
                    <Text style={styles.priceMonthly}>{"Monthly"}</Text>
                    <Text style={styles.trialText}>
                      {monthlyPkg?.product.introPrice
                        ? `${
                            monthlyPkg.product.introPrice.periodNumberOfUnits ||
                            7
                          } days free`
                        : "7-day free trial"}
                    </Text>
                  </View>

                  <View style={styles.justifyContent}>
                    <View style={styles.flexDirection}>
                      <Text
                        style={styles.currency}
                      >
                        $
                      </Text>

                      <Text
                        style={styles.dollars}
                      >
                        3
                      </Text>

                      <Text
                        style={styles.superscript}
                      >
                        99
                      </Text>

                      <Text
                        style={styles.time}
                      >
                        /month
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={purchasing || !selected ? styles.disabledStartTrialBtn : styles.startTrialBtn}
                onPress={() => {
                  handlePurchase();
                }}
                disabled={purchasing || !selected}
              >
                <Text style={styles.startTrialBtnText}>{purchasing ? "Processing…" : "Start Free Trial"}</Text>
              </TouchableOpacity> */}
            </View>
            {/* <View style={styles.bottomRow}>
              <TouchableOpacity
                style={[
                  styles.pricingBoxAnnual,
                  selected?.identifier === annualPkg?.identifier
                    ? { borderColor: COLORS.dark }
                    : { borderColor: COLORS.gold },
                ]}
                onPress={() => {
                  setSelected(annualPkg || null);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.priceAnnual}>{annualPkg?.product.priceString || "$19.99/year"}</Text>
                <Text style={styles.saveText}>(Save 44%)</Text>
              </TouchableOpacity>
              <View style={styles.testimonialBlock}>
                <Text style={styles.testimonialText}>{testimonial}</Text>
                <Text style={styles.testimonialAuthor}>{testimonialAuthor}</Text>
              </View>
            </View> */}
          </View>
          <Text style={styles.description}>
            {
              "First charge: day 8 (monthly) or 15 (yearly)\nNo commitment. Cancel anytime"
            }
          </Text>
          <TouchableOpacity
          style={[
            styles.primaryBtn,
            (purchasing || !selected) && styles.primaryBtnDisabled,
          ]}
          onPress={() => {
            handlePurchase();
          }}
          disabled={purchasing || !selected}

          activeOpacity={0.9}
        >
          <Text style={[styles.primaryText, {opacity: (purchasing || !selected) ? 0.5 : 1}]}>{"Choose Plan"}</Text>
        </TouchableOpacity>
        </View>
      </View>
      {/* <View style={styles.footerLinks}>
          <Text style={styles.footerLink} onPress={() => Linking.openURL(termsUrl)}>
            Terms of Use
          </Text>
          <Text style={styles.footerLink}> - </Text>
          <Text style={styles.footerLink} onPress={() => Linking.openURL(privacyUrl)}>
            Privacy Policy
          </Text>
          <Text style={styles.footerLink}> - </Text>
          <Text style={styles.footerLink} onPress={handleRestore}>
            Restore Purchase
          </Text>
        </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  overlayImage: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  content: {
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  textContainer: {
    top: height < 700 ? height * 0.06 : height * 0.08,
    marginHorizontal: scale(24),
  },
  description: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: scale(14),
    fontFamily: "ZillaSlab-Regular",
    letterSpacing: 0.3,
  },
  title: {
    color: "#FFF",
    fontSize: scale(40),
    fontFamily: "Cinzel-Regular",
    letterSpacing: 0.5,
    lineHeight: scale(44),
  },
  subTitle: {
    marginTop: scaleVertical(2),
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    letterSpacing: 0.5,
  },
  features: {
    marginTop: scaleVertical(40),
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scaleVertical(12),
  },
  featureIconImg: {
    width: scale(24),
    aspectRatio: 1,
    marginRight: scale(8),
    resizeMode: "contain",
  },
  featureText: {
    fontFamily: "ZillaSlab-Medium",
    fontSize: scale(16),
    color: "#FFF",
    flex: 1,
  },
  pricingWrap: {
    marginTop: scaleVertical(60),
  },
  monthlyBoxWrap: {
    marginBottom: scaleVertical(12),
  },
  pricingBoxMonthly: {
    borderRadius: 12,
    paddingHorizontal: scale(16),
    paddingVertical: scaleVertical(16),
  },
  mostPopularText: {
    color: "#000",
    fontWeight: "600",
    fontSize: scale(14),
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
  },
  mostPopularTag: {
    position: "absolute",
    top: -12,
    right: 14,
    backgroundColor: "rgba(253, 218, 0, 1)",
    borderRadius: 5,
    paddingHorizontal: scale(10),
    paddingVertical: scaleVertical(6),
  },
  priceMonthly: {
    color: "#fff",
    fontSize: scale(20),
    fontFamily: "ZillaSlab-Medium",
  },
  trialText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: scale(14),
    fontFamily: "ZillaSlab-Regular",
    marginTop: scaleVertical(4),
  },
  startTrialBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    width: 200,
    marginTop: -10,
    marginBottom: SPACING.md,
    zIndex: 2,
  },
  disabledStartTrialBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    width: 200,
    marginTop: -10,
    marginBottom: SPACING.md,
    zIndex: 2,
    opacity: 0.8,
  },
  startTrialBtnText: {
    color: COLORS.white,
    fontSize: scale(16),
    fontWeight: "bold",
    fontFamily: "Vollkorn-Bold",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
    marginBottom: SPACING.md,
    marginTop: -SPACING.md,
  },
  pricingBoxAnnual: {
    backgroundColor: "#192E0E",
    borderRadius: 16,
    borderWidth: 3,
    paddingHorizontal: SPACING.md,
    paddingVertical: 1.2 * SPACING.md,
    alignItems: "center",
    minWidth: 190,
    maxWidth: 200,
    borderStyle: "solid",
    shadowColor: COLORS.white,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    marginRight: SPACING.xl,
    marginBottom: SPACING.xxxl,
  },
  priceAnnual: {
    color: COLORS.gold,
    fontSize: scale(26),
    fontWeight: "bold",
    fontFamily: "Vollkorn-Bold",
  },
  saveText: {
    color: COLORS.gold,
    fontSize: scale(16),
    fontFamily: "Vollkorn-SemiBold",
    marginTop: SPACING.sm,
  },
  testimonialBlock: {
    maxWidth: 180,
    marginBottom: 4,
  },
  testimonialText: {
    color: COLORS.gold,
    fontSize: scale(17),
    fontFamily: "Vollkorn-MediumItalic",
    fontStyle: "italic",
    textAlign: "right",
    lineHeight: scale(24),
    marginBottom: SPACING.sm,
  },
  testimonialAuthor: {
    color: COLORS.accent,
    fontSize: scale(17),
    fontFamily: "Vollkorn-MediumItalic",
    fontStyle: "italic",
    textAlign: "right",
    marginBottom: SPACING.md,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xl,
    flexWrap: "wrap",
    width: "100%",
    bottom: SPACING.sm,
  },
  footerLink: {
    color: COLORS.gold,
    fontSize: scale(14),
    fontFamily: "Vollkorn-SemiBold",
    marginHorizontal: SPACING.xs,
    textAlign: "center",
  },
  loadingText: {
    color: COLORS.mid,
    fontSize: scale(16),
    marginTop: SPACING.md,
  },
  error: {
    color: "red",
    marginBottom: 8,
    textAlign: "center",
  },
  errorContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  bypassButton: {
    backgroundColor: COLORS.mid,
    marginTop: 12,
  },
  selectedBox: {
    borderColor: COLORS.gold,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtn: {
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(20),
    width: '100%',
    marginTop: height < 700 ? scaleVertical(20) : scaleVertical(30),
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: scale(16),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
  primaryBtnDisabled: {
    backgroundColor: "rgba(49, 43, 39, 1)",
  },
  flex: { flex: 1 },
  justifyContent: { justifyContent: "center" },
  flexDirection: { flexDirection: "row" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  subscriptionsView: {
    flexDirection: "row",
    marginVertical: scaleVertical(8),
  },
  currency: {
    color: "#FFF",
    fontFamily: "ZillaSlab-SemiBold",
    fontSize: scale(32),
    marginRight: scale(4),
  },
  dollars: {
    color: "#FFF",
    fontFamily: "ZillaSlab-Bold",
    fontSize: scale(32),
  },
  superscript: {
    color: "#FFF",
    fontFamily: "ZillaSlab-Bold",
    fontSize: scale(20),
    marginLeft: scale(2),
    transform: [
      { translateY: -Math.round(scale(20) * 0.2) },
    ],
  },
  time: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: "ZillaSlab-Regular",
    fontSize: scale(14),
    marginLeft: scale(10),
    alignSelf: "flex-end",
    transform: [{ translateY: -scale(3) }],
  },
});
