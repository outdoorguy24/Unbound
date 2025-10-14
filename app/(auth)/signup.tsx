import { height, scale, scaleVertical } from "@/constants/Scale";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
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

const SignupScreen = () => {
  const insets = useSafeAreaInsets();
  const { signup } = useAuth();
    
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  
  const [confirm, setConfirm] = useState("");
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [agree, setAgree] = useState(false);
  const [bottomBarHeight, setBottomBarHeight] = useState(0);
  const [buttonHeight, setButtonHeight] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = useMemo(
    () => /\S+@\S+\.\S+/.test(email.trim()),
    [email]
  );
  const isPassValid = pass.length >= 8;
  const isMatch = pass.length > 0 && pass === confirm;

  const canSubmit = isEmailValid && isPassValid && isMatch && agree;

  const handleSignup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use AuthContext signup which bypasses email verification
      await signup(email, pass, email); // Using email as name for now
      
      // Signup successful - AuthContext will handle navigation to profile setup
      // No need to navigate here as AuthContext handles it
    } catch (err: any) {
      if (err.message?.includes('already registered')) {
        setError('An account with this email already exists. Please login instead.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
      // Reset fields on error
      setEmail('');
      setPass('');
      setConfirm('');
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
            bottom: 0,
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
          <Text style={styles.slogan}>{
          "Let’s get you set up."
          }</Text>
          <Text style={styles.description}>
            {
              "Let’s get started. Enter your email and create a password to begin your journey."
            }
          </Text>

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

          {/* Password */}
          <Text style={[styles.label, { marginTop: scaleVertical(16) }]}>Password</Text>
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
          <Text style={[styles.label, { marginTop: scaleVertical(16) }]}>Retype password</Text>

          <View style={{justifyContent: 'center'}}>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Same password as above"
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

        </KeyboardAvoidingView>

        {/* Terms */}
        <View style={{bottom: insets.bottom + scaleVertical(16)}}>
          <View style={[styles.termsRow]}>
            <TouchableOpacity
              style={[styles.checkbox, agree && styles.checkboxChecked]}
              activeOpacity={0.8}
              onPress={() => setAgree(!agree)}
            >
              {agree && (
                <Image
                  source={require("../../assets/new-images/icon-check-black.png")}
                  // resizeMode="center"
                  style={{
                    width: scale(24),
                    height: scale(24)
                  }}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I agree to Unbound’s{" "}
              <Text style={styles.link}>Terms & Conditions</Text> and{" "}
              <Text style={styles.link}>Privacy Policy</Text>.
            </Text>
          </View>

          {/* Submit */}
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={!canSubmit}
            style={[
              styles.btn,
              canSubmit ? styles.btnEnabled : styles.btnDisabled,
            ]}
            onLayout={(e) => setButtonHeight(e.nativeEvent.layout.height)}
            onPress={handleSignup}
          >
            <Text style={[styles.btnText, {opacity: canSubmit ? 1 : 0.5}]}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.haveAccountView]}
            activeOpacity={0.8}
            onLayout={(e) => setBottomBarHeight(e.nativeEvent.layout.height)}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.haveAccountText}>
              {"Already have an account?"}
              <Text style={styles.loginText}>{" Log in"}</Text>
            </Text>
          </TouchableOpacity>
          
      </View>
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
  haveAccountView: {
    alignSelf: "center",
    padding: scale(6),
    marginTop: height < 700 ? scaleVertical(8) : scaleVertical(16)
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
  description: {
    marginTop: scaleVertical(4),
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    letterSpacing: 0.5,
  },

  keyboard: {
    width: '100%',
    flex: 1,
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
  termsRow: {
    flexDirection: "row",
    marginHorizontal: scale(24),
    marginBottom: height < 700 ? scaleVertical(16) : scale(24),
    alignItems: "center",
  },
  checkbox: {
    width: scale(24),
    height: scale(24),
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
    marginRight: scaleVertical(10),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "rgba(255,202,145,1)",
    borderColor: "rgba(255,202,145,1)",
  },
  checkboxDot: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: "rgba(255,202,145,1)",
  },
  termsText: {
    flex: 1,
    color: "rgba(255,255,255,0.7)",
    fontSize: scale(16),
    lineHeight: scale(22),
    fontFamily: "ZillaSlab-Regular",
  },
  link: {
    color: "rgba(255,202,145,1)",
    fontFamily: "ZillaSlab-Regular",
    fontSize: scale(18),
  },
  btn: {
    backgroundColor: "#BE5E19",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scaleVertical(20),
    marginHorizontal: scale(24),
  },
  btnEnabled: {
    backgroundColor: "#BE5E19",
  },
  btnDisabled: {
    backgroundColor: "rgba(49, 43, 39, 1)",
  },
  btnText: {
    color: "#fff",
    fontSize: scale(18),
    fontFamily: "ZillaSlab-Bold",
  },
  cautionIconImage: {
    width: scale(24),
    height: scale(24),
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

export default SignupScreen;


// import { ScreenContainer } from "@/components/ui/ScreenContainer";
// import { COLORS, SPACING } from "@/constants/theme";
// import { useAuth } from "@/contexts/AuthContext";
// import { supabase } from "@/lib/supabaseClient";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import {
//   ActivityIndicator,
//   Image,
//   ImageBackground,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function SignupScreen() {
//   const router = useRouter();
//   const { login } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleGoogleSignup = async () => {
//     try {
//       setIsLoading(true);
//       await login();
//     } catch (err: any) {
//       setError(err.message || "Signup failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSignup = async () => {
//     setIsLoading(true);
//     setError(null);

//     // Validate email
//     if (!email || !email.includes('@')) {
//       setError('Please enter a valid email address');
//       setIsLoading(false);
//       return;
//     }

//     // Validate password
//     if (!password || password.length < 4) {
//       setError('Password must be at least 4 characters long');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email: email,
//         password: password,
//       });

//       if (error) {
//         if (error.message.includes('already registered')) {
//           setError('An account with this email already exists. Please login instead.');
//         } else {
//           setError(error.message || 'Signup failed. Please try again.');
//         }
//         // Reset fields on error
//         setEmail('');
//         setPassword('');
//       } else {
//         // Signup successful - user will be automatically logged in
//         // The AuthContext will handle the redirect to onboarding
//       }
//     } catch (err: any) {
//       setError('Network error. Please check your connection and try again.');
//       // Reset fields on error
//       setEmail('');
//       setPassword('');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg} resizeMode="cover">
//       <ScreenContainer style={{ backgroundColor: 'transparent', paddingHorizontal: 0, paddingTop: 0 }}>
//         <View style={styles.container}>
//           <Text style={styles.heading} numberOfLines={1}>Create Account</Text>
//           <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignup} disabled={isLoading}>
//             <Image source={require("../../assets/images/google.png")} style={styles.googleIcon} />
//             <Text style={styles.googleBtnText} numberOfLines={1}>Continue with Google</Text>
//           </TouchableOpacity>
//           <Text style={styles.divider} numberOfLines={1}>or manually</Text>
//           {error && <Text style={styles.error} numberOfLines={2}>{error}</Text>}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label} numberOfLines={1}>Email Address</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Email Address"
//               placeholderTextColor="#7A5A2F"
//               value={email}
//               onChangeText={setEmail}
//               autoCapitalize="none"
//               keyboardType="email-address"
//             />
//           </View>
//           <View style={styles.inputGroup}>
//             <Text style={styles.label} numberOfLines={1}>Password</Text>
//             <View style={styles.passwordInputWrap}>
//               <TextInput
//                 style={[styles.input, { paddingRight: 40 }]}
//                 placeholder="Password"
//                 placeholderTextColor="#7A5A2F"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPassword}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtnAbsolute}>
//                 <MaterialCommunityIcons
//                   name={showPassword ? "eye-off-outline" : "eye-outline"}
//                   size={24}
//                   color="#7A5A2F"
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>
//           <TouchableOpacity style={styles.createBtn} onPress={handleSignup} disabled={isLoading}>
//             {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createBtnText} numberOfLines={1}>Create Account</Text>}
//           </TouchableOpacity>
//           <Text style={styles.loginRow} numberOfLines={2}>
//             Already have an account ?{" "}
//             <Text style={styles.loginLink} numberOfLines={1} onPress={() => router.push("/(auth)/login")}>Login</Text>
//           </Text>
//           <View style={{ flex: 1 }} />
//           <View style={styles.mountainWrap}>
//             <Image source={require("../../assets/images/mountain.png")} style={styles.mountain} />
//           </View>
//         </View>
//       </ScreenContainer>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   bg: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingTop: 48,
//     alignItems: "center",
//   },
//   heading: {
//     fontSize: 36,
//     fontWeight: "bold",
//     color: "#2C1A05",
//     fontFamily: "Vollkorn-Bold",
//     marginBottom: SPACING.xl,
//     marginTop: SPACING.xl,
//     textAlign: "center",
//   },
//   googleBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#112710",
//     borderRadius: 16,
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     width: "100%",
//     marginTop: SPACING.md,
//     marginBottom: SPACING.sm,
//   },
//   googleIcon: {
//     width: 28,
//     height: 28,
//     marginRight: 16,
//     resizeMode: "contain",
//   },
//   googleBtnText: {
//     color: COLORS.textGold,
//     fontSize: 20,
//     fontWeight: "bold",
//     fontFamily: "Vollkorn-Bold",
//   },
//   divider: {
//     fontSize: 18,
//     color: "#2C1A05",
//     fontWeight: "bold",
//     fontFamily: "Vollkorn-Bold",
//     marginVertical: 18,
//     textAlign: "center",
//     marginBottom: SPACING.xl,
//   },
//   inputGroup: {
//     width: "100%",
//     marginBottom: SPACING.xl,
//   },
//   label: {
//     fontSize: 18,
//     color: "#2C1A05",
//     fontWeight: "bold",
//     fontFamily: "Vollkorn-Bold",
//     marginBottom: 6,
//   },
//   input: {
//     borderWidth: 2,
//     borderColor: "#2C1A05",
//     borderRadius: 10,
//     padding: 14,
//     fontSize: 16,
//     color: "#2C1A05",
//     fontFamily: "Vollkorn-Regular",
//     backgroundColor: "rgba(255,255,255,0.5)",
//   },
//   passwordInputWrap: {
//     position: "relative",
//     width: "100%",
//     justifyContent: "center",
//   },
//   eyeBtnAbsolute: {
//     position: "absolute",
//     right: 10,
//     top: 0,
//     bottom: 0,
//     justifyContent: "center",
//     height: "100%",
//     zIndex: 2,
//     padding: 8,
//   },
//   createBtn: {
//     backgroundColor: "#265C28",
//     borderRadius: 16,
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     width: "100%",
//     alignItems: "center",
//     marginTop: SPACING.md,
//     marginBottom: SPACING.xl,
//   },
//   createBtnText: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "bold",
//     fontFamily: "Vollkorn-Bold",
//   },
//   loginRow: {
//     fontSize: 18,
//     color: "#2C1A05",
//     fontFamily: "Vollkorn-Bold",
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   loginLink: {
//     color: "#265C28",
//     fontWeight: "bold",
//     textDecorationLine: "underline",
//     fontFamily: "Vollkorn-Bold",
//   },
//   error: {
//     color: "red",
//     marginBottom: 12,
//     textAlign: "center",
//   },
//   mountainWrap: {
//     width: "100%",
//     alignItems: "center",
//     marginBottom: 32,
//     marginTop: 8,
//   },
//   mountain: {
//     width: 207,
//     height: 80,
//     resizeMode: "contain",
//     alignSelf: "center",
//     marginTop: 0,
//     marginBottom: SPACING.xl,
//   },
// });
