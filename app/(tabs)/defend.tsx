import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function DefendScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Defend Screen</Text>
      <Button title="Defend Your Time" onPress={() => router.push('/defend-modal')} />
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
}); 