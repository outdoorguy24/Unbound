import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const heading = "TECHNOLOGY HAS BENEFITS. BUT IT'S STEALING YOUR LIFE.";
const body = "CHEAP DOPAMINE. CONSTANT DISTRACTION. YOU'RE NOT BROKEN—YOU'RE OVERSTIMULATED. YOU KNOW WHAT YOU SHOULD BE DOING... BUT YOU SCROLL INSTEAD. THEN COMES THE GUILT. AND MORE SCROLLING TO ESCAPE THE GUILT.";

export default function Screen2() {
  const router = useRouter();
  useEffect(() => { /* logScreenView('Onboarding2'); */ }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      <View style={styles.placeholder} />
      <Text style={styles.body}>{body}</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(onboarding)/Screen3')}>
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