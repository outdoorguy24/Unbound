import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function PaymentScreen() {
  const router = useRouter();
  const { pay } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      <Text style={styles.body}>Enter your payment details to start your free trial.</Text>
      <Button title="Continue to Signup" onPress={() => { pay(); router.push('/(onboarding)/signup'); }} />
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