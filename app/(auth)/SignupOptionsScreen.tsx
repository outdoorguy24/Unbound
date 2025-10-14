import { scale, scaleVertical } from "@/constants/Scale";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const SignupOptionsScreen = ({ traps, toggleOption }: any) => {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignup = async () => {
    try {
      await login();
      // Navigate to Screen Time permission screen after successful signup
      router.push("/(onboarding)/ScreenTimePermission");
    } catch (err: any) {
      console.log(err.message || "Signup failed");
    } finally {
      
    }
  };

  const handleAppleSignUp = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!appleAuth.isSupported) {
        setError('Apple Sign In is not available on this device');
        return;
      }
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      const { identityToken, nonce } = appleAuthRequestResponse;
      if (identityToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: identityToken,
          nonce: nonce,
        });
        if (error) {
          setError(error.message || 'Apple Sign Up failed');
        } else {
          // Navigate to Screen Time permission screen after successful signup
          router.push("/(onboarding)/ScreenTimePermission");
        }
      } else {
        setError('Apple Sign Up was cancelled');
      }
    } catch (err: any) {
      if (err.code === 'ERR_REQUEST_CANCELED') {
        setError(null);
      } else {
        setError('Apple Sign Up failed. Please try again.');
      }
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
        style={[styles.textContainer, { top: insets.top + scaleVertical(16) }]}
      >
      <TouchableOpacity style={styles.buttonBack} activeOpacity={0.8} onPress={() => router.back()}>
        <Image
          source={require("../../assets/new-images/icon-back.png")}
          // resizeMode={"center"}
          style={{
            height: scale(20),
            width: scale(20),
          }}
        />
      </TouchableOpacity>
      <Text style={styles.slogan}>{"Create an account"}</Text>

      <TouchableOpacity
        style={[styles.item, styles.itemActive, {marginTop: scaleVertical(40)}]}
        activeOpacity={0.8}
        onPress={() => router.push("/(auth)/signup")}
      >
        <View style={styles.leftRow}>
          <View style={styles.buttonText}>
            <Text style={[styles.label]}>{"Continue with Email"}</Text>
          </View>
          <Image
            source={require("../../assets/new-images/icon-email.png")}
            style={styles.iconImage}
            resizeMode={"contain"}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity
        style={[styles.item, styles.itemActive, { marginBottom: scale(16) }]}
        activeOpacity={0.8}
        onPress={handleGoogleSignup}
      >
        <View style={styles.leftRow}>
          <View style={styles.buttonText}>
            <Text style={[styles.label]}>{"Continue with Google"}</Text>
          </View>
          <Image
            source={require("../../assets/new-images/icon-google.png")}
            style={styles.iconImage}
            resizeMode={"contain"}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item, styles.itemActive]}
        activeOpacity={0.8}
        onPress={handleAppleSignUp}
        disabled={isLoading}
      >
        <View style={styles.leftRow}>
          <View style={styles.buttonText}>
            <Text style={[styles.label]}>{"Continue with Apple"}</Text>
          </View>
          <Image
            source={require("../../assets/new-images/icon-apple.png")}
            style={styles.iconImage}
            resizeMode={"contain"}
          />
        </View>
      </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.haveAccountView, { bottom: insets.bottom + scaleVertical(16) }]}
        activeOpacity={0.8}
        onPress={() => router.push("/(auth)/login")}
      >
        <Text style={styles.haveAccountText}>
          {"Already have an account?"}
          <Text style={styles.loginText}>{" Log in"}</Text>
        </Text>
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
  textContainer: {
    position: "absolute",
    left: scale(24),
    right: scale(24),
    // backgroundColor: 'red'
  },
  slogan: {
    marginTop: scale(24),
    color: "#FFF",
    fontSize: scale(40),
    fontFamily: "Cinzel-Bold",
    letterSpacing: 0.5,
  },
  separator: {
    backgroundColor: "rgba(217, 217, 217, 0.1)",
    height: 1,
    marginVertical: scale(24),
  },
  item: {
    flexDirection: "row",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  itemActive: {
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  leftRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    color: "#FFF",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
    paddingVertical: scale(18),
  },
  iconImage: {
    position: "absolute",
    left: scaleVertical(17),
    width: scale(24),
    height: scale(24),
  },
  buttonText: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  haveAccountView: {
    position: "absolute",
    alignSelf: "center",
    padding: scale(6),
  },
  haveAccountText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Regular",
  },
  loginText: {
    color: "rgba(255, 202, 145, 1)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
  },
});

export default SignupOptionsScreen;
