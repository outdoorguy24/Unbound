import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { height, scale, scaleVertical } from "@/constants/Scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");
const CONTACT_PHONE = process.env.EXPO_PUBLIC_CONTACT_PHONE || "+19164207262"; // Unbound contact number
const CONTACT_EMAIL = "howdy@unboundapp.live";
const EMAIL_SUBJECT = "Thoughts about Unbound";
const EMAIL_BODY = ""; // Empty body text

const FounderScreen = () => {
  const insets = useSafeAreaInsets();
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    setIsMessageOpen(true);
    setMessage("");
  };

  const handleCancel = () => setIsMessageOpen(false);

  const handleSendText = () => {
    // Format the phone number to ensure it works on all devices
    const formattedPhone = CONTACT_PHONE.replace(/[^\d+]/g, '');
    Linking.openURL(`sms:${formattedPhone}`);
  };

  const handleEmail = async () => {
    // Encode the email parameters
    const emailUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;
    
    // Different URL schemes for Gmail
    const gmailUrls = Platform.select({
      ios: [
        // Try different known Gmail URL schemes for iOS
        `googlegmail:///co?to=${CONTACT_EMAIL}`,
        `googlegmail://co?to=${CONTACT_EMAIL}`,
        `gmail://co?to=${CONTACT_EMAIL}`,
      ],
      android: [`googlegmail://co?to=${CONTACT_EMAIL}`]
    }) || [];

    try {
      // Check if Gmail is available first
      let canOpenGmail = false;
      let workingGmailUrl = '';
      
      // Try each Gmail URL scheme
      for (const url of gmailUrls) {
        try {
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            canOpenGmail = true;
            workingGmailUrl = url;
            break;
          }
        } catch (e) {
          console.log('Error checking URL:', url, e);
        }
      }

      // If Gmail is available, show choice dialog
      if (canOpenGmail) {
        Alert.alert(
          'Choose Email App',
          'Which email app would you like to use?',
          [
            {
              text: 'Gmail',
              onPress: () => {
                const fullGmailUrl = `${workingGmailUrl}&subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;
                Linking.openURL(fullGmailUrl).catch(() => {
                  // Fallback to default mail if Gmail fails
                  Linking.openURL(emailUrl);
                });
              }
            },
            {
              text: 'Mail',
              onPress: () => Linking.openURL(emailUrl)
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      } else {
        // If Gmail is not available, just open default mail
        await Linking.openURL(emailUrl);
      }
    } catch (error) {
      console.log('Email error:', error);
      Alert.alert(
        'Error',
        'Could not open email app. Please make sure you have an email app installed.',
        [{ text: 'OK' }]
      );
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
        <View
          style={styles.headerView}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.slogan}>{"Talk with the founder"}</Text>
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
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView
          style={styles.keyboard}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text style={{
              color: "#FFF",
              fontSize: scale(20),
              fontFamily: "ZillaSlab-SemiBold",
              letterSpacing: 0.5,
            }}>
              {"Howdy"}
          </Text>

          <Text style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Regular",
              letterSpacing: 0.5,
              marginTop: scaleVertical(8),
              lineHeight: scale(20),
            }}>
              {"I built Unbound because I was tired of billion-dollar tech companies stealing my time and attention for profit.\n\nWith a young family and real goals to chase, I refused to let algorithms designed to addict me dictate how I spend this one life I get. Every existing app was overpriced, overcomplicated, or easily bypassed.\n\nSo I built what actually works for guys. Hit me up with feedback, questions, or your best joke."}
          </Text>

          <Text style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Regular",
              letterSpacing: 0.5,
              marginTop: scaleVertical(16),
            }}>
              {"-Alex"}
          </Text>

          <Image
            source={require("../../assets/new-images/alex-img.png")}
            style={{
              height: scale(70),
              width: scale(70),
              marginTop: scaleVertical(24)
            }}
          />
        </ScrollView>

        <View style={{
          marginTop: scaleVertical(30),
          marginBottom: insets.bottom + scaleVertical(16),
          marginHorizontal: scale(24)
        }}>

          <TouchableOpacity
            style={[{
              flexDirection: "row",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.2)",
              marginBottom: scaleVertical(16)
            }]}
            activeOpacity={0.8}
            onPress={handleSend}
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
                  paddingVertical: scaleVertical(18),
                }]}>
                  {"Text me"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[{
              flexDirection: "row",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.2)",
              marginBottom: scaleVertical(16)
            }]}
            activeOpacity={0.8}
            onPress={handleEmail}
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
                  paddingVertical: scaleVertical(18),
                }]}>
                  {"Email me"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[{
              flexDirection: "row",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.2)",
            }]}
            activeOpacity={0.8}
            onPress={handleSendText}
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
                  paddingVertical: scaleVertical(18),
                }]}>
                  {"Book a call with me"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>


      {/* ===================== MESSAGE MODAL ===================== */}
      <Modal
        transparent
        visible={isMessageOpen}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleCancel}>
          <BlurView 
            style={{
              flex: 1,
              justifyContent: "flex-end",
            }} 
            tint={'dark'}
            intensity={30}
          >
              {/* Sheet */}
              <View
                style={{
                  backgroundColor: "#000",
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                  paddingTop: scaleVertical(8),
                  paddingHorizontal: scale(24),
                  paddingBottom: insets.bottom + scaleVertical(16),
                }}
              >
                {/* Drag indicator (optional look) */}
                <View
                  style={{
                    alignSelf: "center",
                    width: scale(76),
                    height: 5,
                    borderRadius: 2.5,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    marginBottom: scaleVertical(20),
                  }}
                />

                {/* Header + close */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: scaleVertical(24),
                  }}
                >
                  <Text
                    style={{
                      color: "#FFF",
                      fontSize: scale(24),
                      fontFamily: "ZillaSlab-SemiBold",
                      letterSpacing: 0.5,
                    }}
                  >
                    {"Send me a message"}
                  </Text>

                  <TouchableOpacity
                    onPress={handleCancel}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Image
                      source={require("../../assets/new-images/icon-close-white.png")}
                      // resizeMode={"center"}
                      style={{
                        height: scale(24),
                        width: scale(24),
                      }}
                    />
                  </TouchableOpacity>
                </View>

                {/* Text area */}
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Feel free to send me your best joke, suggest a feature, or give feedback."
                  placeholderTextColor="#rgba(0, 0, 0, 0.5)"
                  multiline
                  textAlignVertical="top"
                  style={{
                    height: height * 0.45,
                    borderRadius: 6,
                    backgroundColor: "#rgba(255, 255, 255, 0.8)",
                    padding: scale(20),
                    color: "#rgba(0, 0, 0, 1)",
                    fontSize: scale(16),
                    fontFamily: "ZillaSlab-Medium",
                  }}
                />

                {/* Send button */}
                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                  ]}
                  onPress={() => {
                    
                  }}
                  activeOpacity={0.9}
                >
                  <Text style={styles.primaryText}>{"Send message"}</Text>
                </TouchableOpacity>
                

                {/* Cancel */}
                <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.9}>
                  <Text style={styles.secondaryText}>Cancel</Text>
                </TouchableOpacity>
              </View>
          </BlurView>
        </TouchableWithoutFeedback>
      </Modal>
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
    flex: 1,
    width: '100%',
  },
  slogan: {
    position: 'absolute',
    color: "#FFF",
    fontSize: scale(22),
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
    width: '100%',
    textAlign: 'center',
  },
  headerView: {
    width: '100%',
    paddingHorizontal: scale(24),
  },
  keyboard: {
    flex: 1,
    width: '100%',
    paddingHorizontal: scale(16),
    marginTop: scaleVertical(55),
  },
  primaryBtn: {
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(18),
    width: '100%',
    marginTop: scaleVertical(24),
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
  secondaryBtn: {
    marginTop: scaleVertical(16),
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    paddingVertical: scaleVertical(20),
  },
  secondaryText: {
    color: "#FFFFFF",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
});

export default FounderScreen;


// import { ScreenContainer } from "@/components/ui/ScreenContainer";
// import { SPACING } from "@/constants/theme";
// import { Feather } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React from "react";
// import { Alert, Image, ImageBackground, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// // Contact information
// const CONTACT_PHONE = process.env.EXPO_PUBLIC_CONTACT_PHONE || "+19164207262"; // Unbound contact number
// const CONTACT_EMAIL = "howdy@unboundapp.live";
// const EMAIL_SUBJECT = "Thoughts about Unbound";
// const EMAIL_BODY = ""; // Empty body text

// export default function FounderScreen() {
//   const router = useRouter();
  
//   const handleSendText = () => {
//     // Format the phone number to ensure it works on all devices
//     const formattedPhone = CONTACT_PHONE.replace(/[^\d+]/g, '');
//     Linking.openURL(`sms:${formattedPhone}`);
//   };

//   const handleEmail = async () => {
//     // Encode the email parameters
//     const emailUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;
    
//     // Different URL schemes for Gmail
//     const gmailUrls = Platform.select({
//       ios: [
//         // Try different known Gmail URL schemes for iOS
//         `googlegmail:///co?to=${CONTACT_EMAIL}`,
//         `googlegmail://co?to=${CONTACT_EMAIL}`,
//         `gmail://co?to=${CONTACT_EMAIL}`,
//       ],
//       android: [`googlegmail://co?to=${CONTACT_EMAIL}`]
//     }) || [];

//     try {
//       // Check if Gmail is available first
//       let canOpenGmail = false;
//       let workingGmailUrl = '';
      
//       // Try each Gmail URL scheme
//       for (const url of gmailUrls) {
//         try {
//           const canOpen = await Linking.canOpenURL(url);
//           if (canOpen) {
//             canOpenGmail = true;
//             workingGmailUrl = url;
//             break;
//           }
//         } catch (e) {
//           console.log('Error checking URL:', url, e);
//         }
//       }

//       // If Gmail is available, show choice dialog
//       if (canOpenGmail) {
//         Alert.alert(
//           'Choose Email App',
//           'Which email app would you like to use?',
//           [
//             {
//               text: 'Gmail',
//               onPress: () => {
//                 const fullGmailUrl = `${workingGmailUrl}&subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;
//                 Linking.openURL(fullGmailUrl).catch(() => {
//                   // Fallback to default mail if Gmail fails
//                   Linking.openURL(emailUrl);
//                 });
//               }
//             },
//             {
//               text: 'Mail',
//               onPress: () => Linking.openURL(emailUrl)
//             },
//             {
//               text: 'Cancel',
//               style: 'cancel'
//             }
//           ]
//         );
//       } else {
//         // If Gmail is not available, just open default mail
//         await Linking.openURL(emailUrl);
//       }
//     } catch (error) {
//       console.log('Email error:', error);
//       Alert.alert(
//         'Error',
//         'Could not open email app. Please make sure you have an email app installed.',
//         [{ text: 'OK' }]
//       );
//     }
//   };

//   return (
//     <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg}>
//       <ScreenContainer style={{ backgroundColor: 'transparent', paddingHorizontal: 0, paddingTop: 0 }}>
//         <View style={styles.headerRow}>
//           <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//             <View style={styles.backCircle}>
//               <Feather name="arrow-left" size={22} color="#F9E7B0" />
//             </View>
//           </TouchableOpacity>
//           <Text style={styles.header} numberOfLines={1}>Talk with the Founder</Text>
//         </View>
//         <View style={styles.content}>
//           <Image source={require("../../assets/images/founder.png")} style={styles.founderImg} />
//           <Text style={styles.intro} numberOfLines={2}>
//             I&rsquo;m <Text style={styles.name}>Alex</Text>, the founder of Unbound.
//           </Text>
//           <Text style={styles.body} numberOfLines={6}>
//             This picture makes my beard and hairline look way better than it is, but I&rsquo;ll take it. I built Unbound
//             because with a young family and plenty of goals, I was done watching my time disappear into a screen.
//             I&rsquo;m glad you&rsquo;re here & would love to hear from you.
//           </Text>
//           <View style={styles.messageBox}>
//             <Text style={styles.messageText} numberOfLines={3}>
//               Feel free to <Text style={styles.messageHighlight}>send me your best joke</Text>, suggest a feature, or give
//               feedback.
//             </Text>
//           </View>
//           <TouchableOpacity style={styles.actionBtn} onPress={handleSendText}>
//             <Image source={require("../../assets/images/message.png")} style={styles.actionIcon} />
//             <Text style={styles.actionBtnText} numberOfLines={1}>Send a Text</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.actionBtn, { marginTop: 18 }]}
//             onPress={handleEmail}
//           >
//             <Image source={require("../../assets/images/email.png")} style={styles.actionIcon} />
//             <Text style={styles.actionBtnText} numberOfLines={1}>Email Me</Text>
//           </TouchableOpacity>
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
//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: SPACING.xxxl,
//     marginBottom: 0,
//     paddingHorizontal: 18,
//   },
//   backBtn: {
//     padding: 0,
//     marginRight: 16,
//   },
//   backCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#564110",
//     borderWidth: 1.5,
//     borderColor: "#E6D3A7",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   header: {
//     fontSize: 27,
//     fontFamily: "Vollkorn-Bold",
//     color: "#2C1A05",
//     textAlign: "left",
//     flex: 1,
//     marginLeft: SPACING.sm,
//   },
//   content: {
//     flex: 1,
//     alignItems: "center",
//     paddingHorizontal: SPACING.lg,
//     marginTop: SPACING.sm,
//   },
//   founderImg: {
//     width: 180,
//     height: 180,
//     resizeMode: "contain",
//     marginVertical: 12,
//   },
//   intro: {
//     fontSize: 20,
//     fontFamily: "Vollkorn-Bold",
//     color: "#2C1A05",
//     textAlign: "center",
//     marginTop: SPACING.sm,
//     marginBottom: SPACING.sm,
//   },
//   name: {
//     color: "#3D7A4C",
//     fontFamily: "Vollkorn-Bold",
//   },
//   body: {
//     fontSize: 18,
//     fontFamily: "Vollkorn-SemiBold",
//     color: "#2C1A05",
//     textAlign: "center",
//     marginBottom: SPACING.md,
//     marginTop: 0,
//     lineHeight: 26,
//   },
//   messageBox: {
//     backgroundColor: "#F9E7B0",
//     borderRadius: 16,
//     borderWidth: 1.5,
//     borderColor: "#E6D3A7",
//     paddingVertical: 18,
//     paddingHorizontal: 18,
//     marginBottom: 24,
//     marginTop: 0,
//     width: "100%",
//   },
//   messageText: {
//     fontSize: 17,
//     fontFamily: "Vollkorn-Bold",
//     color: "#2C1A05",
//     textAlign: "center",
//   },
//   messageHighlight: {
//     color: "#3D7A4C",
//     fontFamily: "Vollkorn-Bold",
//   },
//   actionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#3D7A4C",
//     borderRadius: SPACING.md,
//     paddingVertical: SPACING.md,
//     paddingHorizontal: SPACING.lg,
//     marginHorizontal: SPACING.md,
//     marginTop: 0,
//     width: "100%",
//     justifyContent: "center",
//   },
//   actionIcon: {
//     width: 20,
//     height: 20,
//     resizeMode: "contain",
//     marginRight: 14,
//     tintColor: "#F9E7B0",
//   },
//   actionBtnText: {
//     color: "#F9E7B0",
//     fontFamily: "Vollkorn-Bold",
//     fontSize: 18,
//     textAlign: "center",
//   },
// });
