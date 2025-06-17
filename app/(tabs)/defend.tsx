import { COLORS, SPACING } from "@/constants/theme";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DefendModal from "../defend-modal";

const APP_ICONS = {
  instagram: require("../../assets/images/instagram.png"),
  facebook: require("../../assets/images/facebook.png"),
  tiktok: require("../../assets/images/tiktok.png"),
  twitter: require("../../assets/images/twitter.png"),
  youtube: require("../../assets/images/youtube.png"),
  discord: require("../../assets/images/discord.png"),
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
  {
    key: "porn",
    name: "Porn",
    url: "",
    description: "This enables comprehensive adult content filtering. NoFap engaged.",
  },
];

// Keep all the time-related functions and constants
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function isValidDomain(domain: string) {
  return !!domain && domain.includes(".") && !domain.includes(" ") && domain.length > 2;
}

export default function DefendScreen() {
  const [showModal, setShowModal] = useState(false);
  const [blocked, setBlocked] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(SOCIAL_APPS.map((app) => [app.key, false]))
  );

  // Keep all the state variables
  const [customSites, setCustomSites] = useState<{ key: string; name: string; url: string }[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [blockPorn, setBlockPorn] = useState(false);
  const [showPornInfo, setShowPornInfo] = useState(false);
  const [schedule, setSchedule] = useState<{ days: string[]; start: string; end: string }>({
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    start: "08:00",
    end: "22:00",
  });
  const [allDayEveryDay, setAllDayEveryDay] = useState(false);

  // Keep all the handler functions
  const toggleBlock = (key: string) => {
    setBlocked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddCustomSite = () => {
    const domain = customInput.trim().toLowerCase();
    if (!isValidDomain(domain)) {
      Alert.alert("Invalid domain", "Please enter a valid website domain (e.g., espn.com)");
      return;
    }
    if (customSites.some((site) => site.url === domain) || SOCIAL_APPS.some((app) => app.url === domain)) {
      Alert.alert("Duplicate", "This site is already in your block list.");
      return;
    }
    setCustomSites((prev) => [...prev, { key: domain, name: domain, url: domain }]);
    setBlocked((prev) => ({ ...prev, [domain]: true }));
    setCustomInput("");
  };

  const handleTogglePorn = () => {
    setBlockPorn((val) => !val);
  };

  const handleDayToggle = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }));
  };

  const handleTimeChange = (field: "start" | "end", value: string) => {
    setSchedule((prev) => ({ ...prev, [field]: value }));
  };

  const scheduleSummary = `${schedule.days.join(", ")} | ${schedule.start}–${schedule.end}`;

  function toggleAllDayEveryDay(val: boolean) {
    setAllDayEveryDay(val);
    if (val) {
      setSchedule({ days: [...DAYS], start: "12:00 AM", end: "11:59 PM" });
    }
  }

  function getScheduleSummary() {
    if (allDayEveryDay) return "Blocking all day, every day";
    const start = schedule.start;
    const end = schedule.end;
    const days = schedule.days.length === 7 ? "Every day" : schedule.days.join(", ");
    // Calculate duration
    const [sh, sm, sampm] = start.match(/(\d{1,2}):(\d{2}) ?(AM|PM)/i) || [null, "08", "00", "AM"];
    const [eh, em, eampm] = end.match(/(\d{1,2}):(\d{2}) ?(AM|PM)/i) || [null, "08", "00", "AM"];
    let sHour = parseInt(sh || "8", 10);
    let eHour = parseInt(eh || "8", 10);
    if (sampm === "PM" && sHour < 12) sHour += 12;
    if (sampm === "AM" && sHour === 12) sHour = 0;
    if (eampm === "PM" && eHour < 12) eHour += 12;
    if (eampm === "AM" && eHour === 12) eHour = 0;
    let duration = eHour * 60 + parseInt(em || "0", 10) - (sHour * 60 + parseInt(sm || "0", 10));
    if (duration < 0) duration += 24 * 60;
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    return `Blocking ${days} from ${start} to ${end} (${hours}h ${mins}m)`;
  }

  function handleSaveSchedule() {
    // Placeholder: could persist or show a toast
  }

  return (
    <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Start Your Block</Text>

        <View style={{ marginBottom: SPACING.sm }}>
          <View style={styles.pillHeader}>
            <View style={styles.pillNumber}>
              <Text style={styles.pillNumberText}>1</Text>
            </View>
            <Text style={styles.pillTitle}>Toggle to block or unblock</Text>
          </View>
        </View>
        <View style={styles.sectionBox}>
          <Text style={styles.infoText}>
            This will block the actual app AND the website on your browser. You will be unable to uninstall Unbound
            while the block is active. No workarounds, no funny business.
          </Text>
        </View>

        {SOCIAL_APPS.filter((app) => app.key !== "porn").map((app) => (
          <View key={app.key} style={[styles.appRow, blocked[app.key] && styles.appRowActive]}>
            <Image source={APP_ICONS[app.key as keyof typeof APP_ICONS]} style={styles.appIcon} />
            <View style={styles.appTextContainer}>
              <Text style={[styles.appName, blocked[app.key] && styles.appNameActive]}>{app.name}</Text>
              {"description" in app && app.description && (
                <Text style={[styles.appDescription, blocked[app.key] && styles.appDescriptionActive]}>
                  {app.description}
                </Text>
              )}
            </View>
            <Switch
              value={blocked[app.key]}
              onValueChange={() => toggleBlock(app.key)}
              trackColor={{ false: COLORS.background, true: COLORS.success }}
              thumbColor={COLORS.tabBarActive}
              style={styles.switch}
            />
          </View>
        ))}

        {customSites.map((site) => (
          <View key={site.key} style={[styles.appRow, blocked[site.key] && styles.appRowActive]}>
            <Image source={APP_ICONS["add-circle"]} style={styles.appIcon} />
            <View style={styles.appTextContainer}>
              <Text style={[styles.appName, blocked[site.key] && styles.appNameActive]}>{site.name}</Text>
              <Text style={[styles.appUrl, blocked[site.key] && styles.appUrlActive]}>{site.url}</Text>
            </View>
            <Switch
              value={blocked[site.key]}
              onValueChange={() => toggleBlock(site.key)}
              trackColor={{ false: COLORS.background, true: COLORS.success }}
              thumbColor={COLORS.tabBarActive}
              style={styles.switch}
            />
          </View>
        ))}

        <View style={[styles.appRow, blockPorn && styles.appRowActive]}>
          <Image source={APP_ICONS.porn} style={styles.appIcon} />
          <View style={styles.appTextContainer}>
            <Text style={[styles.appName, blockPorn && styles.appNameActive]}>Porn</Text>
            <TouchableOpacity onPress={() => setShowPornInfo((val) => !val)}>
              <Text style={[styles.appDescription, blockPorn && styles.appDescriptionActive]}>
                This enables comprehensive adult content filtering. NoFap engaged. {showPornInfo ? "(Hide)" : "(Info)"}
              </Text>
            </TouchableOpacity>
          </View>
          <Switch
            value={blockPorn}
            onValueChange={handleTogglePorn}
            trackColor={{ false: COLORS.background, true: COLORS.success }}
            thumbColor={COLORS.tabBarActive}
            style={styles.switch}
          />
        </View>

        <View style={[styles.sectionBox, { marginTop: SPACING.md }]}>
          <View style={styles.addCustomHeader}>
            <View style={styles.iconCircle}>
              <Image source={APP_ICONS["add-circle"]} style={styles.iconImage} />
            </View>
            <View>
              <Text style={styles.addCustomTitle}>Add Custom Website</Text>
              <Text style={styles.addCustomSubtitle}>Enter any website you want to block</Text>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="ex: espn.com"
              value={customInput}
              onChangeText={setCustomInput}
              placeholderTextColor="#564110"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddCustomSite}>
              <Text style={styles.actionButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginBottom: SPACING.sm }}>
          <View style={styles.pillHeader}>
            <View style={styles.pillNumber}>
              <Text style={styles.pillNumberText}>2</Text>
            </View>
            <Text style={styles.pillTitle}>Set Your Schedule</Text>
          </View>
        </View>
        <View style={styles.sectionBox}>
          <View style={styles.scheduleBox}>
            <View style={styles.iconCircle}>
              <Image source={APP_ICONS["clock-circle"]} style={styles.iconImage} />
            </View>
            <View style={styles.scheduleTextContainer}>
              <Text style={styles.scheduleName}>Set up your blocking schedule to automate your focus time</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Coming soon")}>
            <Text style={styles.actionButtonText}>Set Schedule</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: SPACING.sm }}>
          <View style={styles.pillHeader}>
            <View style={styles.pillNumber}>
              <Text style={styles.pillNumberText}>3</Text>
            </View>
            <Text style={styles.pillTitle}>Start Blocking</Text>
          </View>
        </View>
        <View style={styles.sectionBox}>
          <View style={styles.scheduleBox}>
            <View style={styles.iconCircle}>
              <Image source={APP_ICONS.security} style={styles.iconImage} />
            </View>
            <View style={styles.scheduleTextContainer}>
              <Text style={styles.scheduleName}>Defend Your Time</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowModal(true)}>
            <Text style={styles.actionButtonText}>Start Blocking</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {showModal && <DefendModal onClose={() => setShowModal(false)} />}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
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
  pillHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F9E7B0",
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
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
  infoContainer: {
    backgroundColor: "#F1D593",
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.textPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  numberText: {
    color: "#FFF8F0",
    fontSize: 16,
    fontFamily: "Vollkorn-Bold",
  },
  infoTitle: {
    fontSize: 20,
    fontFamily: "Vollkorn-Bold",
    color: COLORS.textPrimary,
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
    backgroundColor: "#F1D593",
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  appRowActive: {
    backgroundColor: "rgba(70, 52, 3, 0.57)",
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
  sectionContainer: {
    marginTop: SPACING.xl,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    marginRight: SPACING.sm,
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
    fontSize: 16,
    fontFamily: "Vollkorn-SemiBold",
    color: COLORS.textPrimary,
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
  daysRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
    justifyContent: "center",
  },
  dayButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#564110",
    borderRadius: 8,
    marginHorizontal: 2,
    backgroundColor: "#FFF8F0",
  },
  dayButtonActive: {
    backgroundColor: "#3D7A4C",
    borderColor: "#3D7A4C",
  },
  dayButtonText: {
    fontSize: 18,
    fontFamily: "Vollkorn-Bold",
    color: "#564110",
  },
  dayButtonTextActive: {
    color: "#FFF8F0",
  },
  allDayRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
    marginTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#564110",
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: "#FFF8F0",
  },
  checkboxActive: {
    backgroundColor: "#3D7A4C",
    borderColor: "#3D7A4C",
  },
  allDayText: {
    fontSize: 16,
    fontFamily: "Vollkorn-Bold",
    color: "#564110",
  },
  timePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  timePickerBox: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    borderWidth: 3,
    borderColor: "#564110",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  timePickerText: {
    fontSize: 22,
    fontFamily: "Vollkorn-Bold",
    color: "#564110",
  },
  scheduleSummary: {
    fontSize: 16,
    fontFamily: "Vollkorn-Regular",
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
    textAlign: "center",
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
  outlinedBox: {
    borderWidth: 2,
    borderColor: "#564110",
    borderRadius: 24,
    backgroundColor: "transparent",
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  iconCircleLg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D6C08D",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.lg,
  },
  scheduleTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  scheduleTitle: {
    fontSize: 32,
    fontFamily: "Vollkorn-Bold",
    color: COLORS.textPrimary,
    flex: 1,
    flexWrap: "wrap",
  },
});
