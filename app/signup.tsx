import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const heading = 'Create Your Account';
const description = 'Sign up to start your 7-day free trial and unlock Unbound.';
const termsUrl = 'https://yourdomain.com/terms';
const privacyUrl = 'https://yourdomain.com/privacy';

const GOOGLE_CLIENT_ID = '792843045396-ilj7jq2u02p0tue456a0bdt96fs9and2.apps.googleusercontent.com';

export default function Signup() {
  const router = useRouter();
  const auth = useAuth() as { login?: () => void } | null || {};
  const { login } = auth;
  useEffect(() => { /* logScreenView('Signup'); */ }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.body}>{description}</Text>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={login}
      >
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.appleButton} onPress={() => {/* TODO: Apple sign-in logic */}}>
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.appleButton, { marginTop: 8, backgroundColor: '#4B3415' }]}
        onPress={() => {
          login && login();
          router.replace('/(tabs)/camp');
        }}
      >
        <Text style={[styles.buttonText, { color: '#fff' }]}>Sign Up (Dev Shortcut)</Text>
      </TouchableOpacity>
      <View style={styles.linksRow}>
        <Text style={styles.link} onPress={() => Linking.openURL(termsUrl)}>Terms of Service</Text>
        <Text style={styles.link} onPress={() => Linking.openURL(privacyUrl)}>Privacy Policy</Text>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E2C7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  heading: {
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    lineHeight: 32,
  },
  body: {
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Regular',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#4B3415',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginBottom: 16,
    width: width * 0.8,
    alignItems: 'center',
  },
  appleButton: {
    backgroundColor: '#2C1A05',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginBottom: 24,
    width: width * 0.8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#2C1A05',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Vollkorn-Bold',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  link: {
    color: '#265C28',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 8,
    textDecorationLine: 'underline',
  },
}); 