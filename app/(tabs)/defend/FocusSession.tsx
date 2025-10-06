import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { scale, scaleVertical } from "@/constants/Scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const { width } = Dimensions.get("window"); 

const FocusSessionScreen = () => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setTimeout(() => {
      router.push('/FocusSessionCompleted')
    }, 3000)
  }, [])
  
  const FocusTimer = ({
    totalHours = 5,       // total duration for the bar
    startAtSeconds = 4 * 60 * 60,   // where to start the timer (0 = from the beginning)
  }) => {
    const totalSeconds = totalHours * 60 * 60;
    const [elapsed, setElapsed] = useState(startAtSeconds);
    const timerRef = useRef<NodeJS.Timer | null>(null);

    useEffect(() => {
      timerRef.current = setInterval(() => {
        setElapsed((s) => (s < totalSeconds ? s + 1 : s));
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, [totalSeconds]);

    const pad = (n: number) => String(n).padStart(2, "0");
    const hrs = Math.floor(elapsed / 3600);
    const mins = Math.floor((elapsed % 3600) / 60);
    const secs = elapsed % 60;

    const progress = Math.min(elapsed / totalSeconds, 1);
    const barHeight = 8;
    const barWidth = width - 32; // 16px side margins

    return (
      <View style={{ 
        marginTop: scale(82)
      }}>
        {/* Timer Card */}
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 6,
            paddingVertical: scale(40),
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: scale(48),
              fontFamily: "ZillaSlab-SemiBold",
              letterSpacing: 1.5,
            }}
          >
            {pad(hrs)}:{pad(mins)}:{pad(secs)}
          </Text>
        </View>

        {/* Progress Bar */}
        <View
          style={{
            width: barWidth,
            height: barHeight,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: barHeight / 2,
            overflow: "hidden",
            alignSelf: "center",
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: barWidth * progress,
              height: "100%",
              backgroundColor: "#FFCA91",
            }}
          />
        </View>

        {/* Labels */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ 
            color: "#fff", 
            fontSize: scale(16), 
            fontFamily: "Geist-Black" 
          }}>
            0 hrs
          </Text>
          <Text style={{ 
            color: "#fff", 
            fontSize: scale(16), 
            fontFamily: "Geist-Black" 
          }}>
            {totalHours} hrs
          </Text>
        </View>
      </View>
    );
  };
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
      <Image
        source={require("../../../assets/new-images/doing-great-bg.png")}
        style={styles.doingGreatImage}
      />

      <View style={[styles.mainContainer, { marginTop: insets.top + scaleVertical(100) }]}>  
        <Text style={styles.slogan}>You’re CRUSHING IT</Text>
        <Text style={styles.description}>{"The distractions are blocked.\nNow get outside."}</Text>
        
        <FocusTimer />
      </View>
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
  doingGreatImage: { 
    position: "absolute",
    width: "100%", 
    height: "100%" 
  },
  overlayImage: { 
    position: "absolute",
    width: "100%", 
    height: "120%" 
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: scale(24),
    alignItems: 'center',
  },
  slogan: {
    marginTop: scale(24),
    color: "#FFF",
    fontSize: scale(32),
    fontFamily: "Cinzel-Regular",
  },
  description: {
    marginTop: scale(4),
    color: "rgba(255,255,255,0.7)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    textAlign: 'center',
  },

  primaryBtn: {
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(20),
    width: '100%',
    marginBottom: scaleVertical(24),
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

export default FocusSessionScreen;