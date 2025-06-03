import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ExportDataScreen() {
  return (
    <ScreenContainer>
      <ScreenHeader title="Export Data" />
      <View style={styles.centered}>
        <Text style={styles.text}>Download your data as a CSV file.</Text>
        <TouchableOpacity style={styles.button} onPress={() => {/* TODO: Add export logic */}}>
          <Text style={styles.buttonText}>Export Data</Text>
        </TouchableOpacity>
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
  text: {
    fontSize: 16,
    color: '#2C1A05',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4B3415',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 