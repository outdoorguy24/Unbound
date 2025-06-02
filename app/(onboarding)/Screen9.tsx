import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const heading = "HERE'S HOW WE'LL HELP YOU RECLAIM YOUR TIME";
const body = `SET YOUR SCHEDULE\nCHOOSE WHEN TO DEFEND YOUR ATTENTION.\n\nWE BLOCK THE DISTRACTIONS\nZERO ACCESS. ZERO EXCUSES. ZERO WAY OUT.\n\nYOU LIVE YOUR LIFE`;

export default function Screen9() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      <View style={styles.placeholder} />
      <Text style={styles.body}>{body}</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/paywall-description')}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 24,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    lineHeight: 32,
  },
  placeholder: {
    width: width * 0.7,
    height: width * 0.35,
    backgroundColor: '#4B3415',
    borderRadius: 24,
    marginVertical: 18,
  },
  body: {
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    lineHeight: 28,
  },
  button: {
    backgroundColor: '#5C3D18',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#F3E2C7',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Vollkorn-Bold',
  },
}); 