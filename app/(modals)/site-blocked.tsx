import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAuth } from '@/contexts/AuthContext';
import { getStreak, getTotalBlockedTime } from '@/lib/userTracking';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SiteBlockedModal() {
  const router = useRouter();
  const { user } = useAuth();
  const [timeSavedToday, setTimeSavedToday] = useState<number>(0);
  const [daysReclaimed, setDaysReclaimed] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Get time saved today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const timeToday = await getTotalBlockedTime(user.id, today, new Date());
        setTimeSavedToday(timeToday || 0);

        // Get streak days (days reclaimed)
        const streakData = await getStreak(user.id);
        setDaysReclaimed(streakData.current_streak || 0);
      } catch (error) {
        console.error('Error fetching blocked site data:', error);
        // Set fallback values
        setTimeSavedToday(0);
        setDaysReclaimed(0);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const formatTimeSaved = (minutes: number): string => {
    if (!minutes || minutes < 1) return "0h";
    const hours = minutes / 60;
    return `${hours.toFixed(1)}h`;
  };

  return (
    <ScreenContainer>
      <ScreenHeader 
        title="" 
        right={
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome5 name="times" size={24} color="#4B3415" />
          </TouchableOpacity>
        } 
      />
      <View style={styles.centered}>
        {/* TODO: Replace with real illustration */}
        <FontAwesome5 name="shield-alt" size={64} color="#E5C98B" style={{ marginBottom: 24 }} />
        <Text style={styles.heading}>Site Blocked</Text>
        <Text style={styles.body}>
          This site is currently blocked. Remember why you started this journey.
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {loading ? "..." : formatTimeSaved(timeSavedToday)}
            </Text>
            <Text style={styles.statLabel}>Time Saved Today</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {loading ? "..." : `${daysReclaimed}d`}
            </Text>
            <Text style={styles.statLabel}>Days Reclaimed</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Continue Your Journey</Text>
        </TouchableOpacity>
      </View>
      {/* TODO: Replace with real block logic and assets */}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B3415',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: '#4B3415',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  statBox: {
    backgroundColor: '#F7E0A3',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1A05',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#4B3415',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4B3415',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 