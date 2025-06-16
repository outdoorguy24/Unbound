import { COLORS, LAYOUT, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

export default function Screen4() {
  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <Text style={styles.heading}>
          Which is why this app{"\n"}is an act of <Text style={styles.underline}>rebellion.</Text>
        </Text>
        <View style={styles.illustrationContainer}>
          <Image source={require("../../assets/images/onboarding/builder.png")} style={styles.illustration} />
        </View>
        <Text style={styles.body}>Society wants a bunch of{"\n"}screen-addicted consumers.</Text>
        <Text style={styles.subBody}>
          But you&apos;re here to:{"\n"}Create.{"\n"}Explore.{"\n"}Build.
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
    justifyContent: "center",
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  heading: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "900",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  underline: {
    textDecorationLine: "underline",
    fontWeight: "900",
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
    marginBottom: SPACING.md,
  },
  body: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: 20,
    lineHeight: 30,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.lg,
    fontWeight: "bold",
  },
  subBody: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: 20,
    lineHeight: 30,
    color: COLORS.textPrimary,
    textAlign: "center",
    fontWeight: "bold",
  },
});
