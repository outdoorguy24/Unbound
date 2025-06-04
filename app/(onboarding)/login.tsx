import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../_layout';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <Button title="Log In" onPress={() => { login(); router.replace('/(onboarding)/Screen9'); }} />
      <Pressable onPress={() => router.push('/(onboarding)/signup')} style={styles.signupLink}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
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
  signupLink: {
    marginTop: 24,
  },
  signupText: {
    color: '#4B3200',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
}); 