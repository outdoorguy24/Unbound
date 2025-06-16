import { COLORS, SHADOWS, SPACING } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const steps = [
  {
    key: 1,
    icon: require("../../assets/images/onboarding/shield.png"),
    title: "1. Choose what to block",
    desc: "Social media, Porn, ESPN, etc",
  },
  {
    key: 2,
    icon: require("../../assets/images/onboarding/compass.png"),
    title: "2. Set your schedule",
    desc: "9-5, 5-9, or 23 hours/day. Your choice.",
  },
  {
    key: 3,
    icon: require("../../assets/images/onboarding/check.png"),
    title: "3. Start the block",
    desc: "Zero access. Zero excuses. ZERO way out.",
  },
  {
    key: 4,
    icon: require("../../assets/images/onboarding/mountains.png"),
    title: "4. Live your damn life",
    desc: "You only get one after all",
  },
];

export default function Screen9({ onSubmit, disableSwipe, enableSwipe, disableSwipeFn }: any) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (selected === null && disableSwipeFn) disableSwipeFn();
    if (selected !== null && enableSwipe) enableSwipe();
  }, [disableSwipeFn, enableSwipe, selected]);

  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.topRightImageWrap}>
          <Image source={require("../../assets/images/onboarding/climber.png")} style={styles.topRightImage} />
        </View>
        <View style={styles.content}>
          <Text style={styles.heading}>Here&apos;s how {"\n"} Unbound works:</Text>
          <View style={styles.stepsContainer}>
            {steps.map((step) => (
              <TouchableOpacity
                key={step.key}
                style={[styles.stepBox, selected === String(step.key) && styles.stepBoxSelected]}
                onPress={() => setSelected(selected === String(step.key) ? null : String(step.key))}
                activeOpacity={0.8}
              >
                <Image source={step.icon} style={styles.stepIcon} />
                <View style={styles.stepTextWrap}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, SHADOWS.medium, !selected && styles.buttonDisabled]}
          onPress={() => {
            if (onSubmit) onSubmit();
          }}
          disabled={!selected}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    position: "relative",
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  heading: {
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    marginTop: 24,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    lineHeight: 32,
    width: "100%",
  },
  placeholder: {
    width: width * 0.7,
    height: width * 0.35,
    backgroundColor: "#4B3415",
    borderRadius: 24,
    marginVertical: 18,
  },
  body: {
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    lineHeight: 28,
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
  buttonText: {
    color: "#F3E2C7",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Vollkorn-Bold",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: SPACING.lg,
  },
  topRightImageWrap: {
    position: "absolute",
    top: SPACING.xl,
    right: 0,
    zIndex: 2,
    paddingTop: 24,
    paddingRight: SPACING.xs,
  },
  topRightImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  stepsContainer: {
    width: "100%",
  },
  stepBox: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: COLORS.textPrimary,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: "transparent",
  },
  stepIcon: {
    width: 54,
    height: 54,
    resizeMode: "contain",
    marginRight: SPACING.md,
  },
  stepTextWrap: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: "Arial",
    fontSize: 20,
    color: COLORS.textPrimary,
    fontWeight: "bold",
    marginBottom: SPACING.xs,
  },
  stepDesc: {
    fontFamily: "Vollkorn-Regular",
    fontSize: 12,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  stepBoxSelected: {
    backgroundColor: "rgba(159, 106, 0, 0.99)",
    borderColor: COLORS.textPrimary,
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
