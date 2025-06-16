import { SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Purchases, { CustomerInfo, PurchasesOffering, PurchasesPackage } from "react-native-purchases";

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

// Add a toggle for testing RevenueCat in development
const FORCE_PRODUCTION_MODE = true; // Set to true to test RevenueCat in development

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
        if (__DEV__ && !FORCE_PRODUCTION_MODE) {
          console.log("⚠️ Development mode - RevenueCat disabled");
          setError("Development mode - subscription disabled");
          setLoading(false);
          return;
        }

        console.log("🔑 Configuring RevenueCat with API key...");
        await Purchases.configure({ apiKey: REVENUECAT_API_KEY });

        if (user?.id) {
          console.log("👤 Logging in user:", user.id);
          await Purchases.logIn(user.id);
        }

        console.log("📦 Fetching offerings...");
        const { current } = await Purchases.getOfferings();

        if (current && current.availablePackages.length > 0) {
          console.log("✅ Offerings loaded:", current.availablePackages.length, "packages");
          current.availablePackages.forEach((pkg) => {
            console.log(`  - ${pkg.identifier}: ${pkg.product.priceString}`);
          });
          setOfferings(current);
          // Select annual package by default if available
          const annualPackage = current.availablePackages.find((pkg) => pkg.identifier.includes("annual"));
          setSelected(annualPackage || current.availablePackages[0]);
        } else {
          console.log("❌ No offerings available - this is expected in testing");
          console.log("💡 To fix: Configure StoreKit in Xcode scheme or set up RevenueCat dashboard");
          setError(
            "Configuration needed: StoreKit testing not enabled or RevenueCat dashboard not configured. See console for details."
          );
        }
      } catch (e: any) {
        console.error("❌ RevenueCat setup error:", e);
        setError("RevenueCat configuration error. Check console for solutions.");
      }
      setLoading(false);
    }

    setupRevenueCat();
  }, [user]);

  const handlePurchase = async () => {
    if (__DEV__ && !FORCE_PRODUCTION_MODE) {
      // Go to auth screen in dev mode
      router.replace("/signup");
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
        console.log("🎉 Active subscription found, navigating to app");
        // Unlock app, navigate to main app
        router.replace("/(tabs)/camp");
      } else {
        console.log("❌ No active subscription after purchase");
        setError("Subscription not activated. Please try again or contact support.");
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
        setError("No active subscription found. Please purchase a subscription or contact support.");
      }
    } catch (e: any) {
      console.error("❌ Restore error:", e);
      setError(e.message || "Restore failed. Please try again.");
    }
    setPurchasing(false);
  };

  if (loading) {
    return (
      <View style={[styles.bg, { flex: 1, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Loading subscription options…</Text>
      </View>
    );
  }

  // Find packages for selection
  const monthlyPkg = offerings?.availablePackages.find((pkg) => pkg.identifier.includes("month"));
  const annualPkg = offerings?.availablePackages.find(
    (pkg) => pkg.identifier.includes("year") || pkg.identifier.includes("annual")
  );

  return (
    <ImageBackground
      source={require("../../assets/images/onboarding/paywall-bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Get Unbound</Text>
          <View style={styles.features}>
            <View style={styles.featureRow}>
              <Image source={require("../../assets/images/onboarding/feature-1.png")} style={styles.featureIconImg} />
              <Text style={styles.featureText}>Block distractions before{"\n"}they block you</Text>
            </View>
            <View style={styles.featureRow}>
              <Image source={require("../../assets/images/onboarding/feature-2.png")} style={styles.featureIconImg} />
              <Text style={styles.featureText}>Build unstoppable focus{"\n"}and discipline</Text>
            </View>
            <View style={styles.featureRow}>
              <Image source={require("../../assets/images/onboarding/feature-3.png")} style={styles.featureIconImg} />
              <Text style={styles.featureText}>
                Reclaim your time,{"\n"}your clarity, your{"\n"}mission
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Image source={require("../../assets/images/onboarding/feature-4.png")} style={styles.featureIconImg} />
              <Text style={styles.featureText}>
                Be part of a{"\n"}like-minded{"\n"}community
              </Text>
            </View>
          </View>
          <View style={styles.pricingWrap}>
            <View style={styles.monthlyBoxWrap}>
              <View style={styles.mostPopularTag}>
                <Text style={styles.mostPopularText}>MOST POPULAR</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.pricingBoxMonthly,
                  selected?.identifier === monthlyPkg?.identifier && styles.selectedBox,
                ]}
                onPress={() => {
                  setSelected(monthlyPkg || null);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.priceMonthly}>{monthlyPkg?.product.priceString || "$2.99/month"}</Text>
                <Text style={styles.trialText}>
                  {monthlyPkg?.product.introPrice
                    ? `${monthlyPkg.product.introPrice.periodNumberOfUnits || 7} days free`
                    : "7-day free trial"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={purchasing || !selected ? styles.disabledStartTrialBtn : styles.startTrialBtn}
                onPress={() => {
                  handlePurchase();
                }}
                disabled={purchasing || !selected}
              >
                <Text style={styles.startTrialBtnText}>{purchasing ? "Processing…" : "Start Free Trial"}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bottomRow}>
              <TouchableOpacity
                style={[styles.pricingBoxAnnual, selected?.identifier === annualPkg?.identifier && styles.selectedBox]}
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
            </View>
          </View>
        </View>
        <View style={styles.footerLinks}>
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
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 32,
  },
  content: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  title: {
    fontFamily: "Vollkorn-Bold",
    fontSize: 36,
    color: COLORS.dark,
    fontWeight: "bold",
    marginBottom: SPACING.xl,
    textAlign: "center",
    marginTop: SPACING.md,
  },
  features: {
    width: "100%",
    marginBottom: SPACING.md,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 14,
    width: 36,
    textAlign: "center",
  },
  featureText: {
    fontFamily: "Vollkorn-SemiBold",
    fontSize: 15,
    color: COLORS.dark,
    flex: 1,
    flexWrap: "wrap",
  },
  pricingWrap: {
    width: "100%",
    marginBottom: SPACING.xl,
  },
  monthlyBoxWrap: {
    width: 200,
    alignItems: "center",
    marginBottom: SPACING.md,
    position: "relative",
  },
  mostPopularTag: {
    position: "absolute",
    top: -18,
    left: 18,
    zIndex: 2,
    backgroundColor: "#AA6B05",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    alignSelf: "flex-start",
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  mostPopularText: {
    color: COLORS.gold,
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "Vollkorn-Bold",
    letterSpacing: 1,
  },
  pricingBoxMonthly: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.dark,
    minWidth: 200,
    marginBottom: 0,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1,
  },
  priceMonthly: {
    color: COLORS.dark,
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Vollkorn-Bold",
  },
  trialText: {
    color: COLORS.dark,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "Vollkorn-Regular",
    marginTop: SPACING.sm,
  },
  startTrialBtn: {
    backgroundColor: COLORS.accent,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    width: 200,
    marginTop: -5,
    marginBottom: SPACING.md,
    zIndex: 2,
  },
  disabledStartTrialBtn: {
    backgroundColor: COLORS.accent,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    width: 200,
    marginTop: -5,
    marginBottom: SPACING.md,
    zIndex: 2,
    opacity: 0.8,
  },
  startTrialBtnText: {
    color: COLORS.white,
    fontSize: 16,
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
    backgroundColor: "transparent",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.gold,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xl,
    alignItems: "center",
    minWidth: 190,
    maxWidth: 200,
    borderStyle: "solid",
    shadowColor: COLORS.white,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    marginRight: SPACING.lg,
  },
  priceAnnual: {
    color: COLORS.gold,
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "Vollkorn-Bold",
  },
  saveText: {
    color: COLORS.gold,
    fontSize: 16,
    fontFamily: "Vollkorn-Regular",
    marginTop: SPACING.xs,
  },
  testimonialBlock: {
    maxWidth: 180,
    marginBottom: 4,
  },
  testimonialText: {
    color: COLORS.gold,
    fontSize: 17,
    fontFamily: "Vollkorn-MediumItalic",
    fontStyle: "italic",
    textAlign: "right",
    lineHeight: 28,
  },
  testimonialAuthor: {
    color: COLORS.gold,
    fontSize: 17,
    fontFamily: "Vollkorn-MediumItalic",
    fontStyle: "italic",
    textAlign: "right",
    marginTop: 8,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
    flexWrap: "wrap",
    width: "100%",
  },
  footerLink: {
    color: COLORS.gold,
    fontSize: 15,
    fontFamily: "Vollkorn-SemiBold",
    marginHorizontal: SPACING.xs,
    textAlign: "center",
  },
  loadingText: {
    color: COLORS.mid,
    fontSize: 16,
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
  featureIconImg: {
    width: 32,
    height: 32,
    marginRight: SPACING.md,
    resizeMode: "contain",
  },
  selectedBox: {
    borderColor: COLORS.gold,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
