import React from 'react';
import { View } from 'react-native';

interface SpacerProps {
  size?: number;
  direction?: 'vertical' | 'horizontal';
}

export function Spacer({ size = 16, direction = 'vertical' }: SpacerProps) {
  return (
    <View style={direction === 'vertical' ? { height: size } : { width: size }} />
  );
} 