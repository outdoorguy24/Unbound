import { height, scale, scaleVertical } from "@/constants/Scale";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { supabase } from "@/lib/supabaseClient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Screen1 from "./Screen1";
import Screen10 from "./Screen10";
import Screen11 from "./Screen11";
import Screen12 from "./Screen12";
import Screen13 from "./Screen13";
import Screen14 from "./Screen14";
import Screen15 from "./Screen15";
import Screen16 from "./Screen16";
import Screen17 from "./Screen17";
import Screen18 from "./Screen18";
import Screen19 from "./Screen19";
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
  Screen13,
  Screen14,
  Screen15,
  Screen16,
  Screen17,
  Screen18,
  Screen19,
];

const PROGRESS_SCREENS = SCREEN_ORDER?.length;

export default function OnboardingPager() {
  const pagerRef = useRef<PagerView>(null);
  const [progressBarHeight, setProgressBarHeight] = useState(0);
  const [page, setPage] = useState(0);
  // const [page, setPage] = useState(SCREEN_ORDER?.length - 1);
  const [canSwipe, setCanSwipe] = useState(true);
  const [showScreen11, setShowScreen11] = useState(false);
  const insets = useSafeAreaInsets();
  const [dotsRowWidth, setDotsRowWidth] = useState(0);

  const {
    traps,
    setTraps,
    scrollTimes,
    setScrollTimes,
    concerns,
    setConcerns,
    improvementOptions,
    setImprovementOptions,
  } = useOnboarding();
  const [isSubmittingDisabled, setIsSubmittingDisabled] = useState(false);

  useEffect(() => {
    console.log("page ===>", page)
    if (page !== 3) {
      return;
    }
    console.log("traps.length ===>", traps.length)
    setIsSubmittingDisabled(traps.length === 0);

    if (traps.length === 0) {
      setCanSwipe(false);
    }
    if (traps.length > 0) {
      setCanSwipe(true);
    }
  }, [page, traps]);

  const toggleOption = (key: string) => {
    if (key === "all") {
      if (traps.includes("all")) {
        // If "all" is selected, deselect everything
        setTraps([]);
      } else {
        // If "all" is not selected, select all options
        setTraps(["social", "porn", "youtube", "news", "gaming", "all"]);
      }
    } else {
      // Handle individual option selection
      const newTraps = traps.includes(key) 
        ? traps.filter((k) => k !== key) 
        : [...traps, key];
      
      // Remove "all" if it was selected and we're deselecting an individual option
      const filteredTraps = newTraps.filter((k) => k !== "all");
      
      // Check if all individual options are now selected
      const allIndividualOptions = ["social", "porn", "youtube", "news", "gaming"];
      const allSelected = allIndividualOptions.every(option => filteredTraps.includes(option));
      
      // If all individual options are selected, add "all" back
      if (allSelected) {
        setTraps([...filteredTraps, "all"]);
      } else {
        setTraps(filteredTraps);
      }
    }
  };

  //

  useEffect(() => {
    if (page !== 4) {
      return;
    }

    setIsSubmittingDisabled(scrollTimes.length === 0);
    if (scrollTimes.length === 0) {
      setCanSwipe(false);
    };
    if (scrollTimes.length > 0) {
      setCanSwipe(true);
    }
  }, [page, scrollTimes]);

  const toggleOptionScrollTimes = (key: string) => {
    if (key === "all") {
      if (scrollTimes.includes("all")) {
        // If "all" is selected, deselect everything
        setScrollTimes([]);
      } else {
        // If "all" is not selected, select all options
        setScrollTimes(["morning", "work", "evening", "latenight", "all"]);
      }
    } else {
      // Handle individual option selection
      const newScrollTimes = scrollTimes.includes(key) 
        ? scrollTimes.filter((k) => k !== key) 
        : [...scrollTimes, key];
      
      // Remove "all" if it was selected and we're deselecting an individual option
      const filteredScrollTimes = newScrollTimes.filter((k) => k !== "all");
      
      // Check if all individual options are now selected
      const allIndividualOptions = ["morning", "work", "evening", "latenight"];
      const allSelected = allIndividualOptions.every(option => filteredScrollTimes.includes(option));
      
      // If all individual options are selected, add "all" back
      if (allSelected) {
        setScrollTimes([...filteredScrollTimes, "all"]);
      } else {
        setScrollTimes(filteredScrollTimes);
      }
    }
  };

  //
  useEffect(() => {
    if (page !== 5) {
      return;
    }
    
    setIsSubmittingDisabled(concerns.length === 0);

    if (concerns.length === 0) {
      setCanSwipe(false);
    };
    if (concerns.length > 0) {
      setCanSwipe(true);
    }
  }, [concerns, page]);

  const toggleOptionConcerns = (option: string) => {
    if (option === "all") {
      if (concerns.includes("all")) {
        // If "all" is selected, deselect everything
        setConcerns([]);
      } else {
        // If "all" is not selected, select all options
        setConcerns(["choose_screen_over_friends", "brain_feels_fried", "turning_lazy", "wasting_life", "all"]);
      }
    } else {
      // Handle individual option selection
      const newConcerns = concerns.includes(option) 
        ? concerns.filter((o) => o !== option) 
        : [...concerns, option];
      
      // Remove "all" if it was selected and we're deselecting an individual option
      const filteredConcerns = newConcerns.filter((o) => o !== "all");
      
      // Check if all individual options are now selected
      const allIndividualOptions = ["choose_screen_over_friends", "brain_feels_fried", "turning_lazy", "wasting_life"];
      const allSelected = allIndividualOptions.every(opt => filteredConcerns.includes(opt));
      
      // If all individual options are selected, add "all" back
      if (allSelected) {
        setConcerns([...filteredConcerns, "all"]);
      } else {
        setConcerns(filteredConcerns);
      }
    }
  };

  //
  //
  useEffect(() => {
    if (page !== 6) {
      return;
    }
    
    setIsSubmittingDisabled(improvementOptions.length === 0);

    if (improvementOptions.length === 0) {
      setCanSwipe(false);
    };
    if (improvementOptions.length > 0) {
      setCanSwipe(true);
    }
  }, [improvementOptions, page]);

  const toggleOptionImprovement = (option: string) => {
    setImprovementOptions(
      improvementOptions.includes(option)
        ? improvementOptions.filter((o) => o !== option)
        : [...improvementOptions, option]
    );
  };

  // Handler to go to next page programmatically
  const goToNext = () => {
    if (page < SCREEN_ORDER.length - 1) {
      const newPage = page + 1

      if ([3, 4, 5, 6].includes(newPage)) {
        setCanSwipe(false);
        setIsSubmittingDisabled(true);
      }

      pagerRef.current?.setPage(newPage);
    }
  };
  
  const goToBack = () => {
    if (page > 0) {
      const newPage = page - 1

      if ([3, 4, 5, 6].includes(newPage)) {
        setCanSwipe(false);
        setIsSubmittingDisabled(true);
      } else {
        setCanSwipe(true);
        setIsSubmittingDisabled(false);
      }
      pagerRef.current?.setPage(newPage);
    }
  };

  // Handler for screens that require submit
  const getScreenProps = (screenIdx: number) => {
    const props: any = {
      isActive: page === screenIdx,
    };

    if ([3].includes(screenIdx)) {
      props.traps = traps;
      props.toggleOption = toggleOption;
    }
    if ([4].includes(screenIdx)) {
      props.scrollTimes = scrollTimes;
      props.toggleOption = toggleOptionScrollTimes;
    }
    if ([5].includes(screenIdx)) {
      props.concerns = concerns;
      props.toggleOption = toggleOptionConcerns;
    }
    if ([6].includes(screenIdx)) {
      props.improvementOptions = improvementOptions;
      props.toggleOption = toggleOptionImprovement;
    }
    if (screenIdx === 3) {
      props.progressBarHeight = progressBarHeight;
    }

    // Screen 10: disable swipe, advance by button, show Screen 11 overlay
    // if (screenIdx === 10) {
    //   props.onSubmit = () => {
    //     setShowScreen11(true);
    //   };
    //   props.disableSwipe = true;
    // }

    // // Screen 12: disable swipe, advance by button
    // if (screenIdx === 12) {
    //   props.onSubmit = () => goToNext();
    //   props.disableSwipe = true;
    // }
    
    return props;
  };

  // Handle Screen11 fade-out start: jump to Screen12 in pager
  // const handleScreen11FadeOutStart = () => {
  //   pagerRef.current?.setPageWithoutAnimation(12);
  // };

  // // Handle Screen11 finish: remove overlay
  // const handleScreen11Finish = () => {
  //   setShowScreen11(false);
  // };

  // Render screens with props for submit screens
  const renderScreens = () =>
    SCREEN_ORDER.map((Screen, idx) => {
      const props = getScreenProps(idx);
      return (
      <View key={idx} style={{ flex: 1 }}>
          <Screen {...props} />
      </View>
      );
    });

  // Determine scrollEnabled
  // const isSwipeDisabled = page === 10 || page === 12 || ([3, 4, 5, 6].includes(page) && !canSwipe);
  const isSwipeDisabled = ([3, 4, 5, 6].includes(page) && !canSwipe);

  const currentDot = Math.min(Math.max(page, 0), PROGRESS_SCREENS - 1);
  
  const DOT_SPACING = scale(8);
  const DOT_HEIGHT = scale(3);
  
  const dotWidth =
  dotsRowWidth > 0
    ? (dotsRowWidth - DOT_SPACING * (PROGRESS_SCREENS - 1)) /
      PROGRESS_SCREENS
    : 0;

    const renderPagerDots = () => {
      const currentDot = Math.min(Math.max(page, 0), PROGRESS_SCREENS - 1);
      return Array.from({ length: PROGRESS_SCREENS }).map((_, i) => {
        const isActive = i === currentDot;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: dotWidth,
                height: DOT_HEIGHT,
                marginRight: i === PROGRESS_SCREENS - 1 ? 0 : DOT_SPACING,
              },
              isActive ? styles.dotActive : styles.dotInactive,
            ]}
          />
        );
      });
    };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.functions.invoke("submit-onboarding-survey", {
        body: { traps, scrollTimes, concerns, improvementOptions },
      });

      if (error) {
        // Don't block the user, just log the error
        console.error("Error submitting survey:", error);
      }
    } catch (e) {
      console.error("Caught error submitting survey:", e);
    }

    goToNext();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={page}
        scrollEnabled={!isSwipeDisabled}
        onPageSelected={(e) => {
          const newPage = e.nativeEvent.position;
          setPage(newPage);

          console.log("newPage ===>", newPage);
          // Reset canSwipe when navigating to screens 6-10
          if ([3, 4, 5, 6].includes(newPage)) {
            setCanSwipe(false);
          }
        }}
        overdrag={false}
      >
        {renderScreens()}
      </PagerView>

      {/* {showScreen11 && (
        <Screen11
          onFadeOutStart={handleScreen11FadeOutStart}
          onFinish={handleScreen11Finish}
        />
      )} */}

      {/* {page >= 0 && page <= 10 && (
        
      )} */}

      <View
        style={[styles.progressBarContainer, { bottom: insets.bottom + scaleVertical(16) }]}
        onLayout={(e) => setProgressBarHeight(e.nativeEvent.layout.height)}
      >
        <View
          style={styles.dotsRow}
          onLayout={(e) => setDotsRowWidth(e.nativeEvent.layout.width)}
        >
          {renderPagerDots()}
        </View>

        <TouchableOpacity
          style={[
            styles.primaryBtn,
            isSubmittingDisabled && styles.buttonDisabled,
          ]}
          onPress={() => {
            if (page === 6) {
              handleSubmit();
            } else if (page === SCREEN_ORDER?.length - 1) { //last page
              console.log('LAST PAGE????');
              router.push("/(onboarding)/paywall-pricing")
            } else {
              goToNext();
            }
          }}
          activeOpacity={0.9}
          disabled={isSubmittingDisabled}
        >
          <Text style={styles.primaryText}>{"Continue"}</Text>
        </TouchableOpacity>

        {[4, 5, 6].includes(page) && (
          <TouchableOpacity
            style={[styles.backBtn]}
            onPress={goToBack}
            activeOpacity={0.9}
          >
            <Text style={styles.backText}>{"Back"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(20),
    width: '100%',
    marginTop: height < 700 ? scaleVertical(20) : scaleVertical(24),
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: scale(16),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
  backBtn: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(8),
    paddingHorizontal: scaleVertical(20),
    marginTop: scaleVertical(8),
  },
  backText: {
    color: "rgba(255, 202, 145, 1)",
    fontSize: scale(16),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
  progressBarContainer: {
    position: 'absolute',
    marginHorizontal: scale(24),
    alignItems: 'center',
    left: 0,
    right: 0
  },
  dot: {
    borderRadius: 2,
  },
  dotActive: {
    backgroundColor: "#FFCA91",
  },
  dotInactive: {
    backgroundColor: "#FFFFFF",
    opacity: 0.2,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
