import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingScreen } from '@/data/onboardingData';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingSliderScreenProps {
  screenData: OnboardingScreen;
  isActive: boolean;
  onAction: (screenData: OnboardingScreen, response?: any) => void;
}

export default function OnboardingSliderScreen({
  screenData,
  isActive,
  onAction,
}: OnboardingSliderScreenProps) {
  const { responses } = useOnboarding();
  const [sliderValue, setSliderValue] = useState(
    screenData.sliderConfig?.min || 1
  );

  // Load existing response when screen becomes active
  useEffect(() => {
    if (isActive && responses[screenData.responseKey]) {
      const existingResponse = (responses as any)[screenData.responseKey];
      if (typeof existingResponse === 'number') {
        setSliderValue(existingResponse);
      }
    }
  }, [isActive, responses, screenData.responseKey]);

  const getBackgroundSource = () => {
    if (screenData.backgroundImage) {
      return require(`../../../assets/images/${screenData.backgroundImage}`);
    }
    return require('../../../assets/images/parchment-bg.png');
  };

  const handleSubmit = () => {
    onAction(screenData, sliderValue);
  };

  const formatValue = (value: number) => {
    if (screenData.sliderConfig?.unit) {
      return `${value} ${screenData.sliderConfig.unit}`;
    }
    return value.toString();
  };

  const renderButton = () => {
    if (!screenData.button) return null;

    return (
      <TouchableOpacity
        style={[styles.button, SHADOWS.medium]}
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{screenData.button.text}</Text>
      </TouchableOpacity>
    );
  };

  const config = screenData.sliderConfig || { min: 1, max: 10, step: 1 };

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <ImageBackground
        source={getBackgroundSource()}
        style={styles.background}
        resizeMode="cover"
      >
        <ScreenContainer style={styles.screenContainer}>
          <View style={styles.content}>
            <View style={styles.mainContent}>
              {screenData.title && (
                <Text style={styles.title} numberOfLines={3}>
                  {screenData.title}
                </Text>
              )}

              {screenData.subtitle && (
                <Text style={styles.subtitle} numberOfLines={2}>
                  {screenData.subtitle}
                </Text>
              )}

              <View style={styles.sliderContainer}>
                <Text style={styles.valueText}>
                  {formatValue(sliderValue)}
                </Text>
                
                <View style={styles.sliderContainer}>
                  <View style={styles.sliderTrack}>
                    <View 
                      style={[
                        styles.sliderFill, 
                        { width: `${((sliderValue - config.min) / (config.max - config.min)) * 100}%` }
                      ]} 
                    />
                    <TouchableOpacity
                      style={[
                        styles.sliderThumb,
                        { left: `${((sliderValue - config.min) / (config.max - config.min)) * 100}%` }
                      ]}
                      onPress={() => {}}
                    />
                  </View>
                  <View style={styles.sliderButtons}>
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() => setSliderValue(Math.max(config.min, sliderValue - config.step))}
                    >
                      <Text style={styles.sliderButtonText}>−</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() => setSliderValue(Math.min(config.max, sliderValue + config.step))}
                    >
                      <Text style={styles.sliderButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>
                    {formatValue(config.min)}
                  </Text>
                  <Text style={styles.sliderLabel}>
                    {formatValue(config.max)}
                  </Text>
                </View>
              </View>
            </View>

            {renderButton()}
          </View>
        </ScreenContainer>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  screenContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: 18,
    lineHeight: 24,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  valueText: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3C6845',
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  sliderTrack: {
    width: '90%',
    height: 6,
    backgroundColor: '#E0C48B',
    borderRadius: 3,
    position: 'relative',
    marginBottom: SPACING.md,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#3C6845',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -9,
    width: 24,
    height: 24,
    backgroundColor: '#3C6845',
    borderRadius: 12,
    marginLeft: -12,
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    marginTop: SPACING.md,
  },
  sliderButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3C6845',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    paddingHorizontal: 12,
  },
  sliderLabel: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#3C6845',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.huge,
  },
  buttonText: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.buttonText,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
