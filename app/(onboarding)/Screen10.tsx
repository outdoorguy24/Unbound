import { COLORS, LAYOUT, SHADOWS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Screen10({ onSubmit }: { onSubmit?: () => void }) {
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
          <View style={styles.card}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarWrapper}>
                <Image source={require('../../assets/images/onboarding/avatarguy1.png')} style={styles.avatar} />
              </View>
              <Text style={styles.plusSign}>+</Text>
              <View style={styles.avatarWrapper}>
                <Image source={require('../../assets/images/onboarding/dudewithglasses.png')} style={styles.avatar} />
              </View>
            </View>
            <Text style={styles.subtitle}>
              So you&apos;ll also be paired{"\n"}with another guy to see{"\n"}each others&apos; progress.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, SHADOWS.medium]}
          onPress={() => {
            if (onSubmit) onSubmit();
          }}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
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
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  card: {
    borderRadius: SPACING.xl,
    padding: SPACING.xl,
    alignItems: "center",
    width: '100%',
    marginTop: SPACING.lg,
    borderWidth: 4,
    borderColor: '#2C1A05',
  },
  title: {
    fontFamily: "Vollkorn-Bold",
    fontSize: 28,
    lineHeight: 36,
    color: "#2C1A05",
    textAlign: "center",
  },
  underline: {
    textDecorationLine: "underline",
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  plusSign: {
    fontFamily: 'Vollkorn-Bold',
    fontSize: 64,
    color: '#2C1A05',
    marginHorizontal: SPACING.md,
  },
  subtitle: {
    fontFamily: "Vollkorn-Bold",
    fontSize: 20,
    lineHeight: 28,
    color: "#4B3415",
    textAlign: "center",
    marginTop: SPACING.md,
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
  buttonText: {
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.buttonText,
    fontSize: 24,
    fontWeight: "bold",
  },
});
