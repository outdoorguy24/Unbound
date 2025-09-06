import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingScreen } from '@/data/onboardingData';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingSelectionScreenProps {
  screenData: OnboardingScreen;
  isActive: boolean;
  onAction: (screenData: OnboardingScreen, response?: any) => void;
}

export default function OnboardingSelectionScreen({
  screenData,
  isActive,
  onAction,
}: OnboardingSelectionScreenProps) {
  const { responses } = useOnboarding();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Load existing response when screen becomes active
  useEffect(() => {
    if (isActive && responses[screenData.responseKey]) {
      const existingResponse = (responses as any)[screenData.responseKey];
      if (Array.isArray(existingResponse)) {
        setSelectedOptions(existingResponse);
      } else if (typeof existingResponse === 'string') {
        setSelectedOptions([existingResponse]);
      }
    }
  }, [isActive, responses, screenData.responseKey]);

  const getBackgroundSource = () => {
    if (screenData.backgroundImage) {
      return require(`../../../assets/images/${screenData.backgroundImage}`);
    }
    return require('../../../assets/images/parchment-bg.png');
  };

  const getOptionImageSource = (imagePath?: string) => {
    if (imagePath) {
      try {
        return require(`../../../assets/images/${imagePath}`);
      } catch (e) {
        console.warn(`Option image not found: ${imagePath}`);
        return null;
      }
    }
    return null;
  };

  const toggleOption = (optionKey: string) => {
    if (screenData.multiSelect) {
      setSelectedOptions(prev => 
        prev.includes(optionKey)
          ? prev.filter(key => key !== optionKey)
          : [...prev, optionKey]
      );
    } else {
      setSelectedOptions([optionKey]);
    }
  };

  const handleSubmit = () => {
    const response = screenData.multiSelect ? selectedOptions : selectedOptions[0];
    onAction(screenData, response);
  };

  const isButtonDisabled = selectedOptions.length === 0;

  const renderOptions = () => {
    if (!screenData.options) return null;

    return (
      <View style={styles.optionsContainer}>
        {screenData.options.map((option) => {
          const isSelected = selectedOptions.includes(option.key);
          const imageSource = getOptionImageSource(option.image);

          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
              ]}
              onPress={() => toggleOption(option.key)}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                {option.icon && (
                  <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>{option.icon}</Text>
                  </View>
                )}
                {imageSource && (
                  <Image source={imageSource} style={styles.optionImage} />
                )}
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                  numberOfLines={2}
                >
                  {option.label}
                </Text>
                {option.description && (
                  <Text
                    style={[
                      styles.optionDescription,
                      isSelected && styles.optionDescriptionSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {option.description}
                  </Text>
                )}
              </View>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderButton = () => {
    if (!screenData.button) return null;

    return (
      <TouchableOpacity
        style={[
          styles.button,
          isButtonDisabled && styles.buttonDisabled,
          SHADOWS.medium,
        ]}
        onPress={handleSubmit}
        disabled={isButtonDisabled}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{screenData.button.text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <ImageBackground
        source={getBackgroundSource()}
        style={styles.background}
        resizeMode="cover"
      >
        <ScreenContainer style={styles.screenContainer}>
          <View style={styles.content}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
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

              {renderOptions()}
            </ScrollView>

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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 20,
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
  optionsContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  option: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: 'rgba(255, 165, 0, 0.8)',
    borderColor: '#FFA500',
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: SPACING.md,
    top: '50%',
    marginTop: -12,
  },
  checkmarkText: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionImage: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
    marginBottom: SPACING.sm,
  },
  optionLabel: {
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: SPACING.xs,
  },
  optionLabelSelected: {
    color: COLORS.textPrimary,
  },
  optionDescription: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: 14,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  optionDescriptionSelected: {
    color: COLORS.textPrimary,
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
    marginHorizontal: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.buttonText,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
