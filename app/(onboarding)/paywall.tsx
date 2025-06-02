import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function PaywallScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock Unbound</Text>
      <Text style={styles.body}>Start your 7-day free trial to access the full app.</Text>
      <Button title="Start Free Trial" onPress={() => router.push('/(onboarding)/payment')} />
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
    marginBottom: 16,
  },
  body: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
  },
}); 