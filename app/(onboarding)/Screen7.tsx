import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const OPTIONS = [
  { key: 'social', label: 'Social Media', icon: <Feather name="smartphone" size={36} color="#4B3415" /> },
  { key: 'porn', label: 'Porn', icon: <MaterialCommunityIcons name="block-helper" size={36} color="#4B3415" /> },
  { key: 'youtube', label: 'YouTube', icon: <Feather name="tv" size={36} color="#4B3415" /> },
  { key: 'news', label: 'News/Reddit', icon: <MaterialCommunityIcons name="newspaper" size={36} color="#4B3415" /> },
  { key: 'gaming', label: 'Gaming', icon: <FontAwesome5 name="gamepad" size={36} color="#4B3415" /> },
  { key: 'all', label: 'All of the Above', icon: <Feather name="layers" size={36} color="#4B3415" /> },
];

export default function Screen7({ onSubmit, disableSwipe, enableSwipe, disableSwipeFn }: any) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (selected.length === 0 && disableSwipeFn) disableSwipeFn();
    if (selected.length > 0 && enableSwipe) enableSwipe();
  }, [selected]);

  const toggleOption = (key: string) => {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>What's stealing your time?</Text>
      <View style={styles.progressRow}>
        <Text style={styles.progressDot}>● ● ● ● ● ● ○ ○ ○</Text>
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
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.nextBtn, selected.length === 0 && { opacity: 0.5 }]}
        onPress={() => { if (onSubmit) onSubmit(); }}
        disabled={selected.length === 0}
      >
        <Text style={styles.nextBtnText}>Submit</Text>
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
    width: 120,
    height: 120,
    backgroundColor: '#F7F2E0',
    borderRadius: 16,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: '#A05A1A',
    backgroundColor: '#E2C89A',
  },
  optionLabel: {
    marginTop: 12,
    color: '#4B3415',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
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
  nextBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
}); 