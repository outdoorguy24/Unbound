import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScreenContainer>
      <ScreenHeader title="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>[Placeholder] Your privacy is important to us. This is where the privacy policy will go.</Text>
        {/* TODO: Replace with real privacy policy */}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  text: {
    fontSize: 15,
    color: '#2C1A05',
  },
}); 