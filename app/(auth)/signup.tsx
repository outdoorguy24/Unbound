import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const router = useRouter();
  const { login, isLoadingAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setError(null);
    try {
      await login();
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Sign Up" />
      <View style={styles.content}>
        <Text style={styles.heading}>Join the Movement</Text>
        <Text style={styles.subheading}>Create your account to start reclaiming your time</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity 
          style={[styles.button, isLoadingAuth && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={isLoadingAuth}
        >
          {isLoadingAuth ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign up with Google</Text>}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkTextBold}>Sign in</Text>
          </Text>
        </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1A05',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: '#4B3415',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4B3415',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    color: '#4B3415',
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
}); 