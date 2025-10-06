import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import { scale, scaleVertical } from "@/constants/Scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get("window");

const ChooseNewPasswordScreen = () => {
  const insets = useSafeAreaInsets();
    
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  
  const [confirm, setConfirm] = useState("");
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPassValid = pass.length >= 8;
  const isMatch = pass.length > 0 && pass === confirm;

  const canSubmit = isPassValid && isMatch;

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

      <View
        style={[
          styles.mainContainer,
          {
            top: insets.top + scaleVertical(16),
          },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboard}
        >
          <TouchableOpacity
            style={styles.buttonBack}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Image
              source={require("../../assets/new-images/icon-back.png")}
              // resizeMode={"center"}
              style={{
                height: scale(20),
                width: scale(20),
              }}
            />
          </TouchableOpacity>
          <Text style={styles.slogan}>{"Choose a new password"}</Text>

          {/* Password */}
          <Text style={[styles.label, { marginTop: scaleVertical(16) }]}>New password</Text>
          <View style={{justifyContent: 'center'}}>
            <TextInput
              value={pass}
              onChangeText={setPass}
              placeholder="Minimum of 8 characters"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              secureTextEntry={!showPass}
              style={styles.input}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => {
              setShowPass((prev) => !prev)
            }}>
              <Image
                source={require("../../assets/new-images/eye-icon.png")}
                style={styles.eyeIconImage}
                resizeMode={"contain"}
              />
            </TouchableOpacity>
          </View>

          {/* Retype */}
          <Text style={[styles.label, { marginTop: scaleVertical(16) }]}>Confirm password</Text>

          <View style={{justifyContent: 'center'}}>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Must match your password above"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              secureTextEntry={!showConfirmPass}
              style={styles.input}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => {
              setShowConfirmPass((prev) => !prev)
            }}>
              <Image
                source={require("../../assets/new-images/eye-icon.png")}
                style={styles.eyeIconImage}
                resizeMode={"contain"}
              />
            </TouchableOpacity>
          </View>

          {error && <View style={styles.errorView}>
                <Image
                  source={require("../../assets/new-images/caution-white.png")}
                  style={styles.cautionIconImage}
                  resizeMode={"contain"}
                />
                <Text style={styles.error} numberOfLines={2}>{error}</Text>
            </View>
          }

          {error && <View style={styles.errorView}>
              <Image
                source={require("../../assets/new-images/caution-white.png")}
                style={styles.cautionIconImage}
                resizeMode={"contain"}
              />
              <Text style={styles.error} numberOfLines={2}>{error}</Text>
          </View>
        }
        </KeyboardAvoidingView>
      </View>
      
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={!canSubmit}
        style={[
          styles.primaryBtn,
          {bottom: insets.bottom + scaleVertical(16)},
          canSubmit ? styles.btnEnabled : styles.btnDisabled,
        ]}
        onPress={() => router.replace('/(auth)/NewPasswordSuccess')}
      >
        <Text style={[styles.primaryText, {opacity: canSubmit ? 1 : 0.5}]}>Set new password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: width * 0.939,
  },
  overlayImage: {
    position: "absolute",
    width: "100%",
    height: "95%",
  },
  buttonBack: {
    backgroundColor: "#000",
    width: scale(40),
    aspectRatio: 1,
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    width: '100%',
    position: "absolute",
  },
  slogan: {
    marginTop: scaleVertical(24),
    color: "#FFF",
    fontSize: scale(40),
    fontFamily: "Cinzel-Regular",
    letterSpacing: 0.5,
    lineHeight: scale(44),
  },
  description: {
    marginTop: scaleVertical(4),
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    letterSpacing: 0.5,
  },

  keyboard: {
    flex: 1,
    width: '100%',
    paddingHorizontal: scale(24),
  },
  label: {
    color: "#FFFFFF",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    marginTop: scaleVertical(8),
    marginBottom: scaleVertical(8),
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 6,
    paddingVertical: scaleVertical(18),
    paddingHorizontal: scaleVertical(20),
    color: "#000",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
  },

  errorView: {
    borderRadius: 6,
    backgroundColor: '#FD4949',
    paddingVertical: scaleVertical(10),
    paddingHorizontal: scaleVertical(12),
    flexDirection: 'row',
    alignItems: 'center',   // let multiline text start at top
    marginTop: scaleVertical(10),
  },
  error: {
    marginLeft: scaleVertical(12),
    color: '#fff',
    fontSize: scale(16),
    fontFamily: 'ZillaSlab-Bold',
    flex: 1,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  primaryBtn: {
    position: 'absolute',
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    paddingVertical: scaleVertical(20),
    right: scale(24),
    left: scale(24),
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
  cautionIconImage: {
    width: scale(24),
    height: scale(24),
  },
  btnEnabled: {
    backgroundColor: "#BE5E19",
  },
  btnDisabled: {
    backgroundColor: "rgba(49, 43, 39, 1)",
  },
  eyeBtn: {
    position: 'absolute',
    right: scale(16), 
    width: scale(24), 
    height: scale(24), 
  },
  eyeIconImage: {
    width: scale(24),
    height: scale(24),
  },
});

export default ChooseNewPasswordScreen;