import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TrailLogScreen() {
  // Placeholder state for stats
  const [stats, setStats] = useState({
    timeSaved: 0,
    productivity: 0,
    totalBlocks: 0,
    streakDays: 0,
    progress: 0,
  });
  const router = useRouter();

  // Simulate progress bar updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        progress: prev.progress < 100 ? prev.progress + 1 : 100,
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScreenContainer>
      <ScreenHeader title="Trail Log" />
      <Text style={styles.heading}>Total time reclaimed since installation</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.timeSaved}m</Text>
          <Text style={styles.statLabel}>TIME SAVED</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.productivity}%</Text>
          <Text style={styles.statLabel}>PRODUCTIVITY GAIN</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.totalBlocks}</Text>
          <Text style={styles.statLabel}>TOTAL BLOCKS</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.streakDays}</Text>
          <Text style={styles.statLabel}>STREAK DAYS</Text>
        </View>
      </View>
      <View style={styles.milestoneBox}>
        <FontAwesome5 name="flag-checkered" size={24} color="#fff" style={{ marginBottom: 8 }} />
        <Text style={styles.milestoneLabel}>Next Milestone</Text>
        <Text style={styles.milestoneValue}>100 HOURS</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBar, { width: `${stats.progress}%` }]} />
        </View>
        <TouchableOpacity style={styles.milestoneButton} onPress={() => router.push('/modals/milestone')}>
          <Text style={styles.milestoneButtonText}>View Milestone</Text>
        </TouchableOpacity>
      </View>
      {/* TODO: Replace stats, progress, and icons with real data/assets */}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
    color: '#2C1A05',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#F7E0A3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1A05',
  },
  statLabel: {
    fontSize: 12,
    color: '#4B3415',
    marginTop: 4,
  },
  milestoneBox: {
    backgroundColor: '#4B3415',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  milestoneLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  milestoneValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#E5C98B',
    borderRadius: 5,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  milestoneButton: {
    backgroundColor: '#E5C98B',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 10,
  },
  milestoneButtonText: {
    color: '#4B3415',
    fontWeight: 'bold',
  },
}); 