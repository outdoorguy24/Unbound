import { StyleSheet, Text, View } from 'react-native';

export default function FounderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Talk with the Founder</Text>
      <Text style={styles.body}>This is a placeholder for the founder chat or contact screen.</Text>
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
  },
}); 