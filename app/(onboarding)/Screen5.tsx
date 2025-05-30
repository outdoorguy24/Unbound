import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { logScreenView } from '../_firebase';

const heading = "IT'S TIME TO REMEMBER WHO YOU ARE.";
const body = "PICK UP THE PAINTBRUSH AND GRAB THE HAMMER. LACE UP YOUR SHOES OR BOXING GLOVES. GET A SPLINTER. WALK BAREFOOT IN THE GRASS. BECOME THE MAN YOU WERE MEANT TO BE. MAKE YOUR GRANDFATHER PROUD.";

export default function Screen5() {
  const router = useRouter();
  useEffect(() => { logScreenView('Onboarding5'); }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      <View style={styles.placeholder} />
      <Text style={styles.body}>{body}</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(onboarding)/Screen6')}>
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