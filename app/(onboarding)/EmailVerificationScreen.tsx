import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { scale, scaleVertical } from "@/constants/Scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const { width } = Dimensions.get("window");

const GAP = 6;      
const BOX_H = 56;   
const DASH_W = 30;  

const EmailSignupScreen = () => {
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [wrapW, setWrapW] = useState(0);

  const CELL_COUNT = 6;
  const canSubmit = true;

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

  const cellW =
    wrapW > 0 ? (wrapW - (GAP * 6 + DASH_W)) / CELL_COUNT : 40;

  const dashLeft = wrapW > 0 ? 3 * cellW + 3 * GAP : 0;
  const dashTop = Math.round(BOX_H / 2) - 1;

  useEffect(() => {
    setTimer(30);
    setCanResend(false);
  }, []);

  useEffect(() => {
    if (canResend) return;
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(id);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [canResend]);

  const handleResend = () => {
    if (!canResend) return;
    setValue("");
    setTimer(30);
    setCanResend(false);
  };

  return (
    <View style={styles.safe}>
      <Image
        source={require("../../assets/new-images/onboarding-screen-4.png")}
        style={styles.image}
      />
      <Image
        source={require("../../assets/new-images/onboarding-overlay-full.png")}
        style={styles.overlayImage}
      />

      <View style={[styles.mainContainer, { top: insets.top + scaleVertical(16) }]}>
        <TouchableOpacity
          style={styles.buttonBack}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Image source={require("../../assets/new-images/icon-back.png")} 
            // resizeMode="center"
            style={{
              height: scale(20),
              width: scale(20),
            }}
          />
        </TouchableOpacity>

        <Text style={styles.slogan}>Verify your email</Text>
        <Text style={styles.description}>Enter the 6-digit code we just sent.</Text>

        <View style={styles.otpWrap} onLayout={(e) => setWrapW(e.nativeEvent.layout.width)}>
          {/* Dash overlay with space around it */}
          {wrapW > 0 && (
            <View
              pointerEvents="none"
              style={[styles.dashBar, { left: dashLeft, top: dashTop, width: DASH_W }]}
            />
          )}

          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            autoFocus
            editable
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            rootStyle={styles.codeFieldRoot}
            renderCell={({ index, symbol, isFocused }) => {
              const marginLeft =
                index === 0 ? 0 : index === 3 ? GAP * 2 + DASH_W : GAP;

              return (
                <View
                  key={index}
                  style={[
                    styles.cellBox,
                    {
                      width: cellW,
                      height: BOX_H,
                      marginLeft,
                    },
                    isFocused && styles.cellBoxFocused,
                  ]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  <Text style={styles.cellText}>{symbol ? "•" : ""}</Text>
                </View>
              );
            }}
          />
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={handleResend} disabled={!canResend}>
            <Text style={[styles.resendText, !canResend && styles.disabled]}>
              Resend code
            </Text>
          </TouchableOpacity>
          <Text style={styles.timerText}>
            {canResend ? "" : `00:${String(timer).padStart(2, "0")}`}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        disabled={!canSubmit}
        style={[styles.btn, canSubmit ? styles.btnEnabled : styles.btnDisabled, { bottom: insets.bottom + scaleVertical(16) }]}
        onPress={() => router.push("/(onboarding)/ConfirmEmailScreen")}
      >
        <Text style={styles.btnText}>Verify email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000" },
  image: { width: "100%", height: width * 0.939 },
  overlayImage: { position: "absolute", width: "100%", height: "95%" },
  buttonBack: {
    backgroundColor: "#000",
    width: scale(40),
    aspectRatio: 1,
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: { position: "absolute", left: scale(24), right: scale(24) },
  slogan: {
    marginTop: scale(24),
    color: "#FFF",
    fontSize: scale(40),
    fontFamily: "Cinzel-Regular",
    lineHeight: scale(44),
  },
  description: {
    marginTop: scale(4),
    color: "rgba(255,255,255,0.7)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
  },
  btn: {
    backgroundColor: "#BE5E19",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scaleVertical(20),
    position: "absolute",
    left: scale(24),
    right: scale(24),
  },
  btnEnabled: { backgroundColor: "#BE5E19" },
  btnDisabled: { backgroundColor: "rgba(49,43,39,1)" },
  btnText: { color: "#fff", fontSize: scale(18), fontFamily: "ZillaSlab-Bold" },

  otpWrap: { width: "100%", position: "relative", marginTop: scaleVertical(40) },
  codeFieldRoot: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  cellBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  cellBoxFocused: {
    borderColor: "rgba(190, 94, 25, 1)",
    shadowColor: "rgba(190, 94, 25, 1)",
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  cellText: { color: "#000", fontSize: scale(22), lineHeight: scale(24) },

  dashBar: {
    position: "absolute",
    height: 2,
    backgroundColor: "rgba(255,255,255,0.5)",
    zIndex: 5,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scaleVertical(24),
    alignItems: "center",
  },
  resendText: { color: "#FFF", fontSize: scale(18), fontFamily: "ZillaSlab-Medium" },
  disabled: { opacity: 0.5 },
  timerText: { color: "#FFF", fontFamily: "ZillaSlab-Medium", fontSize: scale(16) },
});

export default EmailSignupScreen;