import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAuth } from '@/contexts/AuthContext';
import { getTrailLog } from '@/lib/trailLog';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const MILESTONES = [10, 50, 100, 500, 1000]; // in days

function calcTimeSavedDays(logs: { action: string; created_at: string }[]) {
  // Find all enable/disable pairs and sum durations
  let totalMs = 0;
  let lastEnabled: Date | null = null;
  logs.forEach((log) => {
    if (log.action === 'blocking_enabled') {
      lastEnabled = new Date(log.created_at);
    } else if (log.action === 'blocking_disabled' && lastEnabled !== null) {
      const disabledAt = new Date(log.created_at);
      totalMs += disabledAt.getTime() - (lastEnabled as Date).getTime();
      lastEnabled = null;
    }
  });
  // If still enabled at end, count up to now
  if (lastEnabled !== null) {
    totalMs += Date.now() - (lastEnabled as Date).getTime();
  }
  return totalMs / (1000 * 60 * 60 * 24); // convert ms to days
}

function calcTotalBlocks(logs: any[]) {
  return logs.filter((log) => log.action === 'blocked_attempt').length;
}

function calcStreakDays(logs: any[]) {
  // Get all days with at least one block/streak action
  const days = new Set(
    logs
      .filter((log) =>
        log.action === 'blocked_attempt' || log.action === 'streak_day')
      .map((log) => new Date(log.created_at).toISOString().slice(0, 10))
  );
  // Sort days descending
  const sorted = Array.from(days).sort((a, b) => b.localeCompare(a));
  if (sorted.length === 0) return 0;
  // Count consecutive days from today backwards
  let streak = 0;
  let d = new Date();
  for (let i = 0; i < sorted.length; i++) {
    const dayStr = d.toISOString().slice(0, 10);
    if (sorted.includes(dayStr)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function getNextMilestone(currentDays: number) {
  for (let m of MILESTONES) {
    if (currentDays < m) return m;
  }
  return null;
}

export default function TrailLogScreen() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      if (!user?.id) return;
      setLoading(true);
      const data = await getTrailLog(user.id, { limit: 500 }); // get enough for streaks
      setLogs(data || []);
      setLoading(false);
    }
    fetchLogs();
  }, [user]);

  if (loading) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Trail Log" />
        <ActivityIndicator size="large" color="#4B3415" style={{ marginTop: 40 }} />
      </ScreenContainer>
    );
  }

  const timeSavedDays = calcTimeSavedDays(logs);
  const totalBlocks = calcTotalBlocks(logs);
  const streakDays = calcStreakDays(logs);
  const nextMilestone = getNextMilestone(timeSavedDays);

  return (
    <ScreenContainer>
      <ScreenHeader title="Trail Log" />
      <Text style={styles.subtitle}>Total time reclaimed since installation</Text>
      <View style={styles.gridRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{timeSavedDays.toFixed(1)}d</Text>
          <Text style={styles.statLabel}>TIME SAVED</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>0%</Text>
          <Text style={styles.statLabel}>PRODUCTIVITY GAIN</Text>
        </View>
      </View>
      <View style={styles.gridRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalBlocks}</Text>
          <Text style={styles.statLabel}>TOTAL BLOCKS</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{streakDays}</Text>
          <Text style={styles.statLabel}>STREAK DAYS</Text>
        </View>
      </View>
      <View style={styles.milestoneBox}>
        <Text style={styles.milestoneLabel}>Next Milestone</Text>
        <Text style={styles.milestoneValue}>{nextMilestone ? `${nextMilestone * 24} HOURS` : '🎉'}</Text>
        <Text style={styles.milestoneSub}>TIME SAVED GOAL</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: '#4B3415',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#E2C89A',
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    paddingVertical: 18,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C1A05',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#4B3415',
    fontWeight: 'bold',
    letterSpacing: 1.1,
  },
  milestoneBox: {
    backgroundColor: '#4B3415',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 18,
    marginHorizontal: 8,
  },
  milestoneLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  milestoneValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  milestoneSub: {
    color: '#fff',
    fontSize: 14,
    letterSpacing: 1.1,
  },
}); 