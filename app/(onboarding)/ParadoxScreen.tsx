import { COLORS, LAYOUT, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ParadoxScreen({ isActive, onSubmit }: { isActive?: boolean; onSubmit?: () => void }) {
  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Well this is awkward</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.body}><Text style={styles.bold}>You&apos;re using an app...</Text>{"\n"}to stop using apps.{"\n\n"}
            <Text style={styles.bold}>You&apos;re staring at a screen...</Text>{"\n"}to avoid staring at screens.{"\n\n"}
            <Text style={styles.bold}>You downloaded more technology...</Text>{"\n"}to escape technology.
          </Text>
          <Text style={styles.caption}>Yes, we see the irony.</Text>
          <Text style={styles.caption}>But sometimes you need to{"\n"}fight fire with fire.</Text>
        </View>
        <TouchableOpacity
          style={styles.greenButton}
          onPress={onSubmit}
        >
          <Text style={styles.greenButtonText}>Embrace the Paradox</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: COLORS.primary,
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
    color: COLORS.background,
    textAlign: "center",
  },
  bodyContainer: {
    marginBottom: SPACING.xl,
    width: '100%',
  },
  body: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: 20,
    lineHeight: 32,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.md,
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  caption: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: 20,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  greenButton: {
    backgroundColor: "#3C6845",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
    alignSelf: "center",
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  greenButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Vollkorn-Bold",
  },
}); 