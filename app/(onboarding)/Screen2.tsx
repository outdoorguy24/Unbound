import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { COLORS, LAYOUT, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

export default function Screen2() {
  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScreenContainer style={styles.screenContainer}>
        <View style={styles.content}>
          <View style={styles.illustrationContainer}>
            <Image source={require("../../assets/images/onboarding/trap.png")} style={styles.illustration} />
          </View>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Technology has benefits, but it's{"\n"}stealing your life.</Text>
          </View>
          <Text style={styles.subheading} numberOfLines={3}>
            You know what you should be doing,{"\n"}but the phone is always there,{"\n"}ready with a quick hit.
          </Text>
          <Text style={styles.body} numberOfLines={3}>
            It creates a <Text style={styles.underline}>cycle</Text> of cheap dopamine, constant distractions, and a lack
            of purpose and drive.
          </Text>
        </View>
      </ScreenContainer>
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
    paddingTop: SPACING.xxl * 0.125,
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
  headingContainer: {
    backgroundColor: "#2C1A05",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: "#E6D3A7",
    width: '100%',
  },
  heading: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "900",
    color: "#F3E2C7",
    textAlign: "center",
  },
  subheading: {
    fontFamily: TYPOGRAPHY.subheading.fontFamily,
    fontSize: 18,
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
