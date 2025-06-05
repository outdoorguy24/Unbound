import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { supabase } from '@/lib/supabaseClient';
import { getUserProfile } from '@/lib/supabaseUserProfile';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// --- Helper Functions ---

// 1. Format minutes as "X hours, Y minutes"
function formatTimeSaved(minutes: number): string {
  if (!minutes || minutes < 1) return '0 minutes';
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
  if (streakDays <= 3) return 'Getting started';
  if (streakDays <= 10) return 'Building momentum';
  if (streakDays <= 20) return 'Strong this week';
  return 'Unstoppable';
}

// 4. Calculate streak days (random for placeholder)
function calculateStreakDays(): number {
  return Math.floor(Math.random() * 50) + 1; // 1-50
}

// --- Main Component ---

export default function CampScreen() {
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
        firstName: userProfile?.first_name || 'Warrior',
        streakDays,
        timeSavedThisWeek: timeSaved,
      });

      // Fetch partnerId (stub: replace with real logic)
      // For now, simulate a partnerId (could be null for no partner)
      const partnerId = supaUser.id === '1' ? '2' : '1'; // Replace with real matching logic
      let partnerProfile = null;
      if (partnerId) {
        partnerProfile = await getUserProfile(partnerId);
      }
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

      setCommunity({
        totalUsers,
        totalTimeSaved,
      });
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading || !user || !community) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Camp" />
        <Text>Loading...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Camp" />
      <View style={styles.centered}>
        <Text style={styles.heroTitle}>WARRIOR</Text>
        <Text style={styles.heroName}>{user.firstName.toUpperCase()}</Text>
        <Text style={styles.heroSubtitle}>Day {user.streakDays} of your liberation</Text>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>TIME RECLAIMED THIS WEEK</Text>
          <Text style={styles.timeSaved}>{formatTimeSaved(user.timeSavedThisWeek)}</Text>
          <Text style={styles.timeCompare}>{getTimeComparison(user.timeSavedThisWeek)}</Text>
        </View>

        <View style={styles.sectionBoxNoBorder}>
          <Text style={styles.sectionTitle}>YOUR ACCOUNTABILITY PARTNER</Text>
          {partner ? (
            <>
              <Text style={styles.partnerName}>{partner.name} from {partner.city} – Day {partner.streakDays}</Text>
              <Text style={styles.partnerStatus}>{partner.status}</Text>
            </>
          ) : (
            <Text style={styles.partnerName}>Your partner is setting up their profile</Text>
          )}
        </View>

        <View style={styles.sectionBoxNoBorder}>
          <Text style={styles.sectionTitle}>THIS WEEK'S WARRIORS</Text>
          <Text style={styles.communityStats}>You and {community.totalUsers.toLocaleString()} others reclaimed</Text>
          <Text style={styles.communityTime}>{formatTimeSaved(community.totalTimeSaved)}</Text>
        </View>

        <View style={styles.footerBox}>
          <Text style={styles.footerText}>Your ancestors conquered wildernesses.</Text>
          <Text style={styles.footerText}>You're being conquered by notifications.</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
    backgroundColor: '#F3E2C7',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C1A05',
    marginTop: 8,
    letterSpacing: 1.5,
  },
  heroName: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#2C1A05',
    marginBottom: 4,
    letterSpacing: 1.5,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#2C1A05',
    marginBottom: 18,
  },
  sectionBox: {
    borderWidth: 2,
    borderColor: '#D6C08A',
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    width: '95%',
    alignItems: 'center',
    backgroundColor: '#F7F2E0',
  },
  sectionBoxNoBorder: {
    borderTopWidth: 2,
    borderColor: '#D6C08A',
    padding: 18,
    marginBottom: 8,
    width: '95%',
    alignItems: 'center',
    backgroundColor: '#F7F2E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1A05',
    marginBottom: 6,
  },
  timeSaved: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C1A05',
    marginBottom: 4,
  },
  timeCompare: {
    fontSize: 16,
    color: '#2C1A05',
    marginBottom: 2,
  },
  partnerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1A05',
    marginBottom: 2,
  },
  partnerStatus: {
    fontSize: 16,
    color: '#2C1A05',
    marginBottom: 2,
  },
  communityStats: {
    fontSize: 16,
    color: '#2C1A05',
    marginBottom: 2,
  },
  communityTime: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C1A05',
    marginBottom: 2,
  },
  footerBox: {
    marginTop: 18,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#2C1A05',
  },
}); 