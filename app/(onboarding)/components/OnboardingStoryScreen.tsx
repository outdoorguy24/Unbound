import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { OnboardingScreen } from '@/data/onboardingData';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingStoryScreenProps {
  screenData: OnboardingScreen;
  isActive: boolean;
  onAction: (screenData: OnboardingScreen, response?: any) => void;
  isSubmitting?: boolean;
}

export default function OnboardingStoryScreen({
  screenData,
  isActive,
  onAction,
  isSubmitting = false,
}: OnboardingStoryScreenProps) {
  const getBackgroundSource = () => {
    if (screenData.backgroundImage) {
      return require(`../../../assets/images/${screenData.backgroundImage}`);
    }
    return require('../../../assets/images/parchment-bg.png');
  };

  const getIllustrationSource = () => {
    if (screenData.illustration) {
      try {
        return require(`../../../assets/images/${screenData.illustration}`);
      } catch (e) {
        console.warn(`Illustration not found: ${screenData.illustration}`);
        return null;
      }
    }
    return null;
  };

  const handleButtonPress = () => {
    if (isSubmitting) return;
    onAction(screenData, true);
  };

  const renderContent = () => {
    if (!screenData.content) return null;

    return (
      <View style={styles.textGroup}>
        {screenData.content.map((text, index) => (
          <Text
            key={index}
            style={[
              styles.textBlock,
              index === screenData.content!.length - 1 && styles.textBlockLast,
            ]}
            numberOfLines={3}
          >
            {text}
          </Text>
        ))}
      </View>
    );
  };

  const renderIllustration = () => {
    const illustrationSource = getIllustrationSource();
    if (!illustrationSource) return null;

    return (
      <View style={styles.illustrationContainer}>
        <Image source={illustrationSource} style={styles.illustration} />
      </View>
    );
  };

  const renderButton = () => {
    if (!screenData.button) return null;

    return (
      <TouchableOpacity
        style={[styles.button, SHADOWS.medium]}
        onPress={handleButtonPress}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{screenData.button.text}</Text>
        )}
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
            <View style={styles.mainContent}>
              {screenData.title && (
                <Text style={styles.title} numberOfLines={3}>
                  {screenData.title}
                </Text>
              )}
              
              {renderContent()}
              {renderIllustration()}
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
    textTransform: 'uppercase',
  },
  textGroup: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: 16,
  },
  textBlock: {
    color: '#2B1B10',
    fontFamily: 'Vollkorn-SemiBold',
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 32,
    letterSpacing: 0.5,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  textBlockLast: {
    fontFamily: 'Vollkorn-Bold',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 24,
  },
  illustrationContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.xs,
  },
  illustration: {
    width: '100%',
    aspectRatio: 1.8,
    height: undefined,
    resizeMode: 'contain',
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
