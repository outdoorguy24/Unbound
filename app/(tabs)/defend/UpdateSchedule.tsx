import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Switch,
  Platform
} from "react-native";
import { height, scale, scaleVertical } from "@/constants/Scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width } = Dimensions.get("window"); 

const UpdateScheduleScreen = () => {
  const insets = useSafeAreaInsets();

  const [time, setTime] = useState({ from: "10:15", to: "17:00" });

  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState<"from" | "to" | null>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const parseTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const d = new Date();
    d.setHours(h);
    d.setMinutes(m);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  };

  const fmt = (d: Date) => {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  const openPicker = (type: "from" | "to") => {
    const current = type === "from" ? time.from : time.to;
    setTempDate(parseTime(current));
    setPickerType(type);
    setShowPicker(true);
  };

  const confirmPicker = () => {
    if (!pickerType) return;
    const next = fmt(tempDate);
    setTime((t) => ({ ...t, [pickerType]: next }));
    setShowPicker(false);
  };

  const QuietHoursCard = () => {
    // M T W T F S S (default select M, T)
    const [selected, setSelected] = useState<{ [k: number]: boolean }>({ 0: true, 1: true });

    const days = ["M", "T", "W", "T", "F", "S", "S"];

    const toggle = (i: number) =>
      setSelected((s) => ({ ...s, [i]: !s[i] }));

    return (
      <View
        style={{
          borderRadius: 4,
          backgroundColor: "rgba(44, 23, 7, 0.6)",
          paddingHorizontal: scale(16),
          paddingTop: scale(16),
        }}
      >
        {/* From row */}
        <TouchableOpacity onPress={() => openPicker("from")}>
          <View style={{ 
            flexDirection: "row", 
            alignItems: "center", 
            marginBottom: scale(16),
          }}>
            <Text style={{ 
              color: "#fff", 
              fontSize: scale(16), 
              fontFamily: 'ZillaSlab-Medium' 
            }}>
                From
            </Text>
            <View style={{ flex: 1 }} />
            <Text style={{ 
              color: "rgba(255,255,255,0.6)", 
              fontSize: scale(16), 
              fontFamily: 'ZillaSlab-Medium' 
            }}>
              {time.from}
            </Text>
          </View>
        </TouchableOpacity>
        {/* Divider */}
        <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.10)", marginBottom: 12 }} />

        {/* To row */}
        <TouchableOpacity onPress={() => openPicker("to")}>
          <View style={{ 
            flexDirection: "row", 
            alignItems: "center", 
            marginBottom: scale(16),
          }}>
            <Text style={{ 
              color: "#fff", 
              fontSize: scale(16), 
              fontFamily: 'ZillaSlab-Medium' 
            }}>
              To
            </Text>
            <View style={{ flex: 1 }} />
            <Text style={{ 
              color: "rgba(255,255,255,0.6)", 
              fontSize: scale(16), 
              fontFamily: 'ZillaSlab-Medium' 
            }}>
              {time.to}
            </Text>
          </View>
        </TouchableOpacity>
        {/* Divider */}
        <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.10)", marginBottom: 16 }} />

        {/* Days row */}
        <View style={{ 
          flexDirection: "row", 
          justifyContent: "space-between",
          marginBottom: scale(16)
        }}>
          {days.map((d, i) => {
            const active = !!selected[i];
            return (
              <TouchableOpacity
                key={`${d}-${i}`}
                onPress={() => toggle(i)}
                activeOpacity={0.8}
                style={{
                  width: scale(38),
                  height: scale(38),
                  borderRadius: scale(40),
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active ? "#FFCA91" : "rgba(255,255,255,0.12)",
                }}
              >
                <Text
                  style={{
                    fontSize: scale(16), 
                    fontFamily: 'ZillaSlab-Medium',
                    color: active ? "#000" : "#fff",
                  }}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const [sessions, setSessions] = useState([]);

  return (
    <View style={styles.safe}>
      <Image
        source={require("../../../assets/new-images/onboarding-screen-4.png")}
        style={styles.image}
      />
      <Image
        source={require("../../../assets/new-images/onboarding-overlay-full.png")}
        style={styles.overlayImage}
      />

      <View style={[styles.mainContainer, { marginTop: insets.top + scaleVertical(16) }]}>
        <TouchableOpacity
          style={styles.buttonBack}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Image source={require("../../../assets/new-images/icon-back.png")} 
            // resizeMode="center" 
            style={{
              height: scale(20),
              width: scale(20),
            }}
          />
        </TouchableOpacity>
  
        <Text style={styles.slogan}>Manage Your focus Session</Text>
        
        <ScrollView style={{
          marginBottom: scale(16),
          marginTop: scale(32),
        }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <QuietHoursCard />

          {sessions?.length && <View
            style={{
              marginTop: scale(24),
              borderRadius: 4,
              backgroundColor: "rgba(44, 23, 7, 0.6)",
              paddingHorizontal: scale(16),
              paddingTop: scale(16),
            }}
          >
            {/* Title */}
            <Text
              style={{
                color: "#fff",
                fontSize: scale(18),
                fontFamily: "ZillaSlab-SemiBold",
                marginBottom: scale(12),
              }}
            >
              Updated sessions
            </Text>

            {/* Header divider */}
            <View
              style={{
                height: 1,
                backgroundColor: "rgba(255,255,255,0.10)",
                marginBottom: scale(6),
              }}
            />

            {/* Items */}
            {sessions.map((s, idx) => (
              <TouchableOpacity
                key={s.id}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: scale(14),
                }}
              >
                <Text
                  style={{
                    color: "#FFCA91",
                    fontSize: scale(16),
                    fontFamily: "ZillaSlab-SemiBold",
                    flex: 1,
                  }}
                >
                  {s.label}
                </Text>

                <Image source={require("../../../assets/new-images/right-arrow.png")} style={{ 
                  width: scale(24), 
                  height: scale(24) 
                }} />
              </TouchableOpacity>
            ))}
          </View>}
        </ScrollView>

        <View style={{
        }}>
          <TouchableOpacity
            style={[
              styles.primaryBtn,
            ]}
            onPress={() => {
              setSessions([
                { id: "1", label: "Mon–Tue, 09:00 – 17:00" },
                { id: "2", label: "Mon–Tue, 09:00 – 17:00" },
              ])
            }}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryText}>{"Update session"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[{
              marginTop: scale(16),
              flexDirection: "row",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.2)",
              marginBottom: scaleVertical(16)
            }]}
            activeOpacity={0.8}
          >
            <View style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}>
              <View style={{
                flex: 1,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Text style={[{
                  color: "#FFF",
                  fontSize: scale(18),
                  fontFamily: "ZillaSlab-SemiBold",
                  letterSpacing: 0,
                  paddingVertical: scale(18),
                }]}>
                  {"Cancel session"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {showPicker && (
        <>
          {/* Backdrop */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowPicker(false)}
            style={{
              position: "absolute",
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.45)",
            }}
          />

          {/* Sheet */}
          <View
            style={{
              position: "absolute",
              left: 0, 
              right: 0, 
              bottom: 0,
              backgroundColor: "#1C1C1E",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: scale(20),
              paddingTop: scale(16),
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
                fontSize: scale(20),
                fontFamily: "SF-Pro-Display-Semibold",
                marginVertical: scale(20),
              }}
            >
              {pickerType === "from" ? "From" : "To"}
            </Text>

            {/* Native spinner (iOS style; Android supports spinner on newer versions) */}
            <View style={{ alignItems: "center", marginBottom: scale(18) }}>
              <DateTimePicker
                value={tempDate}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "spinner"}
                onChange={(_, d) => {
                  if (d) setTempDate(d);
                }}
                textColor="#fff"         
                themeVariant="dark"
                minuteInterval={1}
                is24Hour={true}
                style={{ width: "100%" }}
              />
            </View>

            <TouchableOpacity
              onPress={confirmPicker}
              activeOpacity={0.9}
              style={{
                backgroundColor: "#2563EB",
                borderRadius: 12,
                paddingVertical: scale(12),
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: scale(16), fontFamily: "SF-Pro-Display-Medium" }}>
                Confirm
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowPicker(false)} activeOpacity={0.8}>
              <Text style={{ textAlign: "center", color: "#007AFF", fontSize: scale(17), fontFamily: "SF-Pro-Display-Regular", marginVertical: scale(16) }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#000" 
  },
  image: { 
    position: "absolute", 
    width: "100%", 
    height: width * 0.939
  },
  overlayImage: { 
    position: "absolute",
    width: "100%", 
    height: "120%" 
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: scale(24),
  },
  slogan: {
    marginTop: scale(24),
    color: "#FFF",
    fontSize: scale(32),
    fontFamily: "Cinzel-Regular",
  },
  primaryBtn: {
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(20),
    width: '100%',
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
  buttonBack: {
    backgroundColor: "#000",
    width: scale(40),
    aspectRatio: 1,
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UpdateScheduleScreen;