import { COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { saveUserSchedule } from "@/lib/userTracking";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = [0, 15, 30, 45];
const AMPM = ["AM", "PM"];

interface ScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  onScheduleSaved: (schedule: { days: string[]; start_time: string; end_time: string }) => void;
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    zIndex: 1000,
  },
  modalBackground: {
    width: '100%',
    maxHeight: "85%",
    borderRadius: 28,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: 'white',
  },
  modalContent: {
    backgroundColor: "transparent",
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.textPrimary,
    fontWeight: "bold",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.textPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#F9E7B0",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 21,
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.textPrimary,
    fontWeight: "bold",
    marginBottom: SPACING.sm,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: SPACING.sm,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
  dayButtonSelected: {
    backgroundColor: COLORS.textPrimary,
  },
  dayButtonText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.textPrimary,
    fontWeight: "bold",
  },
  dayButtonTextSelected: {
    color: "#F9E7B0",
  },
  timeSection: {
    marginBottom: SPACING.sm,
  },
  timeLabel: {
    fontSize: 19,
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.textPrimary,
    fontWeight: "bold",
    marginBottom: SPACING.xs,
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9E7B0",
    borderRadius: 12,
    padding: SPACING.sm,
    minHeight: 120,
    width: "100%",
    paddingHorizontal: SPACING.md,
  },
  timeWheel: {
    height: 120,
    backgroundColor: "rgba(86, 65, 16, 0.05)",
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  timeWheelItem: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  timeWheelItemSelected: {
    backgroundColor: COLORS.textPrimary,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  timeWheelText: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.textPrimary,
    fontWeight: "bold",
  },
  timeWheelTextSelected: {
    color: "#F9E7B0",
  },
  timeSeparator: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.textPrimary,
    fontWeight: "bold",
    marginHorizontal: 8,
    width: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    marginRight: SPACING.sm,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.textPrimary,
    fontWeight: "bold",
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.textPrimary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    marginLeft: SPACING.sm,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: "#F9E7B0",
    fontWeight: "bold",
  },
  allDaysButton: {
    backgroundColor: COLORS.textPrimary,
    borderRadius: 12,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
    alignSelf: "center",
    marginTop: SPACING.sm,
  },
  allDaysButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: "#F9E7B0",
    fontWeight: "bold",
  },
});

const TimePickerWheel = ({
  value,
  onValueChange,
  data,
  width = "30%",
}: {
  value: number;
  onValueChange: (value: number) => void;
  data: number[];
  width?: string | number;
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const itemHeight = 40;

  React.useEffect(() => {
    const index = data.findIndex((d) => d === value);
    if (index !== -1) {
      // Use timeout to ensure the scroll happens after the modal is fully visible
      setTimeout(
        () =>
          scrollViewRef.current?.scrollTo({
            y: index * itemHeight,
            animated: true,
          }),
        100
      );
    }
  }, [value]); // Rerun when value changes to handle both tap and initial set

  return (
    <ScrollView
      ref={scrollViewRef}
      style={[styles.timeWheel, { width: width as any }]}
      showsVerticalScrollIndicator={false}
      snapToInterval={itemHeight}
      decelerationRate="fast"
      contentContainerStyle={{ paddingVertical: itemHeight }}
    >
      {data.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.timeWheelItem,
            value === item && styles.timeWheelItemSelected,
          ]}
          onPress={() => onValueChange(item)}
        >
          <Text
            style={[
              styles.timeWheelText,
              value === item && styles.timeWheelTextSelected,
            ]}
          >
            {item.toString().padStart(2, "0")}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const AMPMWheel = ({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const itemHeight = 40;

  React.useEffect(() => {
    const index = AMPM.findIndex((d) => d === value);
    if (index !== -1) {
      setTimeout(
        () =>
          scrollViewRef.current?.scrollTo({
            y: index * itemHeight,
            animated: true,
          }),
        100
      );
    }
  }, [value]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={[styles.timeWheel, { width: "25%" }]}
      showsVerticalScrollIndicator={false}
      snapToInterval={itemHeight}
      decelerationRate="fast"
      contentContainerStyle={{ paddingVertical: itemHeight }}
    >
      {AMPM.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.timeWheelItem,
            value === item && styles.timeWheelItemSelected,
          ]}
          onPress={() => onValueChange(item)}
        >
          <Text
            style={[
              styles.timeWheelText,
              value === item && styles.timeWheelTextSelected,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default function ScheduleModal({ visible, onClose, onScheduleSaved }: ScheduleModalProps) {
  const { user } = useAuth();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startHour, setStartHour] = useState(12);
  const [startMinute, setStartMinute] = useState(0);
  const [startAMPM, setStartAMPM] = useState("PM");
  const [endHour, setEndHour] = useState(6);
  const [endMinute, setEndMinute] = useState(0);
  const [endAMPM, setEndAMPM] = useState("PM");
  const [loading, setLoading] = useState(false);

  const formatTime = (hour: number, minute: number, ampm: string) => {
    const formattedHour = hour.toString().padStart(2, "0");
    const formattedMinute = minute.toString().padStart(2, "0");
    return `${formattedHour}:${formattedMinute} ${ampm}`;
  };

  const validateSchedule = () => {
    if (selectedDays.length === 0) {
      Alert.alert("Invalid Schedule", "Please select at least one day of the week.");
      return false;
    }

    if (
      startHour === endHour &&
      startMinute === endMinute &&
      startAMPM === endAMPM
    ) {
      Alert.alert(
        "Invalid Schedule",
        "A 24-hour block is not allowed. Please select a different end time."
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateSchedule()) return;
    if (!user?.id) return;

    setLoading(true);
    try {
      const schedule = {
        days: selectedDays,
        start_time: formatTime(startHour, startMinute, startAMPM),
        end_time: formatTime(endHour, endMinute, endAMPM),
      };

      await saveUserSchedule(user.id, schedule);
      onScheduleSaved(schedule);
      onClose();
    } catch (error) {
      console.error("Error saving schedule:", error);
      Alert.alert("Error", "Failed to save schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleToggleAllDays = () => {
    if (selectedDays.length === DAYS.length) {
      setSelectedDays([]);
    } else {
      setSelectedDays(DAYS);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ImageBackground
          source={require("../../assets/images/parchment-bg.png")}
          style={styles.modalBackground}
          resizeMode="cover"
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Days Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Select Days</Text>
              <View style={styles.daysContainer}>
                {DAYS.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(day) && styles.dayButtonSelected,
                    ]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        selectedDays.includes(day) && styles.dayButtonTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={handleToggleAllDays} style={styles.allDaysButton}>
                <Text style={styles.allDaysButtonText}>
                  {selectedDays.length === DAYS.length ? "Deselect All Days" : "Select All Days"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Time Selection */}
            <View style={[styles.section, { marginTop: 0 }]}>
              {/* Start Time */}
              <View style={styles.timeSection}>
                <Text style={styles.timeLabel}>2. Start Time</Text>
                <View style={styles.timePickerContainer}>
                  <TimePickerWheel value={startHour} onValueChange={setStartHour} data={HOURS} />
                  <Text style={styles.timeSeparator}>:</Text>
                  <TimePickerWheel value={startMinute} onValueChange={setStartMinute} data={MINUTES} />
                  <AMPMWheel value={startAMPM} onValueChange={setStartAMPM} />
                </View>
              </View>

              {/* End Time */}
              <View style={styles.timeSection}>
                <Text style={styles.timeLabel}>3. End Time</Text>
                <View style={styles.timePickerContainer}>
                  <TimePickerWheel value={endHour} onValueChange={setEndHour} data={HOURS} />
                  <Text style={styles.timeSeparator}>:</Text>
                  <TimePickerWheel value={endMinute} onValueChange={setEndMinute} data={MINUTES} />
                  <AMPMWheel value={endAMPM} onValueChange={setEndAMPM} />
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? "Saving..." : "Save Schedule"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
} 