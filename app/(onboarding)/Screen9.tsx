import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FAKE_NAMES = ['Jake', 'Marcus', 'Alex'];

// Stub for future backend integration
async function pairWithAccountabilityPartner(userId: string): Promise<{ matched: boolean; partnerName?: string }> {
  // TODO: Connect to Supabase accountability_pairs table
  // Simulate 50/50 match
  const matched = Math.random() < 0.5;
  if (matched) {
    const partnerName = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
    return { matched: true, partnerName };
  }
  return { matched: false };
}

export default function Screen9() {
  const router = useRouter();
  const [searching, setSearching] = useState(true);
  const [result, setResult] = useState<{ matched: boolean; partnerName?: string } | null>(null);
  const [dotIndex, setDotIndex] = useState(0);

  // Simulate searching animation and matching logic
  useEffect(() => {
    let dotTimer: NodeJS.Timeout;
    let searchTimer: NodeJS.Timeout;
    // Animate dots
    dotTimer = setInterval(() => setDotIndex((i) => (i + 1) % 3), 400);
    // Simulate 2-3 second search
    searchTimer = setTimeout(async () => {
      const res = await pairWithAccountabilityPartner('user123');
      setResult(res);
      setSearching(false);
      clearInterval(dotTimer);
    }, 2000 + Math.random() * 1000);
    return () => {
      clearTimeout(searchTimer);
      clearInterval(dotTimer);
    };
  }, []);

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
        ) : result?.matched ? (
          <>
            <Text style={styles.success}>You've been paired with <Text style={styles.partnerName}>{result.partnerName}</Text>!</Text>
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