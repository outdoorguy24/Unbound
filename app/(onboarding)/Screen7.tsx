import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useEffect } from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const heading = "When do you find yourself mindlessly scrolling?";
const OPTIONS = [
  {
    key: "morning",
    label: "MORNING",
    desc: "Starting the day distracted",
    image: require("../../assets/images/onboarding/morning.png"),
  },
  {
    key: "work",
    label: "WORK BREAKS",
    desc: "Procrastinating productivity",
    image: require("../../assets/images/onboarding/work.png"),
  },
  {
    key: "evening",
    label: "EVENING",
    desc: "Unwinding becomes scrolling",
    image: require("../../assets/images/onboarding/evening.png"),
  },
  {
    key: "latenight",
    label: "LATE NIGHT",
    desc: "Can't stop, won't stop",
    image: require("../../assets/images/onboarding/latenight.png"),
  },
];

export default function Screen7({ onSubmit, disableSwipe, enableSwipe, disableSwipeFn }: any) {
  const { scrollTimes, setScrollTimes } = useOnboarding();

  useEffect(() => {
    if (scrollTimes.length === 0 && disableSwipeFn) disableSwipeFn();
  }, [disableSwipeFn, scrollTimes]);

  const toggleOption = (key: string) => {
    setScrollTimes(
      scrollTimes.includes(key)
        ? scrollTimes.filter((k) => k !== key)
        : [...scrollTimes, key]
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScreenContainer style={styles.screenContainer}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.heading}>{heading}</Text>
            <View style={styles.optionsContainer}>
              {OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.option, scrollTimes.includes(option.key) && styles.optionSelected]}
                  onPress={() => toggleOption(option.key)}
                  activeOpacity={0.8}
                >
                  <View style={styles.iconWrap}>
                    <Image source={option.image} style={styles.iconImage} />
                  </View>
                  <View style={styles.labelDescWrap}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionDesc}>{option.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.nextBtn, scrollTimes.length === 0 && styles.nextBtnDisabled]}
            onPress={() => {
              if (enableSwipe) enableSwipe();
              if (onSubmit) onSubmit();
            }}
            disabled={scrollTimes.length === 0}
          >
            <Text style={styles.nextBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
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
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  heading: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "900",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.xl,
    marginTop: SPACING.xl,
  },
  optionsContainer: {
    width: "100%",
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: COLORS.textPrimary,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.md,
    justifyContent: "flex-start",
  },
  optionSelected: {
    backgroundColor: "rgba(159, 106, 0, 0.99)",
    borderColor: COLORS.textPrimary,
    opacity: 1,
  },
  iconWrap: {
    width: 48,
    alignItems: "center",
    marginRight: SPACING.md,
  },
  iconImage: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  labelDescWrap: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  optionLabel: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.textPrimary,
    fontSize: 20,
    textAlign: "left",
    fontWeight: "bold",
    marginRight: 8,
    marginBottom: 2,
  },
  optionDesc: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    textAlign: "left",
    fontFamily: "Vollkorn-Regular",
    marginRight: SPACING.sm,
    marginTop: SPACING.xs,
  },
  nextBtn: {
    backgroundColor: "#3C6845",
    borderRadius: 12,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    minWidth: 200,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: SPACING.huge,
  },
  nextBtnDisabled: {
    opacity: 0.5,
  },
  nextBtnText: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.buttonText,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
