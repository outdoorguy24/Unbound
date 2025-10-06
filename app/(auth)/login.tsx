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
} from "react-native";
import { scale, scaleVertical } from "@/constants/Scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  const insets = useSafeAreaInsets();
    
  const [email, setEmail] = useState(""); //amol@yopmail.com
  const [showPass, setShowPass] = useState(false);
  const [pass, setPass] = useState(""); //12345678

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginAttemptExceeded, setLoginAttemptExceeded] = useState(false);
  
  const { login } = useAuth();

  const handleGoogleSignup = async () => {
    try {
      await login();
    } catch (err: any) {
      console.log(err.message || "Signup failed");
    } finally {
      
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    
    // Validate password
    if (!pass) {
      setError('Please enter your password');
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: pass,
      });
      
      console.log("error =====>", error);
      console.log("data =====>", data);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(error.message || 'Login failed. Please try again.');
        }
        // Reset fields on error
        setEmail('');
        setPass('');
      } else {
        // Login successful - AuthContext will handle the redirect
      }
    } catch (err: any) {
      console.log("error 222 =====>", err);

      setError('Network error. Please check your connection and try again.');
      // Reset fields on error
      setEmail('');
      setPass('');
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
            marginTop: insets.top + scaleVertical(16),
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
              style={{
                height: scale(20),
                width: scale(20),
              }}
              // resizeMode={"center"}
            />
          </TouchableOpacity>
          <Text style={styles.slogan}>{"Welcome back!"}</Text>
          <Text style={styles.description}>
            {
              "Enter your details below"
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

          {error && <View style={styles.errorView}>
              <Image
                source={require("../../assets/new-images/caution-white.png")}
                style={styles.cautionIconImage}
                resizeMode={"contain"}
              />
              <Text style={styles.error} numberOfLines={2}>{error}</Text>
          </View>
        }

        <TouchableOpacity
          style={[
            styles.primaryBtn,
            {marginTop: error ? scaleVertical(24) : scaleVertical(32)}
          ]}
          onPress={handleLogin}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryText}>{"Login"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.backBtn, {marginTop: error ? scaleVertical(16) : scaleVertical(24)}]}
          onPress={() => setLoginAttemptExceeded(true)}
          activeOpacity={0.9}
        >
          <Text style={styles.backText}>{"Forgot your password?"}</Text>
        </TouchableOpacity>
      

        </KeyboardAvoidingView>
      </View>

      <View style={{alignContent: 'center', justifyContent: 'center', flex: 1}}>
          <Text style={styles.orText}>{"or"}</Text>
      </View>

      
      <View style={[styles.buttonView, {marginBottom: insets.bottom + scaleVertical(16)}]}>
        <TouchableOpacity
          style={[styles.item, styles.itemActive, { marginBottom: scaleVertical(16) }]}
          activeOpacity={0.8}
          onPress={handleGoogleSignup}
        >
          <View style={styles.leftRow}>
            <View style={styles.buttonText}>
              <Text style={[styles.btnLabel]}>{"Continue with Google"}</Text>
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
        >
          <View style={styles.leftRow}>
            <View style={styles.buttonText}>
              <Text style={[styles.btnLabel]}>{"Continue with Apple"}</Text>
            </View>
            <Image
              source={require("../../assets/new-images/icon-apple.png")}
              style={styles.iconImage}
              resizeMode={"contain"}
            />
          </View>
        </TouchableOpacity>
      </View>

      {loginAttemptExceeded && 
        <BlurView style={styles.alertContainer} tint={'dark'} intensity={100}>
          <View style={styles.alertView}>
            <TouchableOpacity style={styles.btnClose} onPress={() => setLoginAttemptExceeded(false)}>
              <Image
                source={require("../../assets/new-images/icon-close-black.png")}
                // resizeMode={"center"}
                style={{
                  height: scale(24),
                  width: scale(24),
                }}
              />
            </TouchableOpacity>
            <View style={styles.dangerView}>
              <Image
              source={require("../../assets/new-images/trouble-login.png")}
              // resizeMode={"center"}
              style={styles.cautionImage}
              />
              <Text style={styles.incorrectCode}>{"Having trouble logging in?"}</Text>            
              <Text style={styles.incorrectCodeDesc}>{"You’ve entered the wrong email or password multiple times.\n\nWould you like to reset your password and regain access?"}</Text>            

              <TouchableOpacity
                style={[
                  styles.retryBtn,
                ]}
                onPress={() => {
                  setLoginAttemptExceeded(false);
                  router.push("/(auth)/ForgotPassword");
                }}
                activeOpacity={0.9}
              >
                <Text style={styles.retryText}>{"Reset password"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.resendBtn,
                ]}
                onPress={() => {
                  setLoginAttemptExceeded(false);
                }}
                activeOpacity={0.9}
              >
                <Text style={styles.resendText}>{"Try again"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    position: "absolute",
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
    // flex: 1,
  },
  slogan: {
    marginTop: scaleVertical(24),
    color: "#FFF",
    fontSize: scale(40),
    fontFamily: "Cinzel-Regular",
    letterSpacing: 0.5,
    lineHeight: scale(44),
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
  btnText: {
    color: "#fff",
    fontSize: scale(18),
    fontFamily: "ZillaSlab-Bold",
  },
  cautionIconImage: {
    width: scale(24),
    height: scale(24),
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
  backBtn: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(8),
    paddingHorizontal: scaleVertical(20),
  },
  orText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: scale(16),
    textAlign: "center",
    fontFamily: "ZillaSlab-Regular",
    letterSpacing: 0.5,
  },
  backText: {
    color: "rgba(255, 202, 145, 1)",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
  
  buttonView: {
    width:'100%',
  },
  item: {
    flexDirection: "row",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "transparent",
    marginHorizontal: scale(24),
  },
  itemActive: {
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  leftRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  btnLabel: {
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


  alertContainer: {
    position: 'absolute', 
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0, 
    justifyContent: 'center'
  },
  alertView: {
    backgroundColor: 'white', 
    marginHorizontal: scale(24), 
    borderRadius: 6
  },
  btnClose: {
    width: scale(34), 
    aspectRatio: 1, 
    alignSelf: 'flex-end', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
    marginTop: scale(16)
  },
  dangerView: {
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: scale(24),
    marginHorizontal: scale(24)
  },
  cautionImage: {
    height: scaleVertical(48),
    aspectRatio: 1,
  },
  incorrectCode: {
    marginTop: scaleVertical(16),
    color: "#000",
    fontSize: scale(20),
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
  },
  incorrectCodeDesc: {
    marginTop: scaleVertical(8),
    color: "rgba(0,0,0,0.6)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(20),
    width: '100%',
    marginTop: scaleVertical(32),
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
  },
  resendBtn: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(20),
    width: '100%',
    marginTop: scaleVertical(16),
  },
  resendText: {
    color: "#000",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
  },
});

export default LoginScreen;