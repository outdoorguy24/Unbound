import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Purchases, { CustomerInfo, PurchasesOffering, PurchasesPackage } from "react-native-purchases";

const termsUrl = "https://yourdomain.com/terms";
const privacyUrl = "https://yourdomain.com/privacy";
const testimonial = '"Unbound helped me reclaim 12 hours a week — now I hike, train, and read again."';
const testimonialAuthor = "James M., Texas";

const COLORS = {
  background: "#F3E2C7",
  accent: "#A05A1A",
  dark: "#2C1A05",
  mid: "#4B3415",
  green: "#265C28",
  white: "#F3E2C7",
  orange: "#E2C89A",
};

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
      try {
        // Skip RevenueCat in development mode
        if (__DEV__) {
          setError("Development mode - subscription disabled");
          setLoading(false);
          return;
        }

        await Purchases.configure({ apiKey: "appl_BYmaCExMCUEVMmUPdbhHAqZMqSx" });
        if (user?.id) {
          await Purchases.logIn(user.id);
        }
        const { current } = await Purchases.getOfferings();
        if (current && current.availablePackages.length > 0) {
          setOfferings(current);
          setSelected(current.availablePackages[0]);
        } else {
          setError("No subscription options available.");
        }
      } catch (e: any) {
        setError(e.message || "Failed to load subscription options.");
      }
      setLoading(false);
    }
    setupRevenueCat();
  }, [user]);

  const handlePurchase = async () => {
    // Skip purchase in development mode
    if (__DEV__) {
      router.replace("/(tabs)/camp");
      return;
    }

    if (!selected) return;
    setPurchasing(true);
    setError(null);
    try {
      const { customerInfo } = await Purchases.purchasePackage(selected);
      if (customerInfo.activeSubscriptions.length > 0) {
        // Unlock app, navigate to main app
        router.replace("/(tabs)/camp");
      } else {
        setError("Subscription not activated.");
      }
    } catch (e: any) {
      setError(e.message || "Purchase failed.");
    }
    setPurchasing(false);
  };

  const handleRestore = async () => {
    setPurchasing(true);
    setError(null);
    try {
      const info: CustomerInfo = await Purchases.restorePurchases();
      if (info.activeSubscriptions.length > 0) {
        router.replace("/(tabs)/camp");
      } else {
        setError("No active subscription found.");
      }
    } catch (e: any) {
      setError(e.message || "Restore failed.");
    }
    setPurchasing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Loading subscription options…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Placeholder for illustration */}
      <View style={styles.illustration} />
      <Text style={styles.heading}>Take Back Your Life.</Text>
      <Text style={styles.subheading}>Stop choosing the screen over everything that matters.</Text>
      <View style={styles.bullets}>
        <Text style={styles.bullet}>• Block distractions before they block you</Text>
        <Text style={styles.bullet}>• Build unstoppable focus and discipline</Text>
        <Text style={styles.bullet}>• Reclaim your time, your clarity, your mission</Text>
        <Text style={styles.bullet}>• Stay connected to purpose, not pings</Text>
      </View>
      <View style={styles.pricingRow}>
        {offerings?.availablePackages.map((pkg) => {
          const isAnnual = pkg.identifier.includes("annual");
          const isSelected = selected?.identifier === pkg.identifier;
          const price = pkg.product.priceString;
          const trial = pkg.product.introPrice
            ? `${pkg.product.introPrice.periodNumberOfUnits} days free`
            : "7-day free trial";
          return (
            <TouchableOpacity
              key={pkg.identifier}
              style={[styles.pricingBox, isSelected && styles.selectedBox, isAnnual && styles.annualBox]}
              onPress={() => setSelected(pkg)}
            >
              {isAnnual && <Text style={styles.savings}>Save 44%!</Text>}
              <Text style={styles.price}>{price}</Text>
              <Text style={styles.trial}>{trial}</Text>
              <Text style={styles.period}>{isAnnual ? "per year" : "per month"}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
        style={[styles.button, purchasing && styles.buttonDisabled]}
        onPress={handlePurchase}
        disabled={purchasing || (!selected && !__DEV__)}
      >
        <Text style={styles.buttonText}>
          {purchasing ? "Processing…" : __DEV__ ? "Continue (Dev Mode)" : "Start Free Trial"}
        </Text>
      </TouchableOpacity>

      {__DEV__ && <Text style={styles.error}>Development mode: RevenueCat disabled</Text>}
      <Text style={styles.testimonial}>{testimonial}</Text>
      <Text style={styles.testimonialAuthor}>{testimonialAuthor}</Text>
      <View style={styles.linksRow}>
        <Text style={styles.link} onPress={() => Linking.openURL(termsUrl)}>
          Terms of Use
        </Text>
        <Text style={styles.link} onPress={() => Linking.openURL(privacyUrl)}>
          Privacy Policy
        </Text>
        <Text style={styles.link} onPress={handleRestore}>
          Restore Purchases
        </Text>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  illustration: {
    width: width * 0.7,
    height: width * 0.3,
    backgroundColor: COLORS.orange,
    borderRadius: 24,
    marginBottom: 24,
  },
  heading: {
    color: COLORS.dark,
    fontFamily: "Vollkorn-Bold",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subheading: {
    color: COLORS.mid,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
  },
  bullets: {
    marginBottom: 18,
    alignSelf: "stretch",
    paddingLeft: 12,
  },
  bullet: {
    color: COLORS.dark,
    fontSize: 16,
    marginBottom: 2,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 18,
    width: "100%",
  },
  pricingBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 18,
    marginHorizontal: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.accent,
    minWidth: 120,
  },
  selectedBox: {
    borderColor: COLORS.green,
    borderWidth: 3,
  },
  annualBox: {
    backgroundColor: COLORS.orange,
  },
  savings: {
    color: COLORS.green,
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  price: {
    color: COLORS.dark,
    fontSize: 22,
    fontWeight: "bold",
  },
  trial: {
    color: COLORS.mid,
    fontSize: 14,
    marginBottom: 2,
  },
  period: {
    color: COLORS.mid,
    fontSize: 13,
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 18,
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  testimonial: {
    color: COLORS.mid,
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 2,
  },
  testimonialAuthor: {
    color: COLORS.green,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  linksRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    flexWrap: "wrap",
  },
  link: {
    color: COLORS.green,
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 8,
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
    marginBottom: 8,
    textAlign: "center",
  },
  loadingText: {
    color: COLORS.mid,
    fontSize: 16,
    marginTop: 12,
  },
});
