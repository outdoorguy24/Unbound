import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CampScreen() {
  // Placeholder state for stats
  const [stats, setStats] = useState({
    hoursPerDay: 5.4,
    daysPerYear: 82,
    yearsOfLife: 13,
  });

  // Simulate stat updates (for demo)
  useEffect(() => {
    // Example: could update stats here
  }, []);

  return (
    <ScreenContainer>
      <ScreenHeader title="Camp" />
      <Text style={styles.heading}>YOU WERE BORN TO DO MORE THAN SCROLL</Text>
      <Text style={styles.subheading}>UNBOUND YOURSELF</Text>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Average number of hours spent on our phones per day:</Text>
        <Text style={styles.statValue}>{stats.hoursPerDay} hours</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Days wasted per year on our phones:</Text>
        <Text style={styles.statValue}>{stats.daysPerYear} days</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Years of your life you will spend consuming instead of creating unless you do something about it:</Text>
        <Text style={styles.statValue}>{stats.yearsOfLife} years</Text>
      </View>
      <View style={styles.iconRow}>
        <FontAwesome5 name="campground" size={28} color="#4B3415" />
        <FontAwesome5 name="shield-alt" size={28} color="#4B3415" />
        <FontAwesome5 name="hiking" size={28} color="#4B3415" />
        <FontAwesome5 name="user-tie" size={28} color="#4B3415" />
      </View>
      {/* TODO: Replace stats, icons, and text with real data/assets */}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    color: '#2C1A05',
    textTransform: 'uppercase',
  },
  subheading: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#2C1A05',
    letterSpacing: 1.1,
  },
  statBox: {
    backgroundColor: '#F7E0A3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#4B3415',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1A05',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    marginBottom: 8,
  },
}); 