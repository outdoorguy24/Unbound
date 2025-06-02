import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const heading = "WHAT'S YOUR BIGGEST FEAR ABOUT THIS ADDICTION?";
const subheading = "Understanding your 'why' makes all the difference.";
const options = [
  'MISSING MY PRIME YEARS',
  'DESTROYING MY RELATIONSHIPS',
  'LOSING MY MENTAL EDGE',
  'BECOMING WEAK & SOFT',
  'DYING WITH REGRETS',
];

export default function Screen6() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.subheading}>{subheading}</Text>
      {/* Placeholder for illustration - replace with SVG/PNG when available */}
      <View style={styles.illustrationPlaceholder}>
        {/* <Image source={require('path/to/your/image.png')} style={styles.illustration} /> */}
        <Text style={styles.illustrationText}>[Illustration Here]</Text>
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, selected.includes(option) && styles.optionSelected]}
            onPress={() => toggleOption(option)}
          >
            <Text style={[styles.optionText, selected.includes(option) && styles.optionTextSelected]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(onboarding)/Screen7')}>
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
    marginBottom: 8,
    marginTop: 24,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    lineHeight: 32,
  },
  subheading: {
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 4,
    letterSpacing: 1.1,
    lineHeight: 22,
  },
  illustrationPlaceholder: {
    width: width * 0.5,
    height: width * 0.3,
    backgroundColor: '#E5C98B',
    borderRadius: 24,
    marginVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationText: {
    color: '#4B3415',
    fontSize: 14,
    fontStyle: 'italic',
  },
  optionsContainer: {
    width: '100%',
    marginTop: 12,
    marginBottom: 16,
  },
  option: {
    backgroundColor: '#F3E2C7',
    borderColor: '#4B3415',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#4B3415',
  },
  optionText: {
    color: '#4B3415',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  optionTextSelected: {
    color: '#F3E2C7',
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