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
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const AMPM = ["AM", "PM"];

interface ScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  onScheduleSaved: (schedule: { days: string[]; start_time: string; end_time: string }) => void;
}

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

    // Convert times to minutes for comparison
    const startMinutes = (startHour % 12) + (startAMPM === "PM" ? 12 : 0) + startMinute;
    const endMinutes = (endHour % 12) + (endAMPM === "PM" ? 12 : 0) + endMinute;

    if (startMinutes >= endMinutes) {
      Alert.alert("Invalid Schedule", "End time must be after start time.");
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

  const TimePickerWheel = ({ 
    value, 
    onValueChange, 
    data, 
    width = "30%" 
  }: { 
    value: number; 
    onValueChange: (value: number) => void; 
    data: number[]; 
    width?: string | number;
  }) => {
    const scrollViewRef = React.useRef<ScrollView>(null);
    const itemHeight = 40;

    // Set initial scroll position to the selected value
    React.useEffect(() => {
      const index = data.indexOf(value);
      if (index !== -1 && scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: index * itemHeight,
            animated: false
          });
        }, 100);
      }
    }, []);

    return (
      <ScrollView
        ref={scrollViewRef}
        style={[styles.timeWheel, { width }]}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: itemHeight * 2 }}
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
    onValueChange 
  }: { 
    value: string; 
    onValueChange: (value: string) => void; 
  }) => {
    const scrollViewRef = React.useRef<ScrollView>(null);
    const itemHeight = 40;

    // Set initial scroll position to the selected value
    React.useEffect(() => {
      const index = AMPM.indexOf(value);
      if (index !== -1 && scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: index * itemHeight,
            animated: false
          });
        }, 100);
      }
    }, []);

    return (
      <ScrollView
        ref={scrollViewRef}
        style={[styles.timeWheel, { width: "25%" }]}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: itemHeight * 2 }}
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
              <Text style={styles.title}>Set Your Schedule</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Days Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Days</Text>
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
            </View>

            {/* Time Selection */}
            <View style={[styles.section, { marginTop: 0 }]}>
              {/* Start Time */}
              <View style={styles.timeSection}>
                <Text style={styles.timeLabel}>Start Time</Text>
                <View style={styles.timePickerContainer}>
                  <TimePickerWheel value={startHour} onValueChange={setStartHour} data={HOURS} />
                  <Text style={styles.timeSeparator}>:</Text>
                  <TimePickerWheel value={startMinute} onValueChange={setStartMinute} data={MINUTES} />
                  <AMPMWheel value={startAMPM} onValueChange={setStartAMPM} />
                </View>
              </View>

              {/* End Time */}
              <View style={styles.timeSection}>
                <Text style={styles.timeLabel}>End Time</Text>
                <View style={styles.timePickerContainer}>
                  <TimePickerWheel value={endHour} onValueChange={setEndHour} data={HOURS} />
                  <Text style={styles.timeSeparator}>:</Text>
                  <TimePickerWheel value={endMinute} onValueChange={setEndMinute} data={MINUTES} />
                  <AMPMWheel value={endAMPM} onValueChange={setEndAMPM} />
                </View>
              </View>
            </View>

            {/* Schedule Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Your Schedule</Text>
              <Text style={styles.summaryText}>
                {selectedDays.join(", ")} from {formatTime(startHour, startMinute, startAMPM)} to{" "}
                {formatTime(endHour, endMinute, endAMPM)}
              </Text>
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
    zIndex: 1000,
    paddingHorizontal: 20,
  },
  modalBackground: {
    width: "100%",
    maxHeight: "85%",
    borderRadius: 28,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContent: {
    backgroundColor: "transparent",
    padding: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
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
    fontSize: 18,
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
    fontSize: 16,
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
  summarySection: {
    backgroundColor: "#F9E7B0",
    borderRadius: 12,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.textPrimary,
    fontWeight: "bold",
    marginBottom: SPACING.sm,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.heading.fontFamily,
    color: COLORS.textPrimary,
    lineHeight: 20,
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
    backgroundColor: "#3C6845",
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
}); 