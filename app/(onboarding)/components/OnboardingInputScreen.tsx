import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingScreen } from '@/data/onboardingData';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingInputScreenProps {
  screenData: OnboardingScreen;
  isActive: boolean;
  onAction: (screenData: OnboardingScreen, response?: any) => void;
}

export default function OnboardingInputScreen({
  screenData,
  isActive,
  onAction,
}: OnboardingInputScreenProps) {
  const { responses } = useOnboarding();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isActive && responses[screenData.responseKey]) {
      const existingResponse = (responses as any)[screenData.responseKey];
      if (typeof existingResponse === 'string') {
        setInputValue(existingResponse);
      }
    }
  }, [isActive, responses, screenData.responseKey]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAction(screenData, inputValue.trim());
    }
  };

  const isButtonDisabled = !inputValue.trim();

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <ImageBackground
        source={require('../../../assets/images/parchment-bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <ScreenContainer style={styles.screenContainer}>
          <KeyboardAvoidingView
            style={styles.content}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.mainContent}>
              {screenData.title && (
                <Text style={styles.title}>{screenData.title}</Text>
              )}
              {screenData.subtitle && (
                <Text style={styles.subtitle}>{screenData.subtitle}</Text>
              )}
              <TextInput
                style={styles.textInput}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder={screenData.placeholder}
                placeholderTextColor="#7A5A2F"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            {screenData.button && (
              <TouchableOpacity
                style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isButtonDisabled}
              >
                <Text style={styles.buttonText}>{screenData.button.text}</Text>
              </TouchableOpacity>
            )}
          </KeyboardAvoidingView>
        </ScreenContainer>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  screenContainer: { backgroundColor: 'transparent', paddingHorizontal: 0, paddingTop: 0 },
  content: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 32 },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontFamily: TYPOGRAPHY.heading.fontFamily, fontSize: 28, fontWeight: '900', color: COLORS.textPrimary, textAlign: 'center', marginBottom: SPACING.xl },
  subtitle: { fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 18, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.lg },
  textInput: { borderWidth: 2, borderColor: '#2C1A05', borderRadius: 10, padding: 16, fontSize: 16, color: '#2C1A05', fontFamily: 'Vollkorn-Regular', backgroundColor: 'rgba(255,255,255,0.7)', minHeight: 120, width: '100%', marginTop: SPACING.xl },
  button: { backgroundColor: '#3C6845', paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: 12, minWidth: 200, alignItems: 'center', alignSelf: 'center', marginBottom: SPACING.huge },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontFamily: TYPOGRAPHY.heading.fontFamily, color: COLORS.buttonText, fontSize: 24, fontWeight: 'bold' },
});