import { StyleSheet, Text, View } from 'react-native';

export default function CampScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camp (Home) Screen</Text>
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
  },
}); 