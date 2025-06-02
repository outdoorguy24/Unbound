import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function DefendModal() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>×</Text>
      </Pressable>
      <Text style={styles.title}>WARNING</Text>
      <Text style={styles.body}>
        You're about to embark on an act of rebellion. You're going to stop giving into distractions. You're going to stop giving your precious attention to corporate tech overlords. You're going to create more than you consume. Welcome back.
      </Text>
      <Text style={styles.subtext}>You're halfway to joining at 100 hours.</Text>
      <Pressable style={styles.defendButton} onPress={() => {/* TODO: Start block logic */}}>
        <Text style={styles.defendButtonText}>DEFEND YOUR TIME</Text>
      </Pressable>
      <Text style={styles.fyi}>FYI: once you start the block, there is NO way to end it until time is up. A little scary huh?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7E0A3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 24,
    zIndex: 10,
  },
  closeText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  body: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtext: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  defendButton: {
    backgroundColor: '#4B3200',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
  },
  defendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  fyi: {
    fontSize: 12,
    color: '#4B3200',
    marginTop: 16,
    textAlign: 'center',
  },
}); 