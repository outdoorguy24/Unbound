import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Path, Svg } from "react-native-svg";
import FirstSliderGradient from "./FirstSliderGradient";
import {
  AllIcon,
  BoredomIcon,
  BrainIcon,
  DatingIcon,
  EnjoyPresentMomentIcon,
  EveningIcon,
  FitnessIcon,
  GamingIcon,
  GetOutdoorsIcon,
  HealthIcon,
  LateNightIcon,
  LazyIcon,
  LearnSomethingNewIcon,
  MorningIcon,
  NewsIcon,
  PornIcon,
  ProductivityIcon,
  RelationshipsIcon,
  ShoppingIcon,
  SleepIcon,
  SocialMediaIcon,
  StressIcon,
  TimeWithFriendsAndFamilyIcon,
  WastingLifeIcon,
  WeekendIcon,
  WorkBreaksIcon,
  YouTubeIcon
} from "./SurveyIcons";
import TopTextGradient from "./TopTextGradient";

// Simple SVG Tick Component
const TickIcon = () => (
  <Svg width="15" height="10" viewBox="0 0 15 10" fill="none">
    <Path 
      d="M13.3239 1L5.32386 9L1.6875 5.36364" 
      stroke="rgba(44, 23, 7, 0.7)" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

interface SurveyOption {
  id: string;
  text: string;
  icon: string;
  svgIcon?: React.ReactNode;
}

interface OnboardingSlide {
  id: number;
  type: 'carousel' | 'survey';
  image: any;
  text: string;
  subtext: string;
  question?: string;
  options?: SurveyOption[];
  textPosition?: 'top' | 'bottom';
  backgroundImageHeight?: string;
}

interface OnboardingCarouselProps {
  onComplete: () => void;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s1.png"),
    text: "you come from men who built things ",
    subtext: "Men who hunted on open plains & told stories next to a fire under a blanket of stars. The world has changed, but your genetics haven't.",
    textPosition: 'bottom',
  },
  {
    id: 2,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s2.png"),
    text: "phone use is stealing your potential",
    subtext: "With every swipe, corporations harvest your attention for profit while that promotion, workout, or relationship is put off",
    textPosition: 'bottom',
  },
  {
    id: 3,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s3.png"),
    text: "which is why This app is an act of rebellion",
    subtext: "Society wants a bunch of screen-addicted consumers. But you're here to create, explore, & build.",
    textPosition: 'bottom',
  },
  {
    id: 4,
    type: 'survey',
    image: require("../../../assets/images/onboarding/survey_s.png"),
    text: "",
    subtext: "",
    question: "What's stealing your time and focus?",
    options: [
      { id: "social", text: "Social media", icon: "📱", svgIcon: <SocialMediaIcon /> },
      { id: "porn", text: "Porn", icon: "🔞", svgIcon: <PornIcon /> },
      { id: "youtube", text: "Youtube", icon: "📺", svgIcon: <YouTubeIcon /> },
      { id: "news", text: "News", icon: "📰", svgIcon: <NewsIcon /> },
      { id: "gaming", text: "Gaming", icon: "🎮", svgIcon: <GamingIcon /> },
      { id: "shopping", text: "Online shopping", icon: "🛒", svgIcon: <ShoppingIcon /> },
      { id: "dating", text: "Dating apps", icon: "💕", svgIcon: <DatingIcon /> },
      { id: "all", text: "All of the above", icon: "🔥", svgIcon: <AllIcon /> },
    ],
  },
  {
    id: 5,
    type: 'survey',
    image: require("../../../assets/images/onboarding/survey_s.png"),
    text: "",
    subtext: "",
    question: "When do you find yourself mindlessly scrolling?",
    options: [
      { id: "morning", text: "Morning", icon: "🌅", svgIcon: <MorningIcon /> },
      { id: "work", text: "Work breaks", icon: "💼", svgIcon: <WorkBreaksIcon /> },
      { id: "evening", text: "Evening", icon: "🌆", svgIcon: <EveningIcon /> },
      { id: "night", text: "Late night", icon: "🌙", svgIcon: <LateNightIcon /> },
      { id: "weekend", text: "Weekends", icon: "🏖️", svgIcon: <WeekendIcon /> },
      { id: "boredom", text: "When bored", icon: "😴", svgIcon: <BoredomIcon /> },
      { id: "stress", text: "When stressed", icon: "😰", svgIcon: <StressIcon /> },
      { id: "all", text: "All of the above", icon: "🔥", svgIcon: <AllIcon /> },
    ],
  },
  {
    id: 6,
    type: 'survey',
    image: require("../../../assets/images/onboarding/survey_s.png"),
    text: "",
    subtext: "",
    question: "What scares you the most about phone addiction?",
    options: [
      { id: "relationships", text: "Choosing the screen over friends, family & hobbies", icon: "👥", svgIcon: <RelationshipsIcon /> },
      { id: "brain", text: "Brain feels fried and scattered", icon: "🧠", svgIcon: <BrainIcon /> },
      { id: "lazy", text: "Turning into a lazy POS", icon: "😴", svgIcon: <LazyIcon /> },
      { id: "wasting", text: "Feeling like I'm wasting my life", icon: "⏰", svgIcon: <WastingLifeIcon /> },
      { id: "productivity", text: "Missing out on career opportunities", icon: "💼", svgIcon: <ProductivityIcon /> },
      { id: "health", text: "Physical health deteriorating", icon: "🏃", svgIcon: <HealthIcon /> },
      { id: "sleep", text: "Poor sleep quality", icon: "😴", svgIcon: <SleepIcon /> },
      { id: "all", text: "All of the above", icon: "🔥", svgIcon: <AllIcon /> },
    ],
  },
  {
    id: 7,
    type: 'survey',
    image: require("../../../assets/images/onboarding/survey_s.png"),
    text: "",
    subtext: "",
    question: "What would you rather spend time doing?",
    options: [
      { id: "fitness", text: "Fitness", icon: "💪", svgIcon: <FitnessIcon /> },
      { id: "outdoors", text: "Get outdoors", icon: "🌲", svgIcon: <GetOutdoorsIcon /> },
      { id: "learn", text: "Learn something new", icon: "📚", svgIcon: <LearnSomethingNewIcon /> },
      { id: "friends", text: "Time with friends & family", icon: "👥", svgIcon: <TimeWithFriendsAndFamilyIcon /> },
      { id: "present", text: "Enjoying the present moment", icon: "😌", svgIcon: <EnjoyPresentMomentIcon /> },
    ],
  },
  {
    id: 8,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s4.png"),
    text: "Men are almost 2x more likely to be addicted to their phones than women",
    subtext: "",
    textPosition: 'bottom',
  },
  {
    id: 9,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s5.png"),
    text: "unbound breaks the addiction loop with no willpower required",
    subtext: "",
    textPosition: 'bottom',
  },
  {
    id: 10,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s6.png"),
    text: "the average guy spends 2 months a year looking at their phone",
    subtext: "",
    textPosition: 'bottom',
  },
  {
    id: 11,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s7.png"),
    text: "so Unbound let's you block distracting apps, websites, and porn with zero workarounds",
    subtext: "",
    textPosition: 'bottom',
  },
  {
    id: 12,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s8.png"),
    text: "it's hard to make lasting changes when you go after it alone",
    subtext: "",
    textPosition: 'bottom',
  },
  {
    id: 13,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s9.png"),
    text: "with unbound you get  community & accountability  built in",
    subtext: "",
    textPosition: 'bottom',
  },
  {
    id: 14,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s10.png"),
    text: "SO INSTEAD OF REACHING FOR YOUR PHONE EVERY TIME YOU HAVE A MOMENT OF BOREDOM...",
    subtext: "",
    textPosition: 'top',
  },
  {
    id: 15,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s11.png"),
    text: "AND PROCRASTINATING ON the things that MATTER to you ",
    subtext: "",
    textPosition: 'bottom',
  },
  {
    id: 16,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s12.png"),
    text: "UNBOUND will supercharge your ability to focus",
    subtext: "",
    textPosition: 'top',
  },
  {
    id: 17,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s13.png"),
    text: "give you more energy & time to put towards your goals",
    subtext: "",
    textPosition: 'bottom',
  },
  {
    id: 18,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s14.png"),
    text: "AND EXPAND YOUR SENSE OF PURPOSE & FREEDOM",
    subtext: "",
    textPosition: 'top',
  },
  {
    id: 19,
    type: 'carousel',
    image: require("../../../assets/images/onboarding/s15.png"),
    text: "It’s time to get your life back",
    subtext: "",
    textPosition: 'top',
  },
];

export default function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{[key: number]: string[]}>({});
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const handleOptionToggle = (optionId: string) => {
    const currentSelections = selectedOptions[currentIndex] || [];
    const newSelections = currentSelections.includes(optionId)
      ? currentSelections.filter(id => id !== optionId)
      : [...currentSelections, optionId];
    
    setSelectedOptions({
      ...selectedOptions,
      [currentIndex]: newSelections,
    });
  };

  const renderOption = (option: SurveyOption, slideIndex: number) => {
    const isSelected = selectedOptions[slideIndex]?.includes(option.id) || false;
    
    return (
      <TouchableOpacity
        key={option.id}
        style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
        onPress={() => handleOptionToggle(option.id)}
      >
        <View style={styles.optionIconContainer}>
          {option.svgIcon ? option.svgIcon : <Text style={styles.optionIcon}>{option.icon}</Text>}
        </View>
        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
          {option.text}
        </Text>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <TickIcon />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
    <View style={styles.slide}>
      <ImageBackground 
  source={item.image} 
  style={[
    styles.backgroundImage,
    item.type === 'survey' && styles.backgroundImageSurvey,
    item.textPosition === 'top' && styles.backgroundImageTop, // new style
  ]} 
  resizeMode="cover"
>

        {item.type === 'survey' && <View style={styles.overlay} />}
        <View style={[
          styles.svgGradientContainer,
          item.textPosition === 'top' ? styles.svgGradientTop : styles.svgGradientBottom
        ]}>
          {item.textPosition === 'top' ? <TopTextGradient /> : <FirstSliderGradient />}
        </View>

        {item.type === 'carousel' ? (
          <View style={[
            styles.content,
            item.textPosition === 'bottom' ? styles.contentBottom : styles.contentTop
          ]}>
            <Text style={styles.slideText}>{item.text}</Text>
            <Text style={styles.slideSubtext}>{item.subtext}</Text>
          </View>
        ) : (
          <>
            <Text style={styles.questionTextSurvey}>{item.question}</Text>
            <View style={[
              styles.surveyContentContainer,
              index === 3 && styles.surveyContentContainerFirst
            ]}>
              <ScrollView 
                style={[
                  styles.optionsScrollView,
                  item.type === 'survey' && index > 3 && styles.optionsScrollViewWithBack
                ]}
                contentContainerStyle={styles.optionsContainer}
                showsVerticalScrollIndicator={true}
                indicatorStyle="white"
                scrollIndicatorInsets={{ right: 5 }}
              >
                {item.options?.map(option => renderOption(option, index))}
              </ScrollView>
            </View>
          </>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
          
          {item.type === 'survey' && index > 3 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[
          styles.progressContainer,
          item.type === 'survey' && index > 3 && styles.progressContainerWithBack
        ]}>
          {onboardingData.map((_, idx) => {
            const totalScreens = onboardingData.length;
            const availableWidth = screenWidth - 40;
            const gapSize = 6;
            const totalGapWidth = (totalScreens - 1) * gapSize;
            const availableForDashes = availableWidth - totalGapWidth;
            const dashWidth = Math.max(8, Math.min(24, availableForDashes / totalScreens));
            const isActive = idx <= index;
            
            return (
              <View
                key={idx}
                style={[
                  styles.progressDash,
                  { width: dashWidth },
                  isActive ? styles.progressDashActive : styles.progressDashInactive,
                ]}
              />
            );
          })}
        </View>
      </ImageBackground>
    </View>
  );

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        style={{ flex: 1 }}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  slide: {
    width: screenWidth,
    height: screenHeight,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "80%",
  },
  backgroundImageSurvey: {
    height: "50%",
  },
  backgroundImageTop: {
    height: "100%",
    width: "100%",
  },  
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  svgGradientContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  svgGradientTop: {
    top: 0,
  },
  svgGradientBottom: {
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  contentTop: {
    justifyContent: "flex-start",
    paddingTop: 100,
  },
  contentBottom: {
    justifyContent: "flex-end",
    paddingBottom: 150,
  },
  optionsScrollView: {
    flex: 1,
    width: "100%",
  },
  optionsScrollViewWithBack: {
    flex: 1,
    width: "100%",
  },
  slideText: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Cinzel-Bold",
    fontSize: 18,
    lineHeight: 35,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  slideSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "normal",
    textAlign: "center",
    lineHeight: 22,
    fontFamily: "Zilla-Slab-Regular",
  },
  questionText: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Cinzel-Bold",
    fontSize: 24,
    lineHeight: 35,
    letterSpacing: 0.5,
    marginBottom: 40,
  },
  questionTextSurvey: {
    position: "absolute",
    top: 120,
    left: 20,
    right: 20,
    color: "#FFF",
    textAlign: "left",
    fontFamily: "Cinzel-Bold",
    fontSize: 20,
    lineHeight: 35,
    letterSpacing: 0.5,
  },
  surveyContentContainer: {
    position: "absolute",
    top: 220,
    left: 0,
    right: 0,
    bottom: 190,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  surveyContentContainerFirst: {
    position: "absolute",
    top: 190,
    left: 0,
    right: 0,
    bottom: 130,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  optionsContainer: {
    width: "100%",
    gap: 12,
    paddingVertical: 10,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(44, 23, 7, 0.6)",
    backgroundColor: "rgba(44, 23, 7, 0.7)",
  },
  optionButtonSelected: {
    borderColor: "#FFCA91",
  },
  optionIconContainer: {
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionIcon: {
    fontSize: 20,
  },
  optionText: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Zilla-Slab-Regular",
    fontWeight: "500",
    lineHeight: 22, // matches your design
  },
  optionTextSelected: {
    fontFamily: "Zilla-Slab-Bold",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  checkboxSelected: {
    backgroundColor: "#FFCA91",
    borderColor: "#FFCA91",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 25,
    paddingTop: 20,
  },
  continueButton: {
    display: "flex",
    width: 345,
    paddingVertical: 20,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
    borderRadius: 6,
    backgroundColor: "#BE5E19",
  },
  continueButtonText: {
    fontFamily: "Zilla-Slab-Bold",
    color: "#FFF",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButtonText: {
    color: "#FFCA91",
    textAlign: "right",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0.5,
    fontFamily: "Zilla-Slab-Regular",
  },
  progressContainer: {
    position: "absolute",
    bottom: 110,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  progressContainerWithBack: {
    bottom: 150,
  },
  progressDash: {
    height: 3,
    borderRadius: 24,
    minWidth: 8,
    maxWidth: 24,
  },
  progressDashActive: {
    backgroundColor: "#FFCA91",
  },
  progressDashInactive: {
    backgroundColor: "#FFF",
    opacity: 0.2,
  },
});
