import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SOCIAL_APPS = [
  { key: 'youtube', name: 'YouTube', url: 'youtube.com', icon: <Feather name="youtube" size={24} color="#FF0000" /> },
  { key: 'reddit', name: 'Reddit', url: 'reddit.com', icon: <Feather name="reddit" size={24} color="#FF5700" /> },
  { key: 'tiktok', name: 'TikTok', url: 'tiktok.com', icon: <FontAwesome5 name="music" size={24} color="#000" /> },
  { key: 'instagram', name: 'Instagram', url: 'instagram.com', icon: <Feather name="instagram" size={24} color="#C13584" /> },
  { key: 'facebook', name: 'Facebook', url: 'facebook.com', icon: <Feather name="facebook" size={24} color="#1877F3" /> },
  { key: 'twitter', name: 'Twitter', url: 'twitter.com', icon: <Feather name="twitter" size={24} color="#1DA1F2" /> },
  { key: 'discord', name: 'Discord', url: 'discord.com', icon: <MaterialCommunityIcons name="discord" size={24} color="#7289DA" /> },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function isValidDomain(domain: string) {
  return !!domain && domain.includes('.') && !domain.includes(' ') && domain.length > 2;
}

export default function DefendScreen() {
  const router = useRouter();
  // Block state
  const [blocked, setBlocked] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(SOCIAL_APPS.map(app => [app.key, true]))
  );
  // Custom sites
  const [customSites, setCustomSites] = useState<{ key: string; name: string; url: string }[]>([]);
  const [customInput, setCustomInput] = useState('');
  // Porn block
  const [blockPorn, setBlockPorn] = useState(false);
  const [showPornInfo, setShowPornInfo] = useState(false);
  // Schedule
  const [schedule, setSchedule] = useState<{ days: string[]; start: string; end: string }>({
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    start: '08:00',
    end: '22:00',
  });
  // New schedule section states
  const [allDayEveryDay, setAllDayEveryDay] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Handle toggling block state
  const toggleBlock = (key: string) => {
    setBlocked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle adding custom site
  const handleAddCustomSite = () => {
    const domain = customInput.trim().toLowerCase();
    if (!isValidDomain(domain)) {
      Alert.alert('Invalid domain', 'Please enter a valid website domain (e.g., espn.com)');
      return;
    }
    if (
      customSites.some(site => site.url === domain) ||
      SOCIAL_APPS.some(app => app.url === domain)
    ) {
      Alert.alert('Duplicate', 'This site is already in your block list.');
      return;
    }
    setCustomSites(prev => [
      ...prev,
      { key: domain, name: domain, url: domain },
    ]);
    setBlocked(prev => ({ ...prev, [domain]: true }));
    setCustomInput('');
  };

  // Handle toggling porn block
  const handleTogglePorn = () => {
    setBlockPorn(val => !val);
  };

  // Handle schedule
  const handleDayToggle = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };
  const handleTimeChange = (field: 'start' | 'end', value: string) => {
    setSchedule(prev => ({ ...prev, [field]: value }));
  };

  // Schedule summary
  const scheduleSummary = `${schedule.days.join(', ')} | ${schedule.start}–${schedule.end}`;

  // New schedule section helpers
  function toggleAllDayEveryDay(val: boolean) {
    setAllDayEveryDay(val);
    if (val) {
      setSchedule({ days: [...DAYS], start: '12:00 AM', end: '11:59 PM' });
    }
  }
  function formatTime(t: string) {
    return t;
  }
  function parseTime(t: string) {
    // t: '08:00 AM' => Date
    const [h, m, ampm] = t.match(/(\d{1,2}):(\d{2}) ?(AM|PM)/i) || [null, '08', '00', 'AM'];
    let hour = parseInt(h, 10);
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    return new Date(2000, 0, 1, hour, parseInt(m, 10));
  }
  function toTimeString(date: Date) {
    let h = date.getHours();
    const m = date.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  }
  function getScheduleSummary() {
    if (allDayEveryDay) return 'Blocking all day, every day';
    const start = schedule.start;
    const end = schedule.end;
    const days = schedule.days.length === 7 ? 'Every day' : schedule.days.join(', ');
    // Calculate duration
    const [sh, sm, sampm] = start.match(/(\d{1,2}):(\d{2}) ?(AM|PM)/i) || [null, '08', '00', 'AM'];
    const [eh, em, eampm] = end.match(/(\d{1,2}):(\d{2}) ?(AM|PM)/i) || [null, '08', '00', 'AM'];
    let sHour = parseInt(sh, 10);
    let eHour = parseInt(eh, 10);
    if (sampm === 'PM' && sHour < 12) sHour += 12;
    if (sampm === 'AM' && sHour === 12) sHour = 0;
    if (eampm === 'PM' && eHour < 12) eHour += 12;
    if (eampm === 'AM' && eHour === 12) eHour = 0;
    let duration = (eHour * 60 + parseInt(em, 10)) - (sHour * 60 + parseInt(sm, 10));
    if (duration < 0) duration += 24 * 60;
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    return `Blocking ${days} from ${start} to ${end} (${hours}h ${mins}m)`;
  }
  function getSliderStyle() {
    if (allDayEveryDay) return { left: 0, width: '100%' };
    // Map start/end to 0-100% (0=midnight, 100=end of day)
    const toMinutes = (t: string) => {
      const [h, m, ampm] = t.match(/(\d{1,2}):(\d{2}) ?(AM|PM)/i) || [null, '08', '00', 'AM'];
      let hour = parseInt(h, 10);
      if (ampm === 'PM' && hour < 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
      return hour * 60 + parseInt(m, 10);
    };
    const startM = toMinutes(schedule.start);
    const endM = toMinutes(schedule.end);
    let left = (startM / 1440) * 100;
    let width = ((endM - startM + 1440) % 1440) / 1440 * 100;
    if (width === 0) width = 100;
    return { left: `${left}%`, width: `${width}%` };
  }
  function handleSaveSchedule() {
    // Placeholder: could persist or show a toast
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <Text style={styles.brand}>unbound</Text>
        <Text style={styles.motivation}>
          It's time to put the phone down and pick that hobby back up
        </Text>
        <Text style={styles.downArrow}>▼</Text>

        {/* Step 1: Block toggles */}
        <View style={styles.stepRow}>
          <View style={styles.stepCircle}><Text style={styles.stepNum}>1</Text></View>
          <View>
            <Text style={styles.stepTitle}>Toggle to block or unblock</Text>
            <Text style={styles.stepSubtitle}>
              (this will block the app AND the mobile website on your browser so there's no funny business)
            </Text>
          </View>
        </View>

        {/* Block Porn Toggle */}
        <View style={styles.pornBlockRow}>
          <MaterialCommunityIcons name="shield-check" size={28} color="#7A5A2F" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.pornBlockTitle}>Block Porn</Text>
            <Text style={styles.pornBlockSubtitle}>Enable comprehensive adult content filtering</Text>
          </View>
          <Switch
            value={blockPorn}
            onValueChange={handleTogglePorn}
            thumbColor={blockPorn ? "#7A5A2F" : "#ccc"}
            trackColor={{ true: "#E2C89A", false: "#eee" }}
          />
          <TouchableOpacity onPress={() => setShowPornInfo(true)} style={{ marginLeft: 8 }}>
            <Feather name="info" size={20} color="#7A5A2F" />
          </TouchableOpacity>
        </View>
        {/* Porn Info Modal */}
        <Modal visible={showPornInfo} transparent animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setShowPornInfo(false)}>
            <View style={styles.infoModal}>
              <Text style={styles.infoTitle}>Block Porn</Text>
              <Text style={styles.infoText}>
                This will enable comprehensive adult content filtering across apps and browsers.
              </Text>
              <TouchableOpacity style={styles.infoClose} onPress={() => setShowPornInfo(false)}>
                <Text style={styles.infoCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        {/* App/Site List */}
        <View style={styles.blockList}>
          {[...SOCIAL_APPS, ...customSites].map(app => (
            <View key={app.key} style={styles.blockRow}>
              {app.icon || <Feather name="globe" size={24} color="#7A5A2F" />}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.blockName}>{app.name}</Text>
                <Text style={styles.blockUrl}>{app.url}</Text>
              </View>
              <Switch
                value={blocked[app.key]}
                onValueChange={() => toggleBlock(app.key)}
                thumbColor={blocked[app.key] ? "#7A5A2F" : "#ccc"}
                trackColor={{ true: "#E2C89A", false: "#eee" }}
              />
            </View>
          ))}
        </View>

        {/* Add Custom Website */}
        <View style={styles.addCustomBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Feather name="plus-circle" size={20} color="#7A5A2F" />
            <Text style={styles.addCustomTitle}>Add Custom Website</Text>
          </View>
          <Text style={styles.addCustomSubtitle}>Enter any website you want to block</Text>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <TextInput
              style={styles.customInput}
              placeholder="ex: espn.com"
              value={customInput}
              onChangeText={setCustomInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddCustomSite}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Step 2: Set Schedule */}
        <View style={styles.stepRow}>
          <View style={styles.stepCircle}><Text style={styles.stepNum}>2</Text></View>
          <View>
            <Text style={styles.stepTitle}>Set Your Schedule</Text>
            <Text style={styles.stepSubtitle}>
              Set up your blocking schedule to automate your focus time
            </Text>
          </View>
        </View>
        {/* Schedule Card */}
        <View style={styles.scheduleCard}>
          <View style={styles.allDayRow}>
            <Text style={styles.allDayLabel}>All day, every day</Text>
            <Switch
              value={allDayEveryDay}
              onValueChange={toggleAllDayEveryDay}
            />
          </View>
          {!allDayEveryDay && (
            <>
              {/* Time Pickers */}
              <View style={styles.timePickerRow}>
                <Text style={styles.timeLabel}>Start:</Text>
                <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.timePickerBtn}>
                  <Text style={styles.timePickerText}>{formatTime(schedule.start)}</Text>
                </TouchableOpacity>
                <Text style={styles.timeLabel}>End:</Text>
                <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.timePickerBtn}>
                  <Text style={styles.timePickerText}>{formatTime(schedule.end)}</Text>
                </TouchableOpacity>
              </View>
              {showStartPicker && (
                <DateTimePicker
                  value={parseTime(schedule.start)}
                  mode="time"
                  is24Hour={false}
                  display="spinner"
                  onChange={(_, date) => {
                    setShowStartPicker(false);
                    if (date) setSchedule(s => ({ ...s, start: toTimeString(date) }));
                  }}
                />
              )}
              {showEndPicker && (
                <DateTimePicker
                  value={parseTime(schedule.end)}
                  mode="time"
                  is24Hour={false}
                  display="spinner"
                  onChange={(_, date) => {
                    setShowEndPicker(false);
                    if (date) setSchedule(s => ({ ...s, end: toTimeString(date) }));
                  }}
                />
              )}
              {/* Day Picker */}
              <View style={styles.daysRow}>
                {DAYS.map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      schedule.days.includes(day) && styles.dayButtonActive,
                    ]}
                    onPress={() => handleDayToggle(day)}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      schedule.days.includes(day) && styles.dayButtonTextActive,
                    ]}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          {/* Summary and Slider */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>{getScheduleSummary()}</Text>
          </View>
          <View style={styles.sliderRow}>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderActive, getSliderStyle()]} />
            </View>
          </View>
        </View>

        {/* Step 3: Start Blocking */}
        <View style={styles.stepRow}>
          <View style={styles.stepCircle}><Text style={styles.stepNum}>3</Text></View>
          <Text style={styles.stepTitle}>Start Blocking</Text>
        </View>
        <TouchableOpacity
          style={styles.startBlockBtn}
          onPress={() => router.push('/(modals)/celebrate-block')}
        >
          <Text style={styles.startBlockText}>Start Block</Text>
          <MaterialCommunityIcons name="shield" size={22} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 32 },
  brand: { color: '#A05A1A', fontWeight: 'bold', fontSize: 20, marginTop: 16, marginBottom: 8, textTransform: 'lowercase' },
  motivation: { fontSize: 26, fontWeight: 'bold', color: '#2C1A05', textAlign: 'center', marginBottom: 8 },
  downArrow: { fontSize: 32, color: '#A05A1A', textAlign: 'center', marginBottom: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 8, paddingHorizontal: 8 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#A05A1A', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stepNum: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  stepTitle: { fontWeight: 'bold', fontSize: 18, color: '#2C1A05' },
  stepSubtitle: { color: '#7A5A2F', fontSize: 13, marginTop: 2, marginBottom: 2 },
  pornBlockRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F2E0', borderRadius: 12, padding: 14, marginBottom: 12, marginTop: 8 },
  pornBlockTitle: { fontWeight: 'bold', fontSize: 16, color: '#2C1A05' },
  pornBlockSubtitle: { color: '#7A5A2F', fontSize: 13 },
  blockList: { marginBottom: 16 },
  blockRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7E0A3', borderRadius: 12, padding: 14, marginBottom: 10 },
  blockName: { fontSize: 16, color: '#2C1A05', fontWeight: 'bold' },
  blockUrl: { fontSize: 13, color: '#7A5A2F' },
  addCustomBox: { backgroundColor: '#F7F2E0', borderRadius: 12, padding: 14, marginBottom: 16 },
  addCustomTitle: { fontWeight: 'bold', fontSize: 16, color: '#2C1A05', marginLeft: 8 },
  addCustomSubtitle: { color: '#7A5A2F', fontSize: 13, marginBottom: 4 },
  customInput: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 16, color: '#2C1A05', borderWidth: 1, borderColor: '#E2C89A' },
  addButton: { backgroundColor: '#A05A1A', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 18, marginLeft: 8, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  scheduleCard: { backgroundColor: '#F7F2E0', borderRadius: 16, padding: 18, marginBottom: 24, marginTop: 8 },
  allDayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  allDayLabel: { fontSize: 16, color: '#2C1A05' },
  timePickerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  timePickerBtn: { backgroundColor: '#fff', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, marginHorizontal: 8 },
  timePickerText: { fontSize: 16, color: '#2C1A05', fontWeight: 'bold' },
  summaryRow: { marginTop: 8, marginBottom: 4 },
  summaryText: { color: '#4B3415', fontSize: 15, textAlign: 'center' },
  sliderRow: { marginTop: 8, marginBottom: 4, height: 16, justifyContent: 'center' },
  sliderTrack: { height: 6, backgroundColor: '#E2C89A', borderRadius: 3, width: '100%', position: 'relative' },
  sliderActive: { position: 'absolute', height: 6, backgroundColor: '#A05A1A', borderRadius: 3 },
  startBlockBtn: { backgroundColor: '#A05A1A', borderRadius: 12, paddingVertical: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  startBlockText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  infoModal: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', width: 300 },
  infoTitle: { fontWeight: 'bold', fontSize: 18, color: '#2C1A05', marginBottom: 8 },
  infoText: { color: '#4B3415', fontSize: 15, marginBottom: 16, textAlign: 'center' },
  infoClose: { backgroundColor: '#A05A1A', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24 },
  infoCloseText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, width: '100%' },
  dayButton: { padding: 8, borderRadius: 8, backgroundColor: '#F7E0A3', marginHorizontal: 2 },
  dayButtonActive: { backgroundColor: '#A05A1A' },
  dayButtonText: { color: '#2C1A05', fontWeight: 'bold' },
  dayButtonTextActive: { color: '#fff' },
}); 