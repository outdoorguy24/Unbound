import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { COLORS, SPACING } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ConfirmBattlePlanModal from "../components/ConfirmBattlePlanModal";
import DefendModal from "../components/DefendModal";
import PornBlockModal from "../components/PornBlockModal";
import ScheduleModal from "../components/ScheduleModal";
import ScreenTimeManager from '../services/ScreenTimeManager';

const SELECTION_STORAGE_KEY = "UNBOUND_SELECTION_KEY";

const APP_ICONS = {
  instagram: require("../../assets/images/instagram.png"),
  facebook: require("../../assets/images/facebook.png"),
  tiktok: require("../../assets/images/tiktok.png"),
  twitter: require("../../assets/images/twitter.png"),
  youtube: require("../../assets/images/youtube.png"),
  discord: require("../../assets/images/discord.png"),
  reddit: require("../../assets/images/reddit.png"),
  porn: require("../../assets/images/porn.png"),
  "add-circle": require("../../assets/images/add-circle.png"),
  "clock-circle": require("../../assets/images/clock-circle.png"),
  security: require("../../assets/images/security.png"),
};

const SOCIAL_APPS = [
  { key: "youtube", name: "YouTube", url: "youtube.com" },
  { key: "tiktok", name: "TikTok", url: "tiktok.com" },
  { key: "instagram", name: "Instagram", url: "instagram.com" },
  { key: "facebook", name: "Facebook", url: "facebook.com" },
  { key: "twitter", name: "X/Twitter", url: "twitter.com" },
  { key: "discord", name: "Discord", url: "discord.com" },
  { key: "reddit", name: "Reddit", url: "reddit.com" },
  {
    key: "porn",
    name: "Porn",
    url: "",
    description: "This enables comprehensive adult content filtering. NoFap engaged.",
  },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function isValidDomain(domain: string) {
  return !!domain && domain.includes(".") && !domain.includes(" ") && domain.length > 2;
}

export default function DefendScreen() {
  const [showModal, setShowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [blocked, setBlocked] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(SOCIAL_APPS.map((app) => [app.key, false]))
  );

  const [blockPorn, setBlockPorn] = useState(false);
  const [showPornInfo, setShowPornInfo] = useState(false);
  const [schedule, setSchedule] = useState<{ days: string[]; start_time: string; end_time: string }>({
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    start_time: "12:00 PM",
    end_time: "6:00 PM",
  });
  const [allDayEveryDay, setAllDayEveryDay] = useState(false);
  const [showPornModal, setShowPornModal] = useState(false);
  const [pornModalVariant, setPornModalVariant] = useState<1 | 2>(1);
  const [isBlockingEnabled, setIsBlockingEnabled] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [preSelected, setPreSelected] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(SOCIAL_APPS.map((app) => [app.key, false]))
  );
  const [confirmedApps, setConfirmedApps] = useState<string[]>([]);
  const [modalData, setModalData] = useState<{ visible: boolean; addedApps: string[]; removedApps: string[]; selectionToConfirm: string[] }>({ visible: false, addedApps: [], removedApps: [], selectionToConfirm: [] });

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    const checkStatus = async () => {
      const status = await ScreenTimeManager.getAuthorizationStatus();
      if (status.isAuthorized) {
        // Check adult content filter status
        const filterStatus = await ScreenTimeManager.getAdultContentFilterStatus();
        setBlockPorn(filterStatus.enabled);
        
        // Your existing code...
        const selection = await AsyncStorage.getItem(SELECTION_STORAGE_KEY);
        if (!selection) {
          setIsSelectionMode(true);
          setIsBlockingEnabled(false);
          setIsEditMode(true);
        } else {
          // Load confirmed apps from storage if needed
          const apps = await AsyncStorage.getItem("UNBOUND_CONFIRMED_APPS");
          setConfirmedApps(apps ? JSON.parse(apps) : []);
          setIsBlockingEnabled(true);
          setIsSelectionMode(false);
          setIsEditMode(false);
        }
      }
    };
    checkStatus();
  }, []);
  
  const handleEnableBlocking = async () => {
    if (Platform.OS !== "ios") return;
    try {
      await ScreenTimeManager.requestAuthorization("individual");
      setIsSelectionMode(true);
    } catch (error) {
      Alert.alert("Error", "Could not enable blocking. Please try again.");
    }
  };

  const toggleBlock = (key: string) => {
    if (!isEditMode) return; // Only allow toggling in edit mode
    setBlocked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTogglePorn = async () => {
    // First check if we have Screen Time authorization
    const authStatus = await ScreenTimeManager.getAuthorizationStatus();
    
    if (!authStatus.isAuthorized) {
      Alert.alert(
        'Screen Time Required',
        'Please enable Screen Time permissions to use adult content blocking.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable',
            onPress: async () => {
              try {
                await ScreenTimeManager.requestAuthorization('individual');
                // After authorization, try the toggle again
                const newAuthStatus = await ScreenTimeManager.getAuthorizationStatus();
                if (newAuthStatus.isAuthorized) {
                  handleTogglePorn(); // Retry
                }
              } catch (error) {
                Alert.alert('Error', 'Failed to enable Screen Time permissions');
              }
            },
          },
        ]
      );
      return;
    }
  
    // Toggle the adult content filter
    try {
      const newValue = !blockPorn;
      const result = await ScreenTimeManager.setAdultContentFilter(newValue);
      
      if (result.success) {
        setBlockPorn(newValue);
        
        if (newValue) {
          // Show the porn modal when enabling
          setPornModalVariant(2);
          setShowPornModal(true);
        } else {
          Alert.alert(
            'Adult Content Filter Disabled',
            'Adult content filtering has been turned off.'
          );
        }
      }
    } catch (error) {
      console.error('Error toggling adult content filter:', error);
      Alert.alert('Error', 'Failed to update adult content filter. Please try again.');
    }
  };
  
  const handleScheduleSaved = (savedSchedule: { days: string[]; start_time: string; end_time: string }) => {
    setSchedule(savedSchedule);
  };

  const handleEditSelection = async () => {
    try {
      // Get the stored selection from AsyncStorage
      const storedSelection = await AsyncStorage.getItem(SELECTION_STORAGE_KEY);
      
      if (storedSelection) {
        // Set it as the current selection before showing the picker
        await ScreenTimeManager.setCurrentSelection(storedSelection);
      }
      
      // Pre-select the apps that were previously confirmed
      const currentSelection = Object.fromEntries(
        SOCIAL_APPS.map(app => [app.key, confirmedApps.includes(app.key)])
      );
      setPreSelected(currentSelection);
      setIsSelectionMode(true);
      setIsEditMode(true);
    } catch (error) {
      console.error('Error in handleEditSelection:', error);
      Alert.alert('Error', 'Failed to load previous selection. Please try again.');
    }
  };

  const handlePreSelectToggle = (key: string) => {
    setPreSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmSelectionWithApple = async () => {
    // This is the new selection from the UI toggles
    const newSelection = Object.keys(preSelected).filter(
      (key) => preSelected[key] && key !== "porn"
    );

    // This is the previously saved selection
    const previouslyConfirmed = confirmedApps.filter((key) => key !== "porn");

    // Calculate the differences
    const addedApps = newSelection.filter((key) => !previouslyConfirmed.includes(key));
    const removedApps = previouslyConfirmed.filter((key) => !newSelection.includes(key));
    
    const getName = (key: string) => SOCIAL_APPS.find((a) => a.key === key)?.name || key;
    const addedAppNames = addedApps.map(getName);
    const removedAppNames = removedApps.map(getName);

    // If there are no changes, do nothing.
    if (addedApps.length === 0 && removedApps.length === 0) {
      // We still need to open the picker in case they want to add/remove something manually
      // but the pre-selection prompt isn't needed. Let's just open it.
      proceedWithApplePicker(newSelection);
    } else {
      setModalData({
        visible: true,
        addedApps: addedAppNames,
        removedApps: removedAppNames,
        selectionToConfirm: newSelection,
      });
    }
  };

  const handleModalConfirm = () => {
    // Capture the selection before any state changes
    const selectionToApply = [...modalData.selectionToConfirm]; // Create a copy of the array
    
    // Close the modal
    setModalData(prev => ({ ...prev, visible: false }));
    
    // Use a longer delay to ensure modal is fully gone
    setTimeout(() => {
      // Double-check the selection exists and has items
      if (selectionToApply && selectionToApply.length >= 0) {
        proceedWithApplePicker(selectionToApply);
      } else {
        console.error("No selection to apply");
        Alert.alert("Error", "No apps selected. Please try again.");
      }
    }, 600); // Increased delay to 600ms
  };

  const proceedWithApplePicker = async (selectedApps: string[]) => {
    if (Platform.OS !== "ios") return;
    try {
      const { selection } = await ScreenTimeManager.displayFamilyActivityPicker({
        headerText: "Choose Apps to Block",
      });

      if (selection) {
        await AsyncStorage.setItem(SELECTION_STORAGE_KEY, selection);
        await AsyncStorage.setItem("UNBOUND_CONFIRMED_APPS", JSON.stringify(selectedApps));
        setConfirmedApps(selectedApps);
        setBlocked(preSelected); // Sync the main toggle state
        setIsBlockingEnabled(true);
        setIsSelectionMode(false);
        setIsEditMode(false); // Enter locked state
        Alert.alert("Setup Complete", "You can now block apps from the Defend screen.");
      } else {
        Alert.alert("Setup Incomplete", "You didn't select any apps. Please try again to complete the setup.");
      }
    } catch (error) {
      console.error("Error with Apple Picker:", error)
      Alert.alert("Error", "Could not complete confirmation. Please try again.");
    }
  };

  return (
    <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg}>
      <ScreenContainer style={{ backgroundColor: 'transparent', paddingHorizontal: 0, paddingTop: 0 }}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>Start Your Block</Text>

          <View style={{ marginBottom: SPACING.sm }}>
            <View style={styles.stepPillHeader}>
              <View style={styles.pillNumber}>
                <Text style={styles.pillNumberText} numberOfLines={1}>1</Text>
              </View>
              <Text style={styles.pillTitle} numberOfLines={1}>Toggle to block or unblock</Text>
            </View>
          </View>

          {isSelectionMode ? (
            <>
              <View style={styles.sectionBox}>
                <Text style={styles.infoText} numberOfLines={4}>
                  Select the apps and websites you want Unbound to be able to block. In the next step, Apple will require you to confirm your choices.
                </Text>
              </View>
              {SOCIAL_APPS.filter((app) => app.key !== "porn").map((app) => (
                <View key={app.key} style={[styles.appRow, preSelected[app.key] && styles.appRowActive]}>
                  <Image source={APP_ICONS[app.key as keyof typeof APP_ICONS]} style={styles.appIcon} />
                  <View style={styles.appTextContainer}>
                    <Text style={[styles.appName, preSelected[app.key] && styles.appNameActive]} numberOfLines={1}>{app.name}</Text>
                  </View>
                  <Switch
                    value={preSelected[app.key]}
                    onValueChange={() => handlePreSelectToggle(app.key)}
                    trackColor={{ false: COLORS.background, true: COLORS.success }}
                    thumbColor={COLORS.tabBarActive}
                    style={styles.switch}
                  />
                </View>
              ))}
              <TouchableOpacity style={[styles.actionButton, { marginTop: SPACING.md }]} onPress={handleConfirmSelectionWithApple}>
                <Text style={styles.actionButtonText} numberOfLines={1}>Confirm Selection with Apple</Text>
              </TouchableOpacity>
              <Text style={{ color: COLORS.textSecondary, marginTop: 8, textAlign: 'center', fontSize: 14 }} numberOfLines={3}>
                Apple requires you to confirm your choices in the next step. Please select the same apps in the Apple popup.
              </Text>
            </>
          ) :
          (!isBlockingEnabled && Platform.OS === 'ios') ? (
            <View style={styles.sectionBox}>
              <Text style={styles.infoText} numberOfLines={3}>
                To block apps and websites, you must first grant Unbound access to Apple's Screen Time API.
              </Text>
              <TouchableOpacity style={[styles.actionButton, {marginTop: SPACING.md}]} onPress={handleEnableBlocking}>
                <Text style={styles.actionButtonText} numberOfLines={1}>Enable App Blocking</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.sectionBox}>
                <Text style={styles.infoText} numberOfLines={4}>
                  This will block the actual app AND the website on your browser. You will be unable to uninstall Unbound
                  while the block is active. No workarounds, no funny business.
                </Text>
              </View>
              
              {isBlockingEnabled && !isSelectionMode && (
                <TouchableOpacity onPress={handleEditSelection} style={styles.changeSelectionButton}>
                  <Text style={styles.actionButtonText} numberOfLines={1}>Change App Selection</Text>
                </TouchableOpacity>
              )}

              {SOCIAL_APPS.filter((app) => app.key !== "porn").map((app) => (
                <View key={app.key} style={[styles.appRow, blocked[app.key] && styles.appRowActive]}>
                  <Image source={APP_ICONS[app.key as keyof typeof APP_ICONS]} style={styles.appIcon} />
                  <View style={styles.appTextContainer}>
                    <Text style={[styles.appName, blocked[app.key] && styles.appNameActive]} numberOfLines={1}>{app.name}</Text>
                    {"description" in app && app.description && (
                      <Text style={[styles.appDescription, blocked[app.key] && styles.appDescriptionActive]} numberOfLines={2}>
                        {app.description}
                      </Text>
                    )}
                  </View>
                  <Switch
                    value={blocked[app.key]}
                    onValueChange={() => toggleBlock(app.key)}
                    disabled={!isEditMode}
                    trackColor={{ false: COLORS.background, true: COLORS.success }}
                    thumbColor={COLORS.tabBarActive}
                    style={styles.switch}
                  />
                </View>
              ))}
              
              <View style={[styles.appRow, blockPorn && styles.appRowActive, styles.pornRow]}>
                <Image source={APP_ICONS.porn} style={styles.appIcon} />
                <View style={styles.appTextContainer}>
                  <Text style={[styles.appName, blockPorn && styles.appNameActive]} numberOfLines={1}>Porn</Text>
                  <TouchableOpacity onPress={() => setShowPornInfo((val) => !val)}>
                    <Text style={[styles.appDescription, blockPorn && styles.appDescriptionActive]} numberOfLines={2}>
                      This enables comprehensive adult content filtering. NoFap engaged.
                    </Text>
                  </TouchableOpacity>
                </View>
                <Switch
                  value={blockPorn}
                  onValueChange={handleTogglePorn}
                  disabled={false}
                  trackColor={{ false: COLORS.background, true: COLORS.success }}
                  thumbColor={COLORS.tabBarActive}
                  style={styles.switch}
                />
              </View>
            </>
          )}
          
          <View style={{ marginBottom: SPACING.sm, marginTop: SPACING.md }}>
            <View style={styles.stepPillHeader}>
              <View style={styles.pillNumber}>
                <Text style={styles.pillNumberText} numberOfLines={1}>2</Text>
              </View>
              <Text style={styles.pillTitle} numberOfLines={1}>Set Your Schedule</Text>
            </View>
          </View>
          <View style={styles.sectionBox}>
            <View style={styles.scheduleBox}>
              <View style={styles.iconCircle}>
                <Image source={require("../../assets/images/onboarding/compass.png")} style={styles.iconImage} />
              </View>
              <View style={styles.scheduleTextContainer}>
                <Text style={styles.scheduleName} numberOfLines={2}>Set up your blocking schedule to automate your focus time</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.actionButton, (!isBlockingEnabled && Platform.OS === 'ios') && styles.disabledButton]} 
              onPress={() => setShowScheduleModal(true)}
              disabled={!isBlockingEnabled && Platform.OS === 'ios'}
            >
              <Text style={styles.actionButtonText} numberOfLines={1}>Set Schedule</Text>
            </TouchableOpacity>
            {schedule.days.length > 0 && (
              <View style={styles.schedulePreview}>
                <View style={styles.schedulePreviewIcon}>
                  <Image source={APP_ICONS["clock-circle"]} style={styles.schedulePreviewIconImage} />
                </View>
                <Text style={styles.schedulePreviewText} numberOfLines={2}>
                  Current schedule: {schedule.days.length === 7 ? "Every day" : schedule.days.join(", ")} | {schedule.start_time.replace(":00", "")} - {schedule.end_time.replace(":00", "")}
                </Text>
              </View>
            )}
          </View>

          <View style={{ marginBottom: SPACING.sm }}>
            <View style={styles.stepPillHeader}>
              <View style={styles.pillNumber}>
                <Text style={styles.pillNumberText} numberOfLines={1}>3</Text>
              </View>
              <Text style={styles.pillTitle} numberOfLines={1}>Start Your Block</Text>
            </View>
          </View>
          <View style={styles.sectionBox}>
            <View style={styles.scheduleBox}>
              <View style={styles.iconCircle}>
                <Image source={require("../../assets/images/onboarding/shield.png")} style={styles.iconImage} />
              </View>
              <View style={styles.scheduleTextContainer}>
                <Text style={styles.scheduleName} numberOfLines={1}>Defend Your Time</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.actionButton, (!isBlockingEnabled && Platform.OS === 'ios') && styles.disabledButton]} 
              onPress={() => setShowModal(true)}
              disabled={!isBlockingEnabled && Platform.OS === 'ios'}
            >
              <Text style={styles.actionButtonText} numberOfLines={1}>Start Block</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {showModal && <DefendModal onClose={() => setShowModal(false)} schedule={schedule} />}
        <PornBlockModal visible={showPornModal} onClose={() => setShowPornModal(false)} variant={pornModalVariant} />
        <ScheduleModal 
          visible={showScheduleModal} 
          onClose={() => setShowScheduleModal(false)} 
          onScheduleSaved={handleScheduleSaved}
        />
        <ConfirmBattlePlanModal
          visible={modalData.visible}
          onClose={() => setModalData(prev => ({ ...prev, visible: false }))}
          onConfirm={handleModalConfirm}
          addedApps={modalData.addedApps}
          removedApps={modalData.removedApps}
        />
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.huge,
  },
  title: {
    fontSize: 32,
    fontFamily: "Vollkorn-Bold",
    color: COLORS.textPrimary,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },
  stepPillHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F9E7B0",
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 2.5,
    borderColor: "#564110",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  pillNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#564110",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  pillNumberText: {
    color: "#F9E7B0",
    fontSize: 18,
    fontFamily: "Vollkorn-Bold",
  },
  pillTitle: {
    fontSize: 22,
    fontFamily: "Vollkorn-Bold",
    color: COLORS.textPrimary,
  },
  changeSelectionButton: {
    backgroundColor: "#3D7A4C",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: SPACING.sm,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  sectionBox: {
    backgroundColor: "#F9E7B0",
    borderRadius: SPACING.md,
    borderWidth: 1.5,
    borderColor: "#E6D3A7",
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    fontFamily: "Vollkorn-Regular",
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  appRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.textPrimary,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: 'rgba(249, 231, 176, 0.5)'
  },
  appRowActive: {
    backgroundColor: "rgba(70, 52, 3, 0.57)",
    borderColor: "rgba(70, 52, 3, 0.8)",
  },
  appIcon: {
    width: 32,
    height: 32,
    marginRight: SPACING.sm,
  },
  appTextContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  appName: {
    fontSize: 18,
    fontFamily: "Vollkorn-Bold",
    color: COLORS.textPrimary,
  },
  appNameActive: {
    color: "#F1D593",
  },
  appDescription: {
    fontSize: 14,
    fontFamily: "Vollkorn-Regular",
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  appDescriptionActive: {
    color: "#F1D593",
    opacity: 0.8,
  },
  appUrl: {
    fontSize: 14,
    fontFamily: "Vollkorn-Regular",
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  appUrlActive: {
    color: "#F1D593",
    opacity: 0.8,
  },
  switch: {
    transform: [{ scale: 1.1 }],
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: SPACING.sm,
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 45,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#564110",
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    fontSize: 16,
    fontFamily: "Vollkorn-Regular",
    color: "#564110",
  },
  addButton: {
    height: 45,
    paddingHorizontal: SPACING.xl,
    backgroundColor: "#3D7A4C",
    borderRadius: SPACING.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  scheduleBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  scheduleTextContainer: {
    flex: 1,
  },
  scheduleName: {
    fontSize: 20,
    fontFamily: "Vollkorn-Bold",
    color: COLORS.textPrimary,
    lineHeight: 26,
  },
  actionButton: {
    backgroundColor: "#3D7A4C",
    borderRadius: SPACING.sm,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  actionButtonText: {
    color: "#F9E7B0",
    fontSize: 18,
    fontFamily: "Vollkorn-Bold",
  },
  addCustomHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#D6C08D",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  iconImage: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  addCustomTitle: {
    fontSize: 22,
    fontFamily: "Vollkorn-Bold",
    color: COLORS.textPrimary,
  },
  addCustomSubtitle: {
    fontSize: 12,
    fontFamily: "Vollkorn-SemiBold",
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  pornRow: {
    borderWidth: 4,
    borderColor: 'rgba(139,0,0,0.5)',
  },
  schedulePreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9E7B0",
    borderRadius: 12,
    padding: SPACING.sm,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: "#E6D3A7",
  },
  schedulePreviewIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D6C08D",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  schedulePreviewIconImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  schedulePreviewText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Vollkorn-SemiBold",
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  disabledButton: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.5,
  },
});
