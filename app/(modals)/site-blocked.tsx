import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SiteBlockedModal() {
  const router = useRouter();
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
            <Text style={styles.statValue}>5.4h</Text>
            <Text style={styles.statLabel}>Time Saved Today</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>82d</Text>
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