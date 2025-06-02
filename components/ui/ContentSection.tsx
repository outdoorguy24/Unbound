import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface ContentSectionProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ContentSection({ title, children, style }: ContentSectionProps) {
  return (
    <View style={[styles.section, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
}); 