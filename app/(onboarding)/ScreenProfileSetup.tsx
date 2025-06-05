import { useAuth } from '@/contexts/AuthContext';
import { saveUserProfile } from '@/lib/supabaseUserProfile';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ScreenProfileSetup() {
  const { user } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidName = (name: string) => /^[A-Za-z]{3,}$/.test(name);
  const isValidCity = (city: string) => /^[A-Za-z ]{3,}$/.test(city);
  const canSubmit = isValidName(firstName) && isValidCity(city);

  const handleSubmit = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      await saveUserProfile(user.id, firstName.trim(), city.trim());
      router.replace('/(onboarding)/Screen9');
    } catch (e: any) {
      setError(e.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>WELCOME TO THE BROTHERHOOD</Text>
        <Text style={styles.subtitle}>Tell us who you are, warrior</Text>
        {/* Optionally add an illustration here */}
        <View style={styles.illustration} />
        <TextInput
          style={styles.input}
          placeholder="First Name *"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={32}
        />
        <TextInput
          style={styles.input}
          placeholder="City (optional)"
          value={city}
          onChangeText={setCity}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={32}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>JOIN THE RANKS</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E2C7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    lineHeight: 36,
  },
  subtitle: {
    color: '#7A4B13',
    fontFamily: 'Vollkorn-Regular',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1.1,
  },
  illustration: {
    width: 120,
    height: 60,
    backgroundColor: '#2C1A05', // Placeholder for mountain illustration
    borderRadius: 12,
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#2C1A05',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    marginBottom: 16,
    fontFamily: 'Vollkorn-Regular',
    color: '#2C1A05',
  },
  button: {
    backgroundColor: '#4B3415',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Vollkorn-Bold',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
}); 