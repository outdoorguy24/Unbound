import { SPACING, TYPOGRAPHY } from '@/constants/theme';
import { OnboardingScreen } from '@/data/onboardingData';
import React, { useEffect } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingLoadingScreenProps {
  screenData: OnboardingScreen;
  isActive: boolean;
  onAction: (screenData: OnboardingScreen, response?: any) => void;
}

export default function OnboardingLoadingScreen({
  screenData,
  isActive,
  onAction,
}: OnboardingLoadingScreenProps) {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      // Start spinner animation
      const spin = () => {
        spinValue.setValue(0);
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => spin());
      };
      spin();

      // Auto-advance after 3 seconds
      const timer = setTimeout(() => {
        onAction(screenData, true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onAction, screenData, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <View style={styles.content}>
        <View style={styles.spinnerContainer}>
          <Animated.View 
            style={[
              styles.spinner,
              { transform: [{ rotate: spin }] }
            ]}
          />
        </View>
        
        {screenData.title && (
          <Text style={styles.title}>{screenData.title}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  spinnerContainer: {
    marginBottom: SPACING.xl,
  },
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: '#fff',
  },
  title: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
