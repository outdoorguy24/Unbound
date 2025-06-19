import { COLORS, LAYOUT, SHADOWS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const heading = "What concerns you the most about too much phone use?";
const options = [
  "Easy to not prioritize in-person relationships",
  "Wrecked attention span",
  "Becoming weak & soft",
  "Dying with regrets about not being present",
];

export default function Screen8({ onSubmit, disableSwipe, enableSwipe, disableSwipeFn }: any) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (selected.length === 0 && disableSwipeFn) disableSwipeFn();
    if (selected.length > 0 && enableSwipe) enableSwipe();
  }, [disableSwipeFn, enableSwipe, selected]);

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
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
                style={[styles.option, selected.includes(option) && styles.optionSelected, SHADOWS.small]}
                onPress={() => toggleOption(option)}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionText, selected.includes(option) && styles.optionTextSelected]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, selected.length === 0 && styles.buttonDisabled, SHADOWS.medium]}
          onPress={() => {
            if (onSubmit) onSubmit();
          }}
          disabled={selected.length === 0}
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
