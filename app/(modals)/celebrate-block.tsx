import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CelebrateBlockModal() {
  const router = useRouter();
  return (
    <ScreenContainer>
      <ScreenHeader title="" right={<TouchableOpacity onPress={() => router.back()}><FontAwesome5 name="times" size={24} color="#4B3415" /></TouchableOpacity>} />
      <View style={styles.centered}>
        {/* TODO: Replace with real illustration */}
        <FontAwesome5 name="tree" size={64} color="#E5C98B" style={{ marginBottom: 24 }} />
        <Text style={styles.heading}>You've done it.</Text>
        <Text style={styles.body}>Now go touch a tree and do some jumping jacks to celebrate.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B3415',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: '#4B3415',
    textAlign: 'center',
    marginBottom: 16,
  },
}); 