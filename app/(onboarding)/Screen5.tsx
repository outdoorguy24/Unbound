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
      <View style={styles.content}>
        <Text style={styles.heading}>{heading}</Text>
        <View style={styles.illustrationContainer}>
          <Image source={require("../../assets/images/onboarding/hiker.png")} style={styles.illustration} />
        </View>
        <Text style={styles.body}>{body}</Text>
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
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "900",
    color: "#1A0E05",
    textAlign: "center",
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    marginBottom: SPACING.md,
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
