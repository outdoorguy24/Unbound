import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function ThemeScreen() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <ScreenContainer>
      <ScreenHeader title="Theme" />
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
      {/* TODO: Replace with real theme logic */}
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