import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const OPTIONS = [
  { key: 'morning', label: 'Morning', desc: 'Starting the day distracted', icon: <Feather name="sunrise" size={36} color="#4B3415" /> },
  { key: 'work', label: 'Work Breaks', desc: 'Procrastinating productivity', icon: <Feather name="monitor" size={36} color="#4B3415" /> },
  { key: 'evening', label: 'Evening', desc: 'Unwinding becomes scrolling', icon: <Feather name="coffee" size={36} color="#4B3415" /> },
  { key: 'latenight', label: 'Late Night', desc: "Can't sleep, can't stop", icon: <Feather name="moon" size={36} color="#4B3415" /> },
];

export default function ScreenVulnerable() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (key: string) => {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>When are you most vulnerable?</Text>
      <Text style={styles.subheading}>Knowledge is power. When does weakness strike?</Text>
      <View style={styles.progressRow}>
        <Text style={styles.progressDot}>● ● ● ● ● ● ● ○ ○</Text>
        <Text style={styles.progressNum}>6 7</Text>
      </View>
      <View style={styles.grid}>
        {OPTIONS.map(option => (
          <TouchableOpacity
            key={option.key}
            style={[styles.option, selected.includes(option.key) && styles.optionSelected]}
            onPress={() => toggleOption(option.key)}
            activeOpacity={0.8}
          >
            {option.icon}
            <Text style={styles.optionLabel}>{option.label}</Text>
            <Text style={styles.optionDesc}>{option.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.nextBtn, selected.length === 0 && styles.nextBtnDisabled]}
        onPress={() => router.push('/(onboarding)/Screen6')}
        disabled={selected.length === 0}
      >
        <Text style={styles.nextBtnText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E2C7',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1A05',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#4B3415',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressDot: {
    color: '#4B3415',
    fontSize: 18,
    marginRight: 8,
  },
  progressNum: {
    color: '#4B3415',
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
  },
  option: {
    width: 150,
    height: 120,
    backgroundColor: '#F7F2E0',
    borderRadius: 16,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 8,
  },
  optionSelected: {
    borderColor: '#A05A1A',
    backgroundColor: '#E2C89A',
  },
  optionLabel: {
    marginTop: 8,
    color: '#4B3415',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  optionDesc: {
    color: '#4B3415',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
  nextBtn: {
    backgroundColor: '#4B3415',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  nextBtnDisabled: {
    backgroundColor: '#B8A07A',
  },
  nextBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
}); 