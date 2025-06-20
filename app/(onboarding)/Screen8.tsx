import { COLORS, LAYOUT, SHADOWS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const heading = "What concerns you the most about too much phone use?";
const options = [
  "Choosing the screen over friends, family, & hobbies",
  "Brain feels fried and scattered",
  "Turning into a lazy POS",
  "Feeling like I'm wasting my life",
];

export default function Screen8({ onSubmit, disableSwipe, enableSwipe, disableSwipeFn }: any) {
  const { traps, scrollTimes, concerns, setConcerns } = useOnboarding();

  useEffect(() => {
    if (concerns.length === 0 && disableSwipeFn) disableSwipeFn();
    if (concerns.length > 0 && enableSwipe) enableSwipe();
  }, [disableSwipeFn, enableSwipe, concerns]);

  const toggleOption = (option: string) => {
    setConcerns(
      concerns.includes(option)
        ? concerns.filter((o) => o !== option)
        : [...concerns, option]
    );
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.functions.invoke("submit-onboarding-survey", {
        body: { traps, scrollTimes, concerns },
      });

      if (error) {
        // Don't block the user, just log the error
        console.error("Error submitting survey:", error);
      }
    } catch (e) {
      console.error("Caught error submitting survey:", e);
    }

    // Proceed to the next screen regardless
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.heading}>{heading}</Text>
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.option, concerns.includes(option) && styles.optionSelected, SHADOWS.small]}
                onPress={() => toggleOption(option)}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionText, concerns.includes(option) && styles.optionTextSelected]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, concerns.length === 0 && styles.buttonDisabled, SHADOWS.medium]}
          onPress={handleSubmit}
          disabled={concerns.length === 0}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
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
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  optionsContainer: {
    width: "100%",
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  option: {
    backgroundColor: "transparent",
    borderColor: COLORS.textPrimary,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },
  optionSelected: {
    backgroundColor: "rgba(159, 106, 0, 0.99)",
    borderColor: COLORS.textPrimary,
    opacity: 1,
  },
  optionText: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.textPrimary,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  optionTextSelected: {
    color: COLORS.textPrimary,
  },
  button: {
    backgroundColor: "#3C6845",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: SPACING.huge,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.buttonText,
    fontSize: 24,
    fontWeight: "bold",
  },
});
