import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function WeeklySummaryScreen() {
  const [enabled, setEnabled] = useState(false);
  return (
    <ScreenContainer>
      <ScreenHeader title="Weekly Summary" />
      <View style={styles.row}>
        <Text style={styles.label}>Enable Weekly Summary</Text>
        <Switch value={enabled} onValueChange={setEnabled} />
      </View>
      {/* TODO: Replace with real summary logic */}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7E0A3',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    color: '#2C1A05',
  },
}); 