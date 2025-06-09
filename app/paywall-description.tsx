import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import analytics from '@react-native-firebase/analytics'; // Uncomment when Firebase is set up
import { useRouter } from 'expo-router';

const heading = "Why Join Unbound?";
const description = "Break free from distraction. Reclaim your time, your focus, and your life. Join a movement of people who want to do more, be more, and live more—without the noise.";

export default function PaywallDescription() {
  const router = useRouter();
  useEffect(() => { /* logScreenView('PaywallDescription'); */ }, []);
  return (
    <View style={styles.container}>
      <View style={styles.placeholder} />
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.body}>{description}</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(onboarding)/paywall-pricing')}>
        <Text style={styles.buttonText}>Continue</Text>
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
  placeholder: {
    width: width * 0.7,
    height: width * 0.3,
    backgroundColor: '#4B3415',
    borderRadius: 24,
    marginBottom: 32,
  },
  heading: {
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    lineHeight: 32,
  },
  body: {
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Regular',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#5C3D18',
    paddingHorizontal: 32,
    paddingVertical: 14,
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