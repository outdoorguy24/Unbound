import { COLORS, SPACING } from "@/constants/theme";
import React from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ConfirmChangesModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  addedApps: string[];
  removedApps: string[];
}

const ConfirmChangesModal: React.FC<ConfirmChangesModalProps> = ({
  visible,
  onClose,
  onConfirm,
  addedApps,
  removedApps,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Confirm Your Battle Plan</Text>
          <Text style={styles.modalText}>
            You chose from our top list of digital traps <Text style={{textDecorationLine: 'underline'}}>designed to steal your potential</Text>. Apple makes you confirm these choices in their secure interface - no shortcuts.
            {"\n\n"}
            Add other distractions while{"\n"}you're there if needed.
          </Text>

          <ScrollView style={styles.listsContainer}>
            {addedApps.length > 0 && (
              <View style={styles.appListSection}>
                <Text style={styles.listTitle}>Add:</Text>
                {addedApps.map((app) => (
                  <Text key={app} style={styles.appItem}>• {app}</Text>
                ))}
              </View>
            )}
            {removedApps.length > 0 && (
              <View style={styles.appListSection}>
                <Text style={styles.listTitle}>Remove:</Text>
                {removedApps.map((app) => (
                  <Text key={app} style={styles.appItem}>• {app}</Text>
                ))}
              </View>
            )}
          </ScrollView>

          <Text style={styles.proTip}>
            Pro tip: The search bar at the top works wonders
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.buttonConfirm]}
              onPress={onConfirm}
            >
              <Text style={styles.textStyle}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    margin: SPACING.md,
    backgroundColor: "#F9E7B0", // Parchment-like
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    borderWidth: 2,
    borderColor: "#4B3415",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    marginBottom: SPACING.md,
  },
  modalText: {
    fontSize: 16,
    fontFamily: "Vollkorn-Regular",
    color: "#2C1A05",
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  listsContainer: {
    maxHeight: 200,
    width: '100%',
    marginBottom: SPACING.md,
  },
  appListSection: {
    marginBottom: SPACING.sm,
    alignSelf: 'flex-start',
    width: '100%',
  },
  listTitle: {
    fontSize: 18,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    marginBottom: SPACING.xs,
  },
  appItem: {
    fontSize: 16,
    fontFamily: "Vollkorn-Regular",
    color: "#2C1A05",
    marginLeft: SPACING.md,
  },
  proTip: {
    fontSize: 14,
    fontFamily: "Vollkorn-Italic",
    color: "#4B3415",
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    borderRadius: 15,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    elevation: 2,
    width: '80%',
  },
  buttonConfirm: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: '#0b4d11',
  },
  textStyle: {
    color: "white",
    fontFamily: "Vollkorn-Bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default ConfirmChangesModal; 