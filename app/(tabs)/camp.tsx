import { COLORS, SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { getUserProfile } from "@/lib/supabaseUserProfile";
import { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

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

// 4. Calculate streak days (random for placeholder)
function calculateStreakDays(): number {
  return Math.floor(Math.random() * 50) + 1; // 1-50
}

export default function CampScreen() {
  const { user: contextUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [partner, setPartner] = useState<any>(null);
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
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

      // TODO: Replace with real streak/time logic
      const streakDays = calculateStreakDays();
      const partnerStreak = calculateStreakDays();
      const timeSaved = Math.floor(Math.random() * 741) + 60; // 60-800
      const totalUsers = Math.floor(Math.random() * 1201) + 800; // 800-2000
      const totalTimeSaved = Math.floor(Math.random() * 100001) + 50000; // 50,000-150,000

      setUser({
        userId: supaUser.id,
        firstName: userProfile?.first_name || "Warrior",
        streakDays,
        timeSavedThisWeek: timeSaved,
      });

      const partnerId = supaUser.id;
      let partnerProfile = null;
      try {
        if (partnerId) {
          partnerProfile = await getUserProfile(partnerId);
          console.log("🏕️ Camp: Partner profile fetch result:", partnerProfile);
        } else {
          console.log("🏕️ Camp: No partner ID available");
        }
      } catch (error) {
        console.error("🏕️ Camp: Error fetching partner profile:", error);
      }

      try {
        setPartner(
          partnerProfile
            ? {
                name: partnerProfile.first_name,
                city: partnerProfile.city,
                streakDays: partnerStreak,
                status: getPartnerStatus(partnerStreak),
              }
            : null
        );
      } catch (error) {
        console.error("🏕️ Camp: Error setting partner data:", error);
      }

      try {
        setCommunity({
          totalUsers,
          totalTimeSaved,
        });
      } catch (error) {
        console.error("🏕️ Camp: Error setting community data:", error);
      }

      try {
        setLoading(false);
      } catch (error) {
        console.error("🏕️ Camp: Error setting loading state:", error);
      }
    }
    fetchData();
  }, [contextUser]);

  if (loading) {
    return (
      <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg} resizeMode="cover">
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading your warrior status...</Text>
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
            <Text style={[styles.sectionTitle, styles.centeredText]}>WELCOME TO UNBOUND</Text>
            <Text style={styles.timeCompare}>Your journey begins now.</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg} resizeMode="cover">
      <View style={styles.centered}>
        <Image source={require("../../assets/images/camp-avatar.png")} style={styles.avatar} />
        <Text style={styles.heroName}>{user.firstName}</Text>
        <Text style={styles.heroSubtitle}>Day {user.streakDays} of your liberation</Text>

        <View style={styles.sectionBox}>
          <Text style={[styles.sectionTitle, styles.centeredText]}>Time reclaimed this week</Text>
          <View style={[styles.rowCenter, styles.centeredRow]}>
            <Image source={require("../../assets/images/clock.png")} style={styles.sectionIcon} />
            <Text style={styles.timeSaved}>{formatTimeSaved(user.timeSavedThisWeek)}</Text>
          </View>
          <Text style={styles.timeCompare}>{getTimeComparison(user.timeSavedThisWeek)}</Text>
        </View>

        <View style={styles.sectionBox}>
          <View style={styles.rowCenter}>
            <Image source={require("../../assets/images/handshake.png")} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Your accountability partner</Text>
          </View>
          <View style={styles.rowCenter}>
            <Text style={styles.partnerHighlight}>
              {partner
                ? `${partner.name} from ${partner.city} - Day ${partner.streakDays}`
                : "Your partner is setting up their profile"}
            </Text>
          </View>
          {partner && <Text style={styles.partnerStatus}>{partner.status}</Text>}
        </View>

        <View style={styles.sectionBox}>
          <View style={styles.rowCenter}>
            <Image source={require("../../assets/images/axe.png")} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>This week&apos;s warriors</Text>
          </View>
          <View style={styles.rowCenter}>
            <Text style={styles.communityStats}>You and {community.totalUsers.toLocaleString()} others reclaimed</Text>
          </View>
          <Text style={styles.communityTime}>{formatTimeSaved(community.totalTimeSaved)}</Text>
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
  centered: {
    flex: 1,
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
    marginBottom: 18,
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
    textAlign: "left",
    width: "100%",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 6,
    width: "100%",
  },
  centeredRow: {
    justifyContent: "center",
  },
  centeredText: {
    textAlign: "center",
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
    fontSize: 15,
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
    textAlign: "left",
    width: "100%",
  },
  communityStats: {
    fontSize: 16,
    color: "#2C1A05",
    fontFamily: "Vollkorn-Regular",
    marginRight: 4,
  },
  communityTime: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20",
    fontFamily: "Vollkorn-Bold",
    marginTop: 2,
    textAlign: "left",
    width: "100%",
  },
  loadingText: {
    fontSize: 18,
    color: "#2C1A05",
    textAlign: "center",
    marginTop: 32,
    fontFamily: "Vollkorn-Bold",
    width: "92%",
  },
});
