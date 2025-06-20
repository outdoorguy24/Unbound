import { COLORS, LAYOUT, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

export default function Screen3() {
  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <Image source={require("../../assets/images/onboarding/slotmachine.png")} style={styles.illustration} />
        </View>
        <Text style={styles.heading}>Every minute on your phone is a minute{"\n"}you&apos;ll never get back.</Text>
        <Text style={styles.body}>
          You&apos;re giving away your life one swipe at a time to billionaire tech overlords who don&apos;t care about
          your goals. We are the pawns in their battle to see who can extract our attention in the most addictive way
          for <Text style={styles.underline}>profit</Text>.
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    aspectRatio: 1.2,
    height: undefined,
    resizeMode: "contain",
    marginBottom: SPACING.sm,
    marginTop: SPACING.xl,
  },
  heading: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "900",
    color: "#1A0E05",
    textAlign: "center",
    marginBottom: SPACING.md,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  body: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: 18,
    lineHeight: 30,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.xl,
    fontWeight: "bold",
  },
  underline: {
    textDecorationLine: "underline",
  },
});
