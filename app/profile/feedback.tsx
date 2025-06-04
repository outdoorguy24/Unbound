import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FeedbackScreen() {
  return (
    <ScreenContainer>
      <ScreenHeader title="Feedback & Feature Request" />
      <View style={styles.centered}>
        <Text style={styles.text}>[Placeholder] Connect this screen to your Google Form for feedback and feature requests.</Text>
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
  text: {
    fontSize: 16,
    color: '#2C1A05',
    textAlign: 'center',
  },
}); 