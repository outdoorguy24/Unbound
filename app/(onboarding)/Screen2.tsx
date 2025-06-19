import { COLORS, LAYOUT, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

export default function Screen2() {
  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <Image source={require("../../assets/images/onboarding/trap.png")} style={styles.illustration} />
        </View>
        <Text style={styles.heading}>Technology has benefits,{"\n"}but it&apos;s stealing your life.</Text>
        <Text style={styles.subheading}>
          You know what you should be doing, but the phone is always there with a quick hit.
        </Text>
        <Text style={styles.body}>
          It creates a <Text style={styles.underline}>cycle</Text> of cheap dopamine, constant distractions, and a lack
          of purpose and drive.
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.xxl,
  },
  illustrationContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  illustration: {
    width: "100%",
    aspectRatio: 1.8,
    height: undefined,
    resizeMode: "contain",
    marginBottom: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  heading: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: 900,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  subheading: {
    fontFamily: TYPOGRAPHY.subheading.fontFamily,
    fontSize: 20,
    lineHeight: 28,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  body: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: 18,
    lineHeight: 30,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  underline: {
    textDecorationLine: "underline",
  },
});
