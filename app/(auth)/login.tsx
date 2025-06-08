import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoadingAuth, setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      await login();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Login" />
      <View style={styles.content}>
        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.subheading}>Sign in to continue your journey</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity 
          style={[styles.button, isLoadingAuth && styles.buttonDisabled]}
          onPress={login}
          disabled={isLoadingAuth}
        >
          {isLoadingAuth ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in with Google</Text>}
        </TouchableOpacity>
        {/* DEV SHORTCUT BUTTON */}
        {/*
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#888' }]}
          onPress={() => {
            setUser({
              id: '11111111-1111-1111-1111-111111111111',
              email: 'dev@unbound.test',
              name: 'Dev User',
            });
            router.replace('/(tabs)');
          }}
        >
          <Text style={styles.buttonText}>Dev Shortcut: Skip Login</Text>
        </TouchableOpacity>
        */}
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkTextBold}>Sign up</Text>
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