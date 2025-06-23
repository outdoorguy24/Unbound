import { SPACING } from "@/constants/theme";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ConfirmBattlePlanModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  addedApps: string[];
  removedApps: string[];
}

const ConfirmBattlePlanModal = ({
  visible,
  onClose,
  onConfirm,
  addedApps,
  removedApps,
}: ConfirmBattlePlanModalProps) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Confirm Your Battle Plan</Text>
          <Text style={styles.body}>
            You chose from our top list of digital traps designed to{" "}
            <Text style={styles.underline}>steal your potential</Text>. Apple makes you
            confirm these choices manually in their secure interface - no shortcuts.
          </Text>
          <Text style={styles.body}>
            Add other distractions while you're there if needed.
          </Text>

          {addedApps.length > 0 && (
            <View style={styles.changeList}>
              <Text style={styles.listTitle}>Add:</Text>
              {addedApps.map((app) => (
                <Text key={`add-${app}`} style={styles.listItem}>• {app}</Text>
              ))}
            </View>
          )}

          {removedApps.length > 0 && (
            <View style={styles.changeList}>
              <Text style={styles.listTitle}>Remove:</Text>
              {removedApps.map((app) => (
                <Text key={`remove-${app}`} style={styles.listItem}>• {app}</Text>
              ))}
            </View>
          )}

          <Text style={styles.proTip}>
            Pro tip: The search bar at the top works wonders
          </Text>

          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#F9E7B0", // Light parchment
    borderRadius: 22,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    alignItems: "center",
    width: "90%",
    maxWidth: 400,
    borderWidth: 1.5,
    borderColor: "#E6D3A7",
  },
  title: {
    fontFamily: "Vollkorn-Bold",
    fontSize: 24,
    color: "#2C1A05", // Dark brown
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  body: {
    fontFamily: "Vollkorn-Regular",
    fontSize: 16,
    color: "#2C1A05",
    textAlign: "center",
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  changeList: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
    paddingLeft: SPACING.lg,
    width: '100%',
  },
  listTitle: {
    fontFamily: "Vollkorn-Bold",
    fontSize: 16,
    color: "#2C1A05",
    marginBottom: SPACING.xs,
  },
  listItem: {
    fontFamily: "Vollkorn-Regular",
    fontSize: 16,
    color: "#2C1A05",
    lineHeight: 22,
  },
  proTip: {
    fontFamily: "Vollkorn-Italic",
    fontSize: 14,
    color: "#4B3415",
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  confirmButton: {
    backgroundColor: "#4B3415", // Dark brown
    borderRadius: 30,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    width: "100%",
    alignItems: "center",
  },
  confirmButtonText: {
    fontFamily: "Vollkorn-Bold",
    fontSize: 18,
    color: "#F9E7B0", // Light parchment
  },
});

export default ConfirmBattlePlanModal; 