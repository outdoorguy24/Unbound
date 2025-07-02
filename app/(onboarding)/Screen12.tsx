import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { COLORS, LAYOUT, SHADOWS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { router } from "expo-router";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Screen12() {
  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScreenContainer style={styles.screenContainer}>
        <View style={styles.container}>
          <Image source={require("../../assets/images/onboarding/torch.png")} style={styles.torch} />
          <View style={styles.content}>
            <Text style={styles.heading}>Join the ranks of{"\n"}the digitally liberated.</Text>
            <Text style={styles.subtitle}>
              This separates the{"\n"} dreamers from{"\n"} the doers.
            </Text>
            <Text style={[styles.paragraph, { marginTop: '5%' }]}>
              Right now, millions of men{"\n"}are scrolling mindlessly while{"\n"}you&apos;re here, ready to break free.
            </Text>
            <Text style={styles.paragraph}>
              For $3 a month, you&apos;re not just{"\n"}getting an app, you&apos;re joining a{"\n"}community of men
              who&apos;ve decided{"\n"}their goals are worth more than {"\n"}corporate profits.
            </Text>
            <Text style={styles.paragraph}>
              This isn&apos;t for everyone. Most guys{"\n"}will keep giving their lives away,{"\n"}one scroll at a time.
              So what&apos;s it{"\n"} gonna be?
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.button, SHADOWS.medium]}
            onPress={() => router.push("/(onboarding)/paywall-pricing")}
          >
            <Text style={styles.buttonText}>Join us</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  screenContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: 4.5,
    paddingBottom: 0,
    justifyContent: "space-between",
  },
  torch: {
    position: "absolute",
    top: 50,
    left: 55,
    right: 0,
    width: 500,
    height: 500,
    resizeMode: "contain",
    zIndex: 2,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 16,
  },
  heading: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: "900",
    color: COLORS.textPrimary,
    textAlign: "left",
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  subtitle: {
    fontFamily: "Vollkorn-Italic",
    fontSize: 22,
    color: COLORS.textPrimary,
    fontStyle: "italic",
    marginBottom: SPACING.lg,
    textAlign: "left",
  },
  paragraph: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: "left",
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
    marginBottom: SPACING.xl * 1.8,
  },
  buttonText: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.buttonText,
    fontSize: 24,
    fontWeight: "bold",
  },
});
