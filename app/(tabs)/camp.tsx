import { COLORS, SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { resetUserPairing } from "@/lib/partnerMatching";
import { supabase } from "@/lib/supabaseClient";
import { getUserProfile } from "@/lib/supabaseUserProfile";
import { getCommunityStats, getPartnerData, getStreak, getTotalBlockedTime } from "@/lib/userTracking";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 1. Format minutes as "X hours, Y minutes"
function formatTimeSaved(minutes: number): string {
  if (!minutes || minutes < 1) return "0 minutes";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} minutes`;
  if (m === 0) return `${h} hours`;
  return `${h} hours, ${m} minutes`;
}

// 2. Motivational text based on time saved
function getTimeComparison(minutes: number): string {
  if (minutes <= 120) return "That's enough time to read a book chapter.";
  if (minutes <= 300) return "That's enough time to learn a new skill.";
  if (minutes <= 600) return "That's enough time to take a cooking class.";
  return "That's enough time to climb a mountain.";
}

// 3. Partner status based on streak
function getPartnerStatus(streakDays: number): string {
  if (streakDays <= 3) return "Getting started";
  if (streakDays <= 10) return "Building momentum";
  if (streakDays <= 20) return "Strong this week";
  return "Unstoppable";
}

export default function CampScreen() {
  const { user: contextUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [partner, setPartner] = useState<any>(null);
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const spinValue = useRef(new Animated.Value(0)).current;

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: authData } = await supabase.auth.getUser();
      const supaUser = authData?.user;

      // DEV MODE: If no supaUser but contextUser exists, use contextUser and fake data
      if (__DEV__ && !supaUser && contextUser) {
        setUser({
          userId: contextUser.id,
          firstName: contextUser.name || "Dev",
          streakDays: 7,
          timeSavedThisWeek: 123,
        });
        setPartner({
          name: "Partner",
          city: "Pairtown",
          streakDays: 5,
          status: "Getting started",
        });
        setCommunity({
          totalUsers: 1234,
          totalTimeSaved: 56789,
        });
        setLoading(false);
        return;
      }

      if (!supaUser) {
        setLoading(false);
        return;
      }

      // Get user profile
      const userProfile = await getUserProfile(supaUser.id);

      // Get real streak data
      const streakData = await getStreak(supaUser.id);
      const streakDays = streakData.current_streak || 0;

      // Calculate time saved this week (from Monday to Sunday)
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
      startOfWeek.setHours(0, 0, 0, 0);
      
      const timeSavedThisWeek = await getTotalBlockedTime(supaUser.id, startOfWeek, now) || 0;

      setUser({
        userId: supaUser.id,
        firstName: userProfile?.first_name || "Warrior",
        streakDays,
        timeSavedThisWeek,
      });

      // Get real partner data
      const partnerData = await getPartnerData(supaUser.id);
      
      if (partnerData) {
        setPartner({
          name: partnerData.name,
          city: partnerData.city,
          streakDays: partnerData.streakDays,
          status: getPartnerStatus(partnerData.streakDays),
        });
      } else {
        setPartner(null);
      }

      // Get real community stats
      const communityStats = await getCommunityStats();
      setCommunity(communityStats);

    } catch (error) {
      console.error("🏕️ Camp: Error fetching data:", error);
      // Set fallback data on error
      const { data: authData } = await supabase.auth.getUser();
      const supaUser = authData?.user;
      setUser({
        userId: supaUser?.id || contextUser?.id,
        firstName: "Warrior",
        streakDays: 1,
        timeSavedThisWeek: 0,
      });
      setPartner(null);
      setCommunity({
        totalUsers: 1000,
        totalTimeSaved: 50000,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [contextUser]);

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };

    if (loading) {
      spin();
    }
  }, [loading, spinValue]);

  const handleReset = async () => {
    if (!user?.userId) return;
    const success = await resetUserPairing(user.userId);
    if (success) {
      Alert.alert("Pairing Reset", "Your pairing status has been reset. Please restart the app to find a new partner.");
      await fetchData(); // Refresh data
    } else {
      Alert.alert("Error", "Could not reset pairing. Please try again.");
    }
  };

  if (loading) {
    const spinAnimation = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });
    return (
      <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg} resizeMode="cover">
        <View style={styles.centered}>
          <Animated.Image
            source={require("../../assets/images/onboarding/shield.png")}
            style={[styles.loadingIcon, { transform: [{ rotate: spinAnimation }] }]}
          />
          <Text style={styles.loadingText}>Your freedom is loading...</Text>
        </View>
      </ImageBackground>
    );
  }

  // If no user data after loading, show a fallback
  if (!user) {
    return (
      <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg} resizeMode="cover">
        <View style={styles.centered}>
          <Text style={styles.freeMind}>WARRIOR</Text>
          <Text style={styles.heroName}>GUEST</Text>
          <Text style={styles.heroSubtitle}>Day 1 of your liberation</Text>
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>WELCOME TO UNBOUND</Text>
            <Text style={styles.timeCompare}>Your journey begins now.</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg} resizeMode="cover">
      <ScrollView
        alwaysBounceVertical={true}
        contentContainerStyle={styles.centered}
        showsVerticalScrollIndicator={false}
      >
        <Image source={require("../../assets/images/camp-avatar.png")} style={styles.avatar} />
        <Text style={styles.heroName}>{user.firstName}</Text>
        <Text style={styles.heroSubtitle}>Day {user.streakDays} of your liberation</Text>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Time reclaimed this week</Text>
          <View style={[styles.rowCenter, styles.centeredRow]}>
            <Image source={require("../../assets/images/clock.png")} style={styles.sectionIcon} />
          <Text style={styles.timeSaved}>{formatTimeSaved(user.timeSavedThisWeek)}</Text>
          </View>
          <Text style={styles.timeCompare}>{getTimeComparison(user.timeSavedThisWeek)}</Text>
        </View>

        <View style={styles.sectionBox}>
          <View style={[styles.rowCenter, styles.centeredRow]}>
            <Image source={require("../../assets/images/handshake.png")} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Your accountability partner</Text>
          </View>
          <View style={[styles.rowCenter, styles.centeredRow]}>
            <Text style={styles.partnerHighlight}>
              {partner
                ? `${partner.name} from ${partner.city} - Day ${partner.streakDays}`
                : "Your partner is setting up their profile"}
              </Text>
          </View>
          {partner && <Text style={[styles.partnerStatus, styles.sectionTitle]}>{partner.status}</Text>}
        </View>

        <View style={styles.sectionBox}>
          <View style={[styles.rowCenter, styles.centeredRow]}>
            <Image source={require("../../assets/images/axe.png")} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>This week&apos;s warriors</Text>
          </View>
          <View style={[styles.rowCenter, styles.centeredRow]}>
          <Text style={styles.communityStats}>You and {community.totalUsers.toLocaleString()} others reclaimed</Text>
        </View>
          <Text style={[styles.communityTime, styles.sectionTitle]}>{formatTimeSaved(community.totalTimeSaved)}</Text>
        </View>

        {__DEV__ && (
          <TouchableOpacity style={styles.devButton} onPress={handleReset}>
            <Text style={styles.devButtonText}>Reset Pairing (Dev)</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  centered: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: SPACING.xxxl,
    paddingBottom: 24,
  },
  freeMind: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    marginTop: SPACING.xl,
    marginBottom: 8,
    textAlign: "center",
    width: "92%",
  },
  avatar: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginBottom: 12,
  },
  heroName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    marginBottom: 0,
    textAlign: "center",
    width: "92%",
  },
  heroSubtitle: {
    fontSize: 18,
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    textAlign: "center",
    width: "92%",
  },
  sectionBox: {
    borderWidth: 1.5,
    borderColor: "#E6D3A7",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    width: "92%",
    alignItems: "flex-start",
    backgroundColor: COLORS.textGold,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    marginBottom: 8,
    textAlign: "center",
    alignSelf: "center",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    width: "100%",
  },
  centeredRow: {
    justifyContent: "center",
  },
  sectionIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: "contain",
  },
  timeSaved: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
  },
  timeCompare: {
    fontSize: 16,
    color: "#2C1A05",
    fontFamily: "Vollkorn-SemiBold",
    marginTop: 2,
    textAlign: "center",
    width: "100%",
  },
  partnerHighlight: {
    fontSize: 18,
    color: "#1B5E20",
    fontFamily: "Vollkorn-Bold",
    textDecorationLine: "underline",
  },
  partnerStatus: {
    fontSize: 16,
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    marginTop: 2,
    width: "100%",
  },
  communityStats: {
    fontSize: 16,
    color: "#2C1A05",
    fontFamily: "Vollkorn-SemiBold",
    marginRight: 4,
    textAlign: "center",
  },
  communityTime: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20",
    fontFamily: "Vollkorn-Bold",
    marginTop: 2,
    width: "100%",
  },
  loadingText: {
    fontSize: 18,
    color: "#2C1A05",
    textAlign: "center",
    marginTop: 16,
    fontFamily: "Vollkorn-Bold",
  },
  loadingIcon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  devButton: {
    backgroundColor: "#A52A2A",
    padding: SPACING.md,
    borderRadius: SPACING.sm,
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  devButtonText: {
    color: "white",
    textAlign: "center",
    fontFamily: "Vollkorn-Bold",
  },
});
