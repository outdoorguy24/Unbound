import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../_layout';

export default function SignupScreen() {
  const router = useRouter();
  const { login } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>
      <Button title="Sign Up with Email" onPress={() => { router.replace('/(onboarding)/Screen9'); }} />
      <Button title="Sign Up with Google" variant="outline" onPress={() => { router.replace('/(onboarding)/Screen9'); }} style={styles.googleButton} />
      <Pressable onPress={() => router.push('/(onboarding)/login')} style={styles.loginLink}>
        <Text style={styles.loginText}>Already have an account? Log in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  googleButton: {
    marginTop: 16,
  },
  loginLink: {
    marginTop: 24,
  },
  loginText: {
    color: '#4B3200',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
}); 