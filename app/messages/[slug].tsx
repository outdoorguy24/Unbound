import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MessageScreen() {
  const { slug } = useLocalSearchParams();
  return (
    <ScreenContainer>
      <ScreenHeader title="Message" />
      <View style={styles.content}>
        <Text style={styles.heading}>Message: {slug}</Text>
        {/* TODO: Render message content here based on slug */}
        <Text style={styles.placeholder}>[Message content will appear here]</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C1A05',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 16,
    color: '#4B3415',
    marginTop: 16,
  },
}); 