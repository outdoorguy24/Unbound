import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { SHADOWS, SPACING } from "@/constants/theme";
import React from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const steps = [
  {
    key: 1,
    icon: require("../../assets/images/onboarding/shield.png"),
    title: "Choose what to block",
    desc: "Social media, Porn, ESPN, etc",
  },
  {
    key: 2,
    icon: require("../../assets/images/onboarding/compass.png"),
    title: "Set your schedule",
    desc: "9-5, 5-9, or 23 hours/day. Your choice.",
  },
  {
    key: 3,
    icon: require("../../assets/images/onboarding/check.png"),
    title: "Start the block",
    desc: "Zero access. Zero excuses. ZERO way out.",
  },
  {
    key: 4,
    icon: require("../../assets/images/onboarding/mountains.png"),
    title: "Live your damn life",
    desc: "You only get one after all",
  },
];

export default function Screen9({ onSubmit }: any) {
  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScreenContainer style={styles.screenContainer}>
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Step Indicator */}
            <View style={styles.stepIndicatorContainer}>
              {steps.map((step, index) => (
                <React.Fragment key={step.key}>
                  <View style={[styles.stepDot, index === 0 && styles.stepDotActive]}>
                    <Text style={[styles.stepDotText, index === 0 && styles.stepDotTextActive]}>{step.key}</Text>
                  </View>
                  {index < steps.length - 1 && <View style={styles.stepLine} />}
                </React.Fragment>
              ))}
            </View>
            
            <Text style={styles.heading}>Here&apos;s how{"\n"}Unbound works:</Text>
            <View style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <View key={step.key} style={styles.stepRow}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>{step.key}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Image source={step.icon} style={styles.stepIcon} />
                    <View style={styles.stepTextWrap}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <Text style={styles.stepDesc}>{step.desc}</Text>
                    </View>
                  </View>
                  {index < steps.length - 1 && <View style={styles.connector} />}
                </View>
              ))}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.button, SHADOWS.medium]}
            onPress={() => {
              if (onSubmit) onSubmit();
            }}
          >
            <Text style={styles.buttonText}>Next</Text>
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
    position: "relative",
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
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(44, 26, 5, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotActive: {
    backgroundColor: "#2C1A05",
  },
  stepDotText: {
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    fontSize: 14,
  },
  stepDotTextActive: {
    color: "#F3E2C7",
  },
  stepLine: {
    width: 20,
    height: 2,
    backgroundColor: "rgba(44, 26, 5, 0.2)",
    marginHorizontal: 4,
  },
  heading: {
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: SPACING.xxl,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    lineHeight: 36,
    textAlign: "center",
  },
  stepsContainer: {
    width: "100%",
    paddingHorizontal: SPACING.sm,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.xl,
    position: "relative",
  },
  stepNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2C1A05",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
    marginTop: 8,
  },
  stepNumber: {
    color: "#F3E2C7",
    fontFamily: "Vollkorn-Bold",
    fontSize: 24,
  },
  stepContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  stepIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: SPACING.md,
  },
  stepTextWrap: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: "Vollkorn-Bold",
    fontSize: 20,
    color: "#2C1A05",
    marginBottom: 4,
  },
  stepDesc: {
    fontFamily: "Vollkorn-Regular",
    fontSize: 16,
    color: "#4B3415",
    lineHeight: 22,
  },
  connector: {
    position: "absolute",
    left: 20,
    top: 48,
    width: 2,
    height: 40,
    backgroundColor: "#2C1A05",
    opacity: 0.3,
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
});
