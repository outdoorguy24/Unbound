import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { COLORS, LAYOUT, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

const heading = "So let's make your ancestors proud.";
const body =
  "You're not broken, just overstimulated. With Unbound, you'll finally pick up that book or grab the hammer. Lace up your shoes. Laugh deep. Start a business. Hike a mountain. Call a friend. You'll make progress towards a better life.";

export default function Screen5() {
  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScreenContainer style={styles.screenContainer}>
        <View style={styles.content}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>{heading}</Text>
          </View>
          <View style={styles.illustrationContainer}>
            <Image source={require("../../assets/images/onboarding/hiker.png")} style={styles.illustration} />
          </View>
          <Text style={styles.body}>{body}</Text>
        </View>
      </ScreenContainer>
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
  screenContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: (SPACING.xxl + SPACING.lg) * 0.25,
  },
  headingContainer: {
    backgroundColor: "#2C1A05",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: "#E6D3A7",
    width: '100%',
  },
  heading: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "900",
    color: "#F3E2C7",
    textAlign: "center",
    marginTop: SPACING.sm,
  },
  illustrationContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  illustration: {
    width: "100%",
    aspectRatio: 1.2,
    height: undefined,
    resizeMode: "contain",
    marginBottom: SPACING.sm,
  },
  body: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: 20,
    lineHeight: 30,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.xl,
    fontWeight: "bold",
  },
});
