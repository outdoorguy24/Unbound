import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { registerForPushNotificationsAsync, sendTestNotification } from '@/utils/notifications';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

const SETTINGS = [
  { label: 'Theme', icon: <Feather name="moon" size={20} color="#4B3415" />, route: '/profile/theme' },
  { label: 'Weekly Summary', icon: <Feather name="calendar" size={20} color="#4B3415" />, route: '/profile/weekly-summary' },
  { label: 'Privacy Policy', icon: <Feather name="lock" size={20} color="#4B3415" />, route: '/profile/privacy-policy' },
];
const ACCOUNT = [
  { label: 'Talk with the Founder', icon: <MaterialIcons name="message" size={20} color="#4B3415" />, route: '/profile/founder' },
  { label: 'Export Data', icon: <Feather name="download" size={20} color="#4B3415" />, route: '/profile/export-data' },
  { label: 'Delete Account', icon: <Feather name="trash-2" size={20} color="#4B3415" />, route: '/profile/delete-account' },
];

export default function ProfileScreen() {
  const router = useRouter();
  return (
    <ScreenContainer>
      <ScreenHeader title="Profile" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {SETTINGS.map((item) => (
          <TouchableOpacity key={item.label} style={styles.row} onPress={() => router.push(item.route)}>
            {item.icon}
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Feather name="chevron-right" size={20} color="#4B3415" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        ))}
        <Text style={styles.sectionTitle}>Account</Text>
        {ACCOUNT.map((item) => (
          <TouchableOpacity key={item.label} style={styles.row} onPress={() => router.push(item.route)}>
            {item.icon}
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Feather name="chevron-right" size={20} color="#4B3415" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.logoutButton} onPress={() => {/* TODO: Add logout logic */}}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        {/* DEV-ONLY: Push notification test button */}
        {__DEV__ && (
          <>
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: '#F7E0A3', marginTop: 16 }]}
              onPress={registerForPushNotificationsAsync}
            >
              <Text style={[styles.logoutText, { color: '#4B3415' }]}>Register for Push Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: '#F7E0A3', marginTop: 8 }]}
              onPress={sendTestNotification}
            >
              <Text style={[styles.logoutText, { color: '#4B3415' }]}>Send Test Notification</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B3415',
    marginTop: 24,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7E0A3',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  rowLabel: {
    fontSize: 16,
    color: '#2C1A05',
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: '#4B3415',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 32,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 