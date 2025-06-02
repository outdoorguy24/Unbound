import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../_layout';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <Button title="Talk with the Founder" onPress={() => router.push('/founder')} />
      <Button title="Log Out" variant="outline" style={styles.logoutButton} onPress={() => { logout(); router.replace('/(onboarding)/login'); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  logoutButton: {
    marginTop: 32,
    minWidth: 160,
  },
}); 