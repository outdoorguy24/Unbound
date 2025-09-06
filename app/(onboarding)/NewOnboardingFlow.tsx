import { useOnboarding } from '@/contexts/OnboardingContext';
import { ONBOARDING_SCREENS, OnboardingScreen } from '@/data/onboardingData';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  View
} from 'react-native';
import OnboardingInputScreen from './components/OnboardingInputScreen';
import OnboardingLoadingScreen from './components/OnboardingLoadingScreen';
import OnboardingSelectionScreen from './components/OnboardingSelectionScreen';
import OnboardingSliderScreen from './components/OnboardingSliderScreen';
import OnboardingStoryScreen from './components/OnboardingStoryScreen';

const { width: screenWidth } = Dimensions.get('window');

export default function NewOnboardingFlow() {
  const router = useRouter();
  const { updateResponse, getAllResponses, currentScreen, setCurrentScreen } = useOnboarding();
  const flatListRef = useRef<FlatList>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = (currentScreen + 1) / ONBOARDING_SCREENS.length;

  const goToNext = useCallback(() => {
    if (currentScreen < ONBOARDING_SCREENS.length - 1) {
      const nextIndex = currentScreen + 1;
      setCurrentScreen(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }
  }, [currentScreen, setCurrentScreen]);

  const handleResponse = useCallback((screenData: OnboardingScreen, response: any) => {
    updateResponse(screenData.responseKey, response);
  }, [updateResponse]);

  const handleScreenAction = useCallback(async (screenData: OnboardingScreen, response?: any) => {
    if (response !== undefined) {
      handleResponse(screenData, response);
    }

    if (screenData.button?.action === 'complete') {
      setIsSubmitting(true);
      try {
        const allResponses = getAllResponses();
        console.log('Onboarding completed with responses:', allResponses);
        
        // Here you would typically send the data to your backend
        // await sendOnboardingDataToBackend(allResponses);
        
        // Navigate to main app
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Error completing onboarding:', error);
        Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      goToNext();
    }
  }, [handleResponse, getAllResponses, goToNext, router]);

  const renderScreen = ({ item, index }: { item: OnboardingScreen; index: number }) => {
    const isActive = index === currentScreen;
    
    const commonProps = {
      screenData: item,
      isActive,
      onAction: handleScreenAction,
      isSubmitting: isSubmitting && item.button?.action === 'complete',
    };

    switch (item.type) {
      case 'story':
      case 'final':
        return <OnboardingStoryScreen {...commonProps} />;
      case 'selection':
        return <OnboardingSelectionScreen {...commonProps} />;
      case 'input':
        return <OnboardingInputScreen {...commonProps} />;
      case 'slider':
        return <OnboardingSliderScreen {...commonProps} />;
      case 'loading':
        return <OnboardingLoadingScreen {...commonProps} />;
      default:
        return <OnboardingStoryScreen {...commonProps} />;
    }
  };

  const renderSlideIndicator = () => {
    const currentScreenData = ONBOARDING_SCREENS[currentScreen];
    if (!currentScreenData?.showSlideIndicator) return null;

    return (
      <View style={styles.slideIndicatorContainer}>
        <View style={styles.slideIndicator}>
          {ONBOARDING_SCREENS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.slideIndicatorDot,
                index === currentScreen && styles.slideIndicatorDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderProgressBar = () => {
    const currentScreenData = ONBOARDING_SCREENS[currentScreen];
    if (!currentScreenData?.showProgress) return null;

    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <Animated.View 
            style={[
              styles.progressBarFill, 
              { width: `${progress * 100}%` }
            ]} 
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SCREENS}
        renderItem={renderScreen}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
          if (newIndex !== currentScreen) {
            setCurrentScreen(newIndex);
          }
        }}
      />
      
      {renderProgressBar()}
      {renderSlideIndicator()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E2C7',
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    width: '100%',
    height: 16,
    backgroundColor: 'transparent',
    zIndex: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 15,
  },
  progressBarBg: {
    width: '90%',
    height: 12,
    backgroundColor: '#ECC880',
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  progressBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 12,
    backgroundColor: '#2B1B10',
    borderRadius: 8,
  },
  slideIndicatorContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  slideIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  slideIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 2,
  },
  slideIndicatorDotActive: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
