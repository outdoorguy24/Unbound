import { SPACING } from "@/constants/theme";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

export default function Screen1() {
  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.textGroup}>
          <Text style={styles.textBlock}>YOU COME FROM MEN{"\n"}WHO HUNTED ON OPEN PLAINS.</Text>
          <Text style={styles.textBlock}>WHO BUILT THINGS{"\n"}WITH THEIR HANDS.</Text>
          <Text style={styles.textBlock}>
            WHO TOLD STORIES{"\n"}NEXT TO THE FIRE UNDER{"\n"}A BLANKET OF STARS.
          </Text>
          <Text style={[styles.textBlock, { fontSize: 22 }]}>NOW WE SCROLL.{"\n"}WE SWIPE. WE SIT.</Text>
          <Text style={styles.textBlock}>THE WORLD HAS CHANGED.</Text>
          <Text style={styles.textBlockEmphasis}>BUT THAT FIRE INSIDE{"\n"}YOU HASN&apos;T.</Text>
        </View>
        <View style={styles.illustrationContainer}>
          <Image source={require("../../assets/images/onboarding/lineageheads.png")} style={styles.illustration} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: "12%",
  },
  textGroup: {
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 32,
  },
  textBlock: {
    color: "#2B1B10",
    fontFamily: "Vollkorn-SemiBold",
    fontSize: 18,
    textAlign: "center",
    textTransform: "uppercase",
    lineHeight: 32,
    letterSpacing: 0.5,
    fontWeight: "bold",
    marginBottom: 12,
  },
  textBlockEmphasis: {
    color: "#2B1B10",
    fontFamily: "Vollkorn-Bold",
    fontSize: 22,
    textAlign: "center",
    textTransform: "uppercase",
    lineHeight: 32,
    letterSpacing: 0.5,
    fontWeight: "900",
    marginBottom: 24,
  },
  illustrationContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: SPACING.md,
    marginTop: SPACING.xs,
  },
  illustration: {
    width: "100%",
    aspectRatio: 1.8,
    height: undefined,
    resizeMode: "contain",
  },
});
