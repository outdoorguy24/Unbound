import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CelebrateBlockModal() {
  const router = useRouter();

  // Placeholder: Replace with real block start logic
  const handleConfirm = () => {
    // TODO: Start block session and lock UI
    router.back();
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
        <Text style={styles.warning}>WARNING</Text>
        <FontAwesome5 name="exclamation-triangle" size={40} color="#A05A1A" style={{ marginVertical: 12 }} />
        <Text style={styles.body}>
          You're about to embark on an act of rebellion. You're going to stop giving into distractions. You're going to stop giving your precious attention to corporate tech overlords. You're going to create more than you consume. Welcome back.
        </Text>
        <Text style={styles.subtext}>You're halfway to joining at 100 hours.</Text>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Start Block and Get Your Life Back</Text>
        </TouchableOpacity>
        <Text style={styles.fyi}>
          FYI: once you start the block, there is NO way to end it until time is up. A little scary huh?
        </Text>
      </View>
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
  warning: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4B3415',
    marginBottom: 8,
    letterSpacing: 2,
  },
  body: {
    fontSize: 18,
    color: '#2C1A05',
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 16,
    color: '#4B3415',
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmButton: {
    backgroundColor: '#4B3415',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  fyi: {
    fontSize: 13,
    color: '#A05A1A',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
}); 