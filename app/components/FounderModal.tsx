import { SPACING } from "@/constants/theme";
import React, { useState } from "react";
import { Image, ImageBackground, Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface FounderModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function FounderModal({ visible, onClose }: FounderModalProps) {
  const [buttonText, setButtonText] = useState("Cash Out Dividends");

  const handleButtonPress = () => {
    setButtonText("Maybe next time...");
  };

  // Reset button text when modal is closed
  const handleClose = () => {
    setButtonText("Cash Out Dividends");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <ImageBackground
          source={require("../../assets/images/parchment-bg.png")}
          style={styles.bg}
          imageStyle={styles.bgImage}
        >
          <View style={styles.card}>
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <Image source={require("../../assets/images/remove-circle.png")} style={styles.closeIcon} />
            </Pressable>
            <Text style={styles.title}>To Mom & Dad,</Text>
            <Text style={styles.message}>
              App made possible by you.{"\n"}Love you guys.
            </Text>
            <Pressable style={styles.button} onPress={handleButtonPress}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: "rgba(44,26,5,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  bg: {
    width: '90%',
    maxWidth: 360,
    borderRadius: SPACING.xl,
    overflow: "hidden",
    alignSelf: 'center',
  },
  bgImage: {
    borderRadius: SPACING.xl,
    resizeMode: "cover",
  },
  card: {
    padding: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.00)",
  },
  closeButton: {
    position: "absolute",
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 1,
  },
  closeIcon: {
    width: 32,
    height: 32,
  },
  title: {
    fontFamily: "Vollkorn-Bold",
    fontSize: 28,
    color: "#2C1A05",
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  message: {
    fontFamily: "Vollkorn-Regular",
    fontSize: 22,
    color: "#4B3415",
    textAlign: "center",
    marginBottom: SPACING.xl,
    lineHeight: 32,
  },
  button: {
    backgroundColor: "#3D7A4C",
    borderRadius: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.md,
  },
  buttonText: {
    color: "#F9E7B0",
    fontFamily: "Vollkorn-Bold",
    fontSize: 18,
  },
}); 