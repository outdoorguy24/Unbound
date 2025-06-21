import { COLORS, LAYOUT, SHADOWS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useEffect } from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const heading = "First, know your trap. What's stealing your time and focus?";
const OPTIONS = [
  { key: "social", label: "Social Media", image: require("../../assets/images/onboarding/social.png") },
  { key: "porn", label: "Porn", image: require("../../assets/images/onboarding/porn.png") },
  { key: "youtube", label: "YouTube", image: require("../../assets/images/onboarding/youtube.png") },
  { key: "news", label: "Reddit/News", image: require("../../assets/images/onboarding/reddit.png") },
  { key: "gaming", label: "Gaming", image: require("../../assets/images/onboarding/gaming.png") },
  { key: "all", label: "All of the Above", image: require("../../assets/images/onboarding/all.png") },
];

export default function Screen6({ onSubmit, disableSwipe, enableSwipe, disableSwipeFn }: any) {
  const { traps, setTraps } = useOnboarding();

  useEffect(() => {
    if (traps.length === 0 && disableSwipeFn) disableSwipeFn();
    if (traps.length > 0 && enableSwipe) enableSwipe();
  }, [disableSwipeFn, enableSwipe, traps]);

  const toggleOption = (key: string) => {
    setTraps(
      traps.includes(key) ? traps.filter((k) => k !== key) : [...traps, key]
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.heading}>{heading}</Text>
          <View style={styles.grid}>
            {OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[styles.option, traps.includes(option.key) && styles.optionSelected, SHADOWS.small]}
                onPress={() => toggleOption(option.key)}
                activeOpacity={0.8}
              >
                <Image source={option.image} style={styles.iconImage} />
                <Text style={[styles.optionLabel, traps.includes(option.key) && styles.optionLabelSelected]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, traps.length === 0 && styles.buttonDisabled, SHADOWS.medium]}
          onPress={() => {
            if (onSubmit) onSubmit();
          }}
          disabled={traps.length === 0}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.xxl,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  option: {
    width: "44%",
    aspectRatio: 1,
    backgroundColor: "transparent",
    borderRadius: 16,
    margin: "3%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.textPrimary,
  },
  optionSelected: {
    backgroundColor: "rgba(159, 106, 0, 0.99)",
    borderColor: COLORS.textPrimary,
    opacity: 1,
  },
  iconImage: {
    width: 56,
    height: 56,
    resizeMode: "contain",
    marginBottom: SPACING.md,
  },
  optionLabel: {
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 17,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: SPACING.sm,
  },
  optionLabelSelected: {
    color: COLORS.textPrimary,
  },
  button: {
    backgroundColor: "#3C6845",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: SPACING.huge,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.buttonText,
    fontSize: 24,
    fontWeight: "bold",
  },
});
