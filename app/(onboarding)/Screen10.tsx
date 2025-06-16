import { COLORS, LAYOUT, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

export default function Screen10() {
  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>
            Accountability & community{"\n"}are <Text style={styles.underline}>powerful</Text>...
          </Text>
          <Text style={styles.subtitle}>
            So you&apos;ll also be paired{"\n"}with another guy to see{"\n"}each others&apos; progress.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "900",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  underline: {
    textDecorationLine: "underline",
    fontWeight: "900",
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "900",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginTop: SPACING.xl,
  },
});
