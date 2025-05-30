import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { logScreenView } from '../_firebase';

const heading = "WHEN ARE YOU MOST VULNERABLE?";
const subheading = "KNOWLEDGE IS POWER. WHEN DOES WEAKNESS STRIKE?";
const options = [
  'MORNING',
  'WORK BREAKS',
  'EVENING',
  'LATE NIGHT',
];

export default function Screen7() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();
  useEffect(() => { logScreenView('Onboarding7'); }, []);

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.subheading}>{subheading}</Text>
      <View style={styles.placeholder} />
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
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(onboarding)/Screen8')}>
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
    color: '#4B3415',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    lineHeight: 22,
  },
  placeholder: {
    width: width * 0.7,
    height: width * 0.18,
    backgroundColor: '#4B3415',
    borderRadius: 24,
    marginVertical: 12,
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 6,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#4B3415',
  },
  optionText: {
    color: '#4B3415',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 16,
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