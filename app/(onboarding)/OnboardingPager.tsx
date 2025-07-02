import React, { useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import ParadoxScreen from "./ParadoxScreen";
import Screen1 from "./Screen1";
import Screen10 from "./Screen10";
import Screen11 from "./Screen11";
import Screen12 from "./Screen12";
import Screen2 from "./Screen2";
import Screen3 from "./Screen3";
import Screen4 from "./Screen4";
import Screen5 from "./Screen5";
import Screen6 from "./Screen6";
import Screen7 from "./Screen7";
import Screen8 from "./Screen8";
import Screen9 from "./Screen9";

const SCREEN_ORDER = [
  ParadoxScreen,
  Screen1,
  Screen2,
  Screen3,
  Screen4,
  Screen5,
  Screen6,
  Screen7,
  Screen8,
  Screen9,
  Screen10,
  Screen11,
  Screen12,
];

const PROGRESS_SCREENS = 10;

export default function OnboardingPager() {
  const pagerRef = useRef<PagerView>(null);
  const [page, setPage] = useState(0);
  const [canSwipe, setCanSwipe] = useState(true);
  const [showScreen11, setShowScreen11] = useState(false);

  // Handler to go to next page programmatically
  const goToNext = () => {
    if (page < SCREEN_ORDER.length - 1) {
      pagerRef.current?.setPage(page + 1);
    }
  };

  // Handler for screens that require submit
  const getScreenProps = (screenIdx: number) => {
    const props: any = {
      isActive: page === screenIdx,
    };

    if (screenIdx === 0) {
      props.onSubmit = () => goToNext();
    }

    // Screens 6, 7, 8, 9, 10 (indexes 6, 7, 8, 9, 10) require submit
    if ([6, 7, 8, 9, 10].includes(screenIdx)) {
      props.onSubmit = () => {
          setCanSwipe(true);
          goToNext();
      };
      props.disableSwipe = !canSwipe;
      props.enableSwipe = () => setCanSwipe(true);
      props.disableSwipeFn = () => setCanSwipe(false);
    }

    // Screen 10: disable swipe, advance by button, show Screen 11 overlay
    if (screenIdx === 10) {
      props.onSubmit = () => {
        setShowScreen11(true);
      };
      props.disableSwipe = true;
    }

    // Screen 12: disable swipe, advance by button
    if (screenIdx === 12) {
      props.onSubmit = () => goToNext();
      props.disableSwipe = true;
    }
    
    return props;
  };

  // Handle Screen11 fade-out start: jump to Screen12 in pager
  const handleScreen11FadeOutStart = () => {
    pagerRef.current?.setPageWithoutAnimation(12);
  };

  // Handle Screen11 finish: remove overlay
  const handleScreen11Finish = () => {
    setShowScreen11(false);
  };

  // Render screens with props for submit screens
  const renderScreens = () =>
    SCREEN_ORDER.map((Screen, idx) => {
      // Screen11 is not rendered as a pager page
      if (idx === 11) {
        return <View key={idx} style={{ flex: 1 }} />;
      }
      // Regular screens get props based on whether they need submit
      const props = getScreenProps(idx);
      return (
      <View key={idx} style={{ flex: 1 }}>
          <Screen {...props} />
      </View>
      );
    });

  // Progress bar width (11 segments, 10% per screen, ends on Screen10)
  const progress = page > 0 ? page / 10 : 0; // 0% on ParadoxScreen, 100% on Screen10

  // Determine scrollEnabled
  const isSwipeDisabled = page === 0 || page === 10 || page === 12 || ([6, 7, 8, 9, 10].includes(page) && !canSwipe);

  return (
    <View style={{ flex: 1, backgroundColor: "#F3E2C7" }}>
      {/* Always keep the PagerView */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        scrollEnabled={!isSwipeDisabled}
        onPageSelected={(e) => {
          const newPage = e.nativeEvent.position;
          setPage(newPage);
          // Reset canSwipe when navigating to screens 6-10
          if ([6, 7, 8, 9, 10].includes(newPage)) {
            setCanSwipe(false);
          }
        }}
        overdrag={false}
      >
        {renderScreens()}
      </PagerView>

      {/* Screen11 overlay - always rendered on top when active */}
      {showScreen11 && (
        <Screen11
          onFadeOutStart={handleScreen11FadeOutStart}
          onFinish={handleScreen11Finish}
        />
      )}

      {/* Progress bar only on screens 1-10 (1-11) */}
      {page >= 1 && page <= 10 && (
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    width: "100%",
    height: 16,
    backgroundColor: "transparent",
    zIndex: 10,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 15,
  },
  progressBarBg: {
    width: "90%",
    height: 12,
    backgroundColor: "#ECC880",
    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "center",
  },
  progressBarFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 12,
    backgroundColor: "#2B1B10",
    borderRadius: 8,
  },
});
