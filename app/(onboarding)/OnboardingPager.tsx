import { useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
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

    // Screens 6, 7, 8, 9, 10 (indexes 5, 6, 7, 8, 9) require submit
    if ([5, 6, 7, 8, 9].includes(screenIdx)) {
      props.onSubmit = () => {
          setCanSwipe(true);
          goToNext();
      };
      props.disableSwipe = !canSwipe;
      props.enableSwipe = () => setCanSwipe(true);
      props.disableSwipeFn = () => setCanSwipe(false);
    }
    
    return props;
  };

  // Render screens with props for submit screens
  const renderScreens = () =>
    SCREEN_ORDER.map((Screen, idx) => {
      // Screen11 is rendered separately as an overlay
      if (idx === 10) {
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

  // Progress bar width (10 segments, 10% per screen)
  const progress = (page + 1) / 10;

  return (
    <View style={{ flex: 1, backgroundColor: "#F3E2C7" }}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        scrollEnabled={![5, 6, 7, 8].includes(page) ? true : canSwipe}
        onPageSelected={(e) => {
          const newPage = e.nativeEvent.position;
          setPage(newPage);
          // Reset canSwipe when navigating to screens 6-9
          if ([5, 6, 7, 8].includes(newPage)) {
            setCanSwipe(false);
          }
        }}
        overdrag={false}
      >
        {renderScreens()}
      </PagerView>
      {/* Render Screen11 as an overlay when on page 10 */}
      {page === 10 && <Screen11 onFinish={goToNext} />}
      {/* Progress bar only on screens 0-9 (1-10) */}
      {page <= 9 && (
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
