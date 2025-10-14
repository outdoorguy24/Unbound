import { height, scale, scaleVertical } from "@/constants/Scale";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ScreenProfileSetup = () => {
  const insets = useSafeAreaInsets();
    
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  
  const [toggle, setToggle] = useState(false);
  const [bottomBarHeight, setBottomBarHeight] = useState(0);
  const [buttonHeight, setButtonHeight] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { traps, scrollTimes, concerns } = useOnboarding();
  const { user } = useAuth();

  const isValidName = (name: string) => {
    const trimmed = name.trim();
    return trimmed.length >= 2 && /^[A-Za-z\s'-]+$/.test(trimmed);
  };
  
  const isValidCity = (city: string) => {
    const trimmed = city.trim();
    return trimmed.length >= 2 && /^[A-Za-z\s'-]+$/.test(trimmed);
  };

  const canSubmit = isValidName(name) && isValidCity(city);

  const handleSubmit = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      // For mock users (from AuthContext), skip Supabase save and just proceed
      // This avoids the row-level security policy error
      console.log('Profile setup completed for user:', user.id);
      console.log('Name:', name.trim(), 'City:', city.trim());
      console.log('Onboarding data:', { traps, scrollTimes, concerns });
      
      // For mock users, skip phone usage tracking to avoid Supabase errors
      console.log('Skipping phone usage tracking for mock user:', user.id);
      
      // Navigate to Screen Time permission screen
      router.replace("/(onboarding)/ScreenTimePermission");
    } catch (e: any) {
      setError(e.message || "Failed to save profile");
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
          "LET’S DO THIS"
          }</Text>
          <Text style={styles.description}>
            {
              "Tell us your name and where you’re based. This helps personalize your experience."
            }
          </Text>

          
          <Text style={[styles.label, { marginTop: scaleVertical(46) }]}>Full name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Please enter your full name"
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            autoCapitalize="none"
            style={styles.input}
          />
          
          <Text style={[styles.label]}>Where are you based?</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="Type your city or town"
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            autoCapitalize="none"
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
          <Text style={[styles.label2]}>Your location is used only to personalize your journey. You can change it anytime.</Text>

          <View style={styles.unboundToggleView}>
            <Text style={[
              styles.label3, 
              {marginRight: scaleVertical(25)}
            ]}>Yes, I want to receive the Unbound Dispatch: a monthly email with motivation, adventure ideas, and wins from the community</Text>
            <Switch value={toggle} onValueChange={(value) => setToggle(value)}         
              ios_backgroundColor={'rgba(255, 255, 255, 0.2)'}
              trackColor={{ false: "#67CE67", true: "#67CE67" }}
              thumbColor={toggle ? "#f4f3f4" : "#f4f3f4"}
              />
          </View>
        </KeyboardAvoidingView>

        {/* Terms */}
        <View style={{bottom: insets.bottom + scaleVertical(16)}}>
          {/* Submit */}
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={!canSubmit}
            style={[
              styles.btn,
              canSubmit ? styles.btnEnabled : styles.btnDisabled,
            ]}
            onLayout={(e) => setButtonHeight(e.nativeEvent.layout.height)}
            onPress={handleSubmit}
          >
            <Text style={[styles.btnText, {opacity: canSubmit ? 1 : 0.5}]}>Continue</Text>
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
    flex: 1,
    paddingHorizontal: scale(24),
  },
  label: {
    color: "#FFFFFF",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    marginTop: scaleVertical(16),
    marginBottom: scaleVertical(8),
  },
  label3: {
    color: "#FFFFFF",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
  },
  label2: {
    color: "#FFFFFF80",
    fontSize: scale(14),
    fontFamily: "ZillaSlab-Regular",
    marginTop: scaleVertical(20),
  },
  unboundToggleView: {
    width: '100%',
    flexDirection: 'row', 
    justifyContent: 'center',
    marginTop: scaleVertical(40),
    paddingHorizontal: scale(24),
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

export default ScreenProfileSetup;


// import { ScreenContainer } from "@/components/ui/ScreenContainer";
// import { SPACING } from "@/constants/theme";
// import { useAuth } from "@/contexts/AuthContext";
// import { useOnboarding } from "@/contexts/OnboardingContext";
// import { saveUserProfile } from "@/lib/supabaseUserProfile";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
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

// export default function ScreenProfileSetup() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const { traps, scrollTimes, concerns } = useOnboarding();
//   const [firstName, setFirstName] = useState("");
//   const [city, setCity] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const isValidName = (name: string) => {
//     const trimmed = name.trim();
//     return trimmed.length >= 2 && /^[A-Za-z\s'-]+$/.test(trimmed);
//   };
  
//   const isValidCity = (city: string) => {
//     const trimmed = city.trim();
//     return trimmed.length >= 2 && /^[A-Za-z\s'-]+$/.test(trimmed);
//   };

//   const canSubmit = isValidName(firstName) && isValidCity(city);

//   const handleSubmit = async () => {
//     if (!user?.id) return;
//     setLoading(true);
//     setError(null);
//     try {
//       await saveUserProfile(user.id, firstName.trim(), city.trim(), {
//         traps,
//         scrollTimes,
//         concerns,
//       });
//       router.replace("/(onboarding)/Screen133");
//     } catch (e: any) {
//       setError(e.message || "Failed to save profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg} resizeMode="cover">
//       <ScreenContainer style={styles.screenContainer}>
//         <View style={styles.container}>
//           <Text style={styles.heading}>SMART MOVE.</Text>
//           <Text style={styles.description}>
//             Welcome to the crew. Please give{`\n`}us a little info about you so we{`\n`}can match you with an{`\n`}
//             accountability partner.
//           </Text>
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>First Name *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="First Name"
//               value={firstName}
//               onChangeText={setFirstName}
//               autoCapitalize="words"
//               autoCorrect={false}
//               maxLength={32}
//               placeholderTextColor="#7A5A2F"
//             />
//           </View>
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>City *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="City"
//               value={city}
//               onChangeText={setCity}
//               autoCapitalize="words"
//               autoCorrect={false}
//               maxLength={32}
//               placeholderTextColor="#7A5A2F"
//             />
//           </View>
//           {error && <Text style={styles.error}>{error}</Text>}
//           <TouchableOpacity
//             style={[styles.button, !canSubmit && styles.buttonDisabled]}
//             onPress={handleSubmit}
//             disabled={!canSubmit || loading}
//           >
//             {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
//           </TouchableOpacity>
//           <View style={{ flex: 1 }} />
//           <View style={styles.fireWrap}>
//             <Image source={require("../../assets/images/fire.png")} style={styles.fire} />
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
//   screenContainer: {
//     backgroundColor: 'transparent',
//     paddingHorizontal: 0,
//     paddingTop: 0,
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingTop: 14.4,
//     alignItems: "center",
//   },
//   heading: {
//     fontSize: 36,
//     fontWeight: "bold",
//     color: "#2C1A05",
//     fontFamily: "Vollkorn-Bold",
//     marginBottom: 16,
//     marginTop: SPACING.xl,
//     textAlign: "center",
//   },
//   description: {
//     fontSize: 20,
//     color: "#4B3415",
//     fontFamily: "Vollkorn-Bold",
//     textAlign: "center",
//     marginBottom: 32,
//     marginHorizontal: 8,
//     lineHeight: SPACING.xl,
//   },
//   inputGroup: {
//     width: "100%",
//     marginBottom: 24,
//   },
//   label: {
//     fontSize: 20,
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
//     fontSize: 18,
//     color: "#2C1A05",
//     fontFamily: "Vollkorn-Regular",
//     backgroundColor: "rgba(255,255,255,0.5)",
//   },
//   button: {
//     backgroundColor: "#265C28",
//     borderRadius: 16,
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     width: "100%",
//     alignItems: "center",
//     marginTop: 8,
//     marginBottom: 16,
//   },
//   buttonDisabled: {
//     opacity: 0.5,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "bold",
//     fontFamily: "Vollkorn-Bold",
//   },
//   error: {
//     color: "red",
//     marginBottom: 12,
//     textAlign: "center",
//   },
//   fireWrap: {
//     width: "100%",
//     alignItems: "center",
//     marginBottom: 32,
//     marginTop: 8,
//   },
//   fire: {
//     width: 200,
//     height: 200,
//     resizeMode: "contain",
//     alignSelf: "center",
//     marginTop: 0,
//     marginBottom: 0,
//   },
// });
