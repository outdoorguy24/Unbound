import { scale, scaleVertical } from "@/constants/Scale";
import { supabase } from "@/lib/supabaseClient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ForgotPasswordScreen = () => {
  const insets = useSafeAreaInsets();
    
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEmailValid = useMemo(
    () => /\S+@\S+\.\S+/.test(email.trim()),
    [email]
  );

  const showSuccessAlert = () => {
    Alert.alert(
      "Password reset email", // Title
      "In the next few minutes, you will receive an email from Unbound.com with instructions to reset your password.\n\nIf you don’t see an email from us, check your spam or junk mail folder.", // Message
      [
        { text: "OK", onPress: () => router.replace("/(auth)/ChooseNewPassword")},
      ],
      { cancelable: true }
    );
  };

  const handleForgotPassword = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter your email address first');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Sending password reset email to:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        console.error('Password reset error:', error);
        setError(error.message || 'Failed to send reset email. Please try again.');
      } else {
        console.log('Password reset email sent successfully');
        showSuccessAlert();
        setEmail('');
      }
    } catch (err: any) {
      console.error('Password reset exception:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
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
          <Text style={styles.slogan}>{"Forgot password?"}</Text>
          <Text style={styles.description}>
            {
              "We’ll send a reset link to your email."
            }
          </Text>

          {/* Email */}
          <Text style={[styles.label, { marginTop: scaleVertical(24) }]}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="example.user@mail.com"
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          {error && <View style={styles.errorView}>
              <Image
                source={require("../../assets/new-images/caution-white.png")}
                style={styles.cautionIconImage}
                resizeMode={"contain"}
              />
              <Text style={styles.error} numberOfLines={2}>{error}</Text>
          </View>
        }
          {/* Button moved inside KeyboardAvoidingView */}
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={!isEmailValid || isLoading}
            style={[
              styles.primaryBtn,
              {marginTop: scaleVertical(32)},
              isEmailValid ? styles.btnEnabled : styles.btnDisabled,
            ]}
            onPress={handleForgotPassword}
          >
            <Text style={[styles.primaryText, {opacity: isEmailValid ? 1 : 0.5}]}>
              {isLoading ? "Sending..." : "Send email"}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
      
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
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    paddingVertical: scaleVertical(20),
    marginHorizontal: scale(24),
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
});

export default ForgotPasswordScreen;