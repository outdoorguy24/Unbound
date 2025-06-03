import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const APPS = [
  { name: 'Instagram', icon: 'instagram', url: 'instagram.com' },
  { name: 'Facebook', icon: 'facebook', url: 'facebook.com' },
  { name: 'YouTube', icon: 'youtube', url: 'youtube.com' },
  { name: 'Reddit', icon: 'reddit', url: 'reddit.com' },
];

export default function DefendScreen() {
  const [blocked, setBlocked] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  const toggleBlock = (app: string) => {
    setBlocked((prev) => ({ ...prev, [app]: !prev[app] }));
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Defend" />
      <Text style={styles.heading}>It's time to put the phone down and pick that hobby back up</Text>
      <Text style={styles.subheading}>Toggle to block or unblock (this will block the app AND the mobile website on your browser so there's no funny business)</Text>
      <View style={styles.list}>
        {APPS.map((app) => (
          <View key={app.name} style={styles.appRow}>
            <FontAwesome name={app.icon as any} size={28} color="#4B3415" style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.appName}>{app.name}</Text>
              <Text style={styles.appUrl}>{app.url}</Text>
            </View>
            <Switch
              value={!!blocked[app.name]}
              onValueChange={() => toggleBlock(app.name)}
              thumbColor={blocked[app.name] ? '#4B3415' : '#ccc'}
              trackColor={{ true: '#E5C98B', false: '#ccc' }}
            />
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/modals/celebrate-block')}>
        <Text style={styles.buttonText}>Defend Your Time</Text>
      </TouchableOpacity>
      {/* TODO: Replace with real block logic and assets */}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    color: '#2C1A05',
  },
  subheading: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    color: '#4B3415',
  },
  list: {
    marginBottom: 24,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7E0A3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1A05',
  },
  appUrl: {
    fontSize: 12,
    color: '#4B3415',
  },
  button: {
    backgroundColor: '#5C3D18',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#F3E2C7',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 