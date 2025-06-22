import { SPACING } from "@/constants/theme";
import React from "react";
import { Image, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PornBlockModalProps {
  visible: boolean;
  onClose: () => void;
  variant?: 1 | 2;
}

export default function PornBlockModal({ visible, onClose, variant = 1 }: PornBlockModalProps) {
  if (variant === 2) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <ImageBackground
            source={require("../../assets/images/ancestor-quote.jpeg")}
            style={styles.variant2Container}
            imageStyle={{ borderRadius: SPACING.xl }}
            resizeMode="cover"
          >
            <TouchableOpacity style={styles.variant2Button} onPress={onClose}>
              <Text style={styles.buttonText}>Sir yes sir</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </Modal>
    );
  }

  // Original modal for variant 1
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <ImageBackground
          source={require("../../assets/images/parchment-bg.png")}
          style={styles.bg}
          imageStyle={styles.bgImage}
        >
          <View style={styles.card}>
            <Image
              source={require("../../assets/images/block-1.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
            <Text style={styles.text}>You chose this,{"\n"}now stick with it!</Text>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Sir yes sir</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(44,26,5,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  bg: {
    width: 360,
    borderRadius: SPACING.xl,
    overflow: "hidden",
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
  fullImage: {
    width: '100%',
    height: 300,
    marginBottom: SPACING.lg,
  },
  illustration: {
    width: 180,
    height: 180,
    marginBottom: SPACING.md,
  },
  text: {
    fontFamily: "Vollkorn-Bold",
    fontSize: 24,
    color: "#2C1A05",
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  button: {
    backgroundColor: "#3D7A4C",
    borderRadius: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  buttonText: {
    color: "#F9E7B0",
    fontFamily: "Vollkorn-Bold",
    fontSize: 18,
  },
  variant2Container: {
    width: 320,
    height: 420,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 50,
  },
  variant2Button: {
    backgroundColor: "#3D7A4C",
    borderRadius: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderWidth: 4,
    borderColor: "#F3E2C7",
  },
  author: {
    fontFamily: "Vollkorn-SemiBold",
    fontSize: 22,
    color: "#564110",
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
});
