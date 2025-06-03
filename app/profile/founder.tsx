import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function FounderScreen() {
  const [message, setMessage] = useState('');
  return (
    <ScreenContainer>
      <ScreenHeader title="Talk with the Founder" />
      <View style={styles.content}>
        <Text style={styles.text}>Send a message to the founder. (This is a placeholder UI.)</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={() => {/* TODO: Send message logic */}}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#2C1A05',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5C98B',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 16,
    backgroundColor: '#F7E0A3',
    color: '#2C1A05',
  },
  button: {
    backgroundColor: '#4B3415',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 