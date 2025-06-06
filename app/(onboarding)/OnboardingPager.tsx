import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Screen1 from './Screen1';
import Screen10 from './Screen10';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
import Screen4 from './Screen4';
import Screen5 from './Screen5';
import Screen6 from './Screen6';
import Screen7 from './Screen7';
import Screen8 from './Screen8';

const SCREEN_ORDER = [
  Screen1, // 0
  Screen2, // 1
  Screen3, // 2
  Screen4, // 3
  Screen5, // 4
  Screen6, // 5
  Screen7, // 6
  Screen10, // 7
  Screen8, // 8
];

const PROGRESS_SCREENS = 9; // 1-8,10 (0-indexed 0-8)
const { width } = Dimensions.get('window');

export default function OnboardingPager() {
  const pagerRef = useRef<PagerView>(null);
  const [page, setPage] = useState(0);
  const [canSwipe, setCanSwipe] = useState(true);
  const router = useRouter();

  // Handler to go to next page programmatically
  const goToNext = () => {
    if (page < SCREEN_ORDER.length - 1) {
      pagerRef.current?.setPage(page + 1);
    } else {
      // Last onboarding screen, go to paywall
      router.replace('/(onboarding)/paywall-pricing');
    }
  };

  // Handler for screens that require submit
  const getScreenProps = (screenIdx: number) => {
    // Screens 6, 7, 10 (indexes 5, 6, 7) require submit
    if ([5, 6, 7].includes(screenIdx)) {
      return {
        onSubmit: () => {
          setCanSwipe(true);
          goToNext();
        },
        disableSwipe: !canSwipe,
        enableSwipe: () => setCanSwipe(true),
        disableSwipeFn: () => setCanSwipe(false),
      };
    }
    return {};
  };

  // Render screens with props for submit screens
  const renderScreens = () =>
    SCREEN_ORDER.map((Screen, idx) => (
      <View key={idx} style={{ flex: 1 }}>
        <Screen {...getScreenProps(idx)} />
      </View>
    ));

  // Progress bar width
  const progress = (page + 1) / PROGRESS_SCREENS;

  return (
    <View style={{ flex: 1, backgroundColor: '#F3E2C7' }}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        scrollEnabled={![5, 6, 7].includes(page) || canSwipe}
        onPageSelected={e => setPage(e.nativeEvent.position)}
        overdrag={false}
      >
        {renderScreens()}
      </PagerView>
      {/* Progress bar only on screens 0-8 (1-8,10) */}
      {page <= 8 && (
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg} />
          <Animated.View style={[styles.progressBarFill, { width: width * progress }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    width: '100%',
    height: 12,
    backgroundColor: 'transparent',
    zIndex: 10,
    justifyContent: 'flex-end',
  },
  progressBarBg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: 8,
    backgroundColor: '#E5C98B',
    borderRadius: 8,
  },
  progressBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 8,
    backgroundColor: '#4B3415',
    borderRadius: 8,
  },
});
