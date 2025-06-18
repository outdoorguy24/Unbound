import { useAuth } from "@/contexts/AuthContext";
import { findOrCreatePartner } from "@/lib/partnerMatching";
import { getUserProfile } from "@/lib/supabaseUserProfile";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Screen13() {
  const router = useRouter();
  const { user } = useAuth();
  const [searching, setSearching] = useState(true);
  const [partnerProfile, setPartnerProfile] = useState<any>(null);
  const [dotIndex, setDotIndex] = useState(0);
  const [matched, setMatched] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    let dotTimer: ReturnType<typeof setInterval>;
    let searchTimer: ReturnType<typeof setTimeout>;
    let redirectTimer: ReturnType<typeof setTimeout>;
    dotTimer = setInterval(() => setDotIndex((i) => (i + 1) % 3), 400);
    // Simulate 2-3 second search
    searchTimer = setTimeout(async () => {
      if (!user?.id) return;
      const res = await findOrCreatePartner(user.id);
      setMatched(res.matched);
      if (res.matched && res.partnerId) {
        const profile = await getUserProfile(res.partnerId);
        setPartnerProfile(profile);
      }
      setSearching(false);
      clearInterval(dotTimer);
    }, 2000 + Math.random() * 1000);
    // Start a 10 second timer to auto-redirect if no partner is found
    redirectTimer = setTimeout(() => {
      setTimeoutReached(true);
      setTimeout(() => {
        router.replace("/(tabs)/camp");
      }, 2000);
    }, 10000);
    return () => {
      clearTimeout(searchTimer);
      clearInterval(dotTimer);
      clearTimeout(redirectTimer);
    };
  }, [router, user]);

  // Progress dots
  const dots = [0, 1, 2].map((i) => (
    <View
      key={i}
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 4,
        backgroundColor: dotIndex === i ? "#4B3415" : "#D6C08A",
      }}
    />
  ));

  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <View style={styles.centered}>
        <Text style={styles.bigTitle}>FINDING YOUR ACCOUNTABILITY{"\n"}PARTNER</Text>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            Connecting you with{"\n"}another guy who chooses{"\n"}growth over comfort.
          </Text>
        </View>
        {timeoutReached ? (
          <Text style={styles.noMatch}>No partner found, continuing to the app...</Text>
        ) : searching ? (
          <>
            <Image source={require("../../assets/images/onboarding/partner.png")} style={styles.partnerImg} />
          </>
        ) : matched && partnerProfile ? (
          <>
            <Text style={styles.success}>
              You&apos;ve been paired with{" "}
              <Text style={styles.partnerName}>
                {partnerProfile.first_name} from {partnerProfile.city}
              </Text>
              !
            </Text>
            <Image source={require("../../assets/images/onboarding/partner.png")} style={styles.partnerImg} />
            <TouchableOpacity style={styles.continueBtn} onPress={() => router.replace("/defend")}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.noMatch}>You&apos;re first in line - your partner will join soon!</Text>
            <Image source={require("../../assets/images/onboarding/partner.png")} style={styles.partnerImg} />
            <TouchableOpacity style={styles.continueBtn} onPress={() => router.replace("/defend")}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={styles.dotsRow}>{dots}</View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  bigTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2C1A05",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 1.2,
    fontFamily: "Vollkorn-Bold",
  },
  messageBox: {
    borderWidth: 1.5,
    borderColor: "#4B3415",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 32,
    backgroundColor: "rgba(255,255,255,0.15)",
    width: "100%",
  },
  messageText: {
    fontSize: 22,
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    textAlign: "center",
    lineHeight: 32,
  },
  partnerImg: {
    width: 320,
    height: 160,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 32,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  searching: {
    fontSize: 22,
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    textAlign: "center",
    lineHeight: 32,
  },
  success: {
    fontSize: 22,
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    textAlign: "center",
    lineHeight: 32,
  },
  noMatch: {
    fontSize: 22,
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    textAlign: "center",
    lineHeight: 32,
  },
  partnerName: {
    fontSize: 22,
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    textAlign: "center",
    lineHeight: 32,
  },
  continueBtn: {
    backgroundColor: "#4B3415",
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  continueText: {
    fontSize: 22,
    color: "#FFFFFF",
    fontFamily: "Vollkorn-Bold",
    textAlign: "center",
  },
});
