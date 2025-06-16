import { Dimensions, TextStyle } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  // Primary colors
  primary: "#2C1A05",
  secondary: "#4B3415",
  background: "#F3E2C7",

  // Text colors
  textPrimary: "#2C1A05",
  textSecondary: "#4B3415",

  // UI colors
  buttonPrimary: "#5C3D18",
  buttonText: "#F3E2C7",

  // Status colors
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FFC107",
};

export const TYPOGRAPHY: Record<string, TextStyle> = {
  heading: {
    fontFamily: "Vollkorn-Bold",
    fontSize: 22,
    lineHeight: 32,
    letterSpacing: 1.2,
    textTransform: "uppercase" as const,
  },
  subheading: {
    fontFamily: "Vollkorn-Bold",
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 1.1,
    textTransform: "uppercase" as const,
  },
  body: {
    fontFamily: "Vollkorn-Bold",
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 1.1,
    textTransform: "uppercase" as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  huge: 80,
  massive: 100,
};

export const LAYOUT = {
  screenWidth: width,
  screenHeight: height,
  paddingHorizontal: 24,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
};
