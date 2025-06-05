import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAuth } from '@/contexts/AuthContext';
import { findOrCreatePartner } from '@/lib/partnerMatching';
import { getUserProfile } from '@/lib/supabaseUserProfile';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Screen9() {
  const router = useRouter();
  const { user } = useAuth();
  const [searching, setSearching] = useState(true);
  const [partnerProfile, setPartnerProfile] = useState<any>(null);
  const [dotIndex, setDotIndex] = useState(0);
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    let dotTimer: ReturnType<typeof setInterval>;
    let searchTimer: ReturnType<typeof setTimeout>;
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
    return () => {
      clearTimeout(searchTimer);
      clearInterval(dotTimer);
    };
  }, [user]);

  // Progress dots
  const dots = [0, 1, 2].map((i) => (
    <View
      key={i}
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 4,
        backgroundColor: dotIndex === i ? '#4B3415' : '#D6C08A',
      }}
    />
  ));

  return (
    <ScreenContainer>
      <ScreenHeader title="" />
      <View style={styles.centered}>
        <Text style={styles.bigTitle}>FINDING YOUR BATTLE PARTNER</Text>
        <Text style={styles.subtitle}>Every warrior needs someone watching their back.</Text>
        {/* Placeholder illustration */}
        <View style={styles.illustration}><Text>[icon]</Text></View>
        {searching ? (
          <>
            <Text style={styles.searching}>Searching for your accountability partner{'.'.repeat((dotIndex % 3) + 1)}</Text>
          </>
        ) : matched && partnerProfile ? (
          <>
            <Text style={styles.success}>You've been paired with <Text style={styles.partnerName}>{partnerProfile.first_name} from {partnerProfile.city}</Text>!</Text>
            <TouchableOpacity style={styles.continueBtn} onPress={() => router.replace('/defend')}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.noMatch}>You're first in line - your partner will join soon!</Text>
            <TouchableOpacity style={styles.continueBtn} onPress={() => router.replace('/defend')}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={styles.dotsRow}>{dots}</View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  bigTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C1A05',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 18,
    color: '#2C1A05',
    textAlign: 'center',
    marginBottom: 24,
  },
  illustration: {
    width: 180,
    height: 120,
    backgroundColor: '#F7F2E0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  searching: {
    fontSize: 20,
    color: '#4B3415',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  success: {
    fontSize: 20,
    color: '#2C1A05',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  partnerName: {
    color: '#A05A1A',
    fontWeight: 'bold',
  },
  noMatch: {
    fontSize: 20,
    color: '#2C1A05',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  continueBtn: {
    backgroundColor: '#4B3415',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
}); 