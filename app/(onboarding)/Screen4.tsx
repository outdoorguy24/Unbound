import { COLORS, LAYOUT, SPACING, TYPOGRAPHY } from "@/constants/theme";
import React, { useEffect, useRef } from "react";
import { Animated, Image, ImageBackground, StyleSheet, Text, View } from "react-native";

export default function Screen4({ isActive }: { isActive?: boolean }) {
  const fadeAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const runAnimation = () => {
      // Reset animations before running
      fadeAnims.forEach((anim) => anim.setValue(0));
      const animations = fadeAnims.map((anim) => {
        return Animated.timing(anim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        });
      });

      timeoutId = setTimeout(() => {
        Animated.stagger(1500, animations).start();
      }, 2000);
    };

    if (isActive) {
      runAnimation();
    }

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      fadeAnims.forEach((anim) => anim.stopAnimation());
    };
  }, [isActive, fadeAnims]);

  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>
            Which is why this app{"\n"}is an act of <Text style={styles.underline}>rebellion.</Text>
          </Text>
        </View>
        <View style={styles.illustrationContainer}>
          <Image source={require("../../assets/images/onboarding/builder.png")} style={styles.illustration} />
        </View>
        <Text style={styles.body}>Society wants a bunch of{"\n"}screen-addicted consumers.</Text>
        <View>
          <Text style={styles.subBody}>
            But you&apos;re here to:
          </Text>
          <Animated.Text style={[styles.subBody, { opacity: fadeAnims[0] }]}>CREATE.</Animated.Text>
          <Animated.Text style={[styles.subBody, { opacity: fadeAnims[1] }]}>EXPLORE.</Animated.Text>
          <Animated.Text style={[styles.subBody, { opacity: fadeAnims[2] }]}>BUILD.</Animated.Text>
        </View>
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
  headingContainer: {
    backgroundColor: "#2C1A05",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: "#E6D3A7",
    width: '100%',
    marginTop: SPACING.xl,
  },
  heading: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "900",
    color: "#F3E2C7",
    textAlign: "center",
  },
  underline: {
    textDecorationLine: "underline",
    fontWeight: "900",
  },
  illustrationContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: SPACING.md / 4,
    marginTop: SPACING.xl,
  },
  illustration: {
    width: "100%",
    aspectRatio: 1.2,
    height: undefined,
    resizeMode: "contain",
    marginBottom: SPACING.md / 4,
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
