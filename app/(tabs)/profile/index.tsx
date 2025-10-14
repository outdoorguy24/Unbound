import { scale, scaleVertical } from "@/constants/Scale";
import { useAuth } from "@/contexts/AuthContext";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import * as StoreReview from 'expo-store-review';
import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");


const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { logout, user } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

  type Row = {
    id: string;
    type: "header" | "row";
    title: string;
    icon?: any; // Feather icon name for rows
  };

  const DATA: Row[] = [
    { id: "h1", type: "header", title: "Feedback & Community" },
    { id: "r1", type: "row", title: "Talk with the founder", icon: require("../../../assets/new-images/settings-icons/talk-with-founder.png") },
    { id: "r2", type: "row", title: "Request a feature", icon: require("../../../assets/new-images/settings-icons/request-feature.png") },
    { id: "r3", type: "row", title: "Leave a review", icon: require("../../../assets/new-images/settings-icons/leave-review.png") },
    { id: "r4", type: "row", title: "Share this app with a friend", icon: require("../../../assets/new-images/settings-icons/share-app.png") },

    { id: "h2", type: "header", title: "Account" },
    { id: "r5", type: "row", title: "Personal information", icon: require("../../../assets/new-images/settings-icons/personal-information.png") },
    { id: "r6", type: "row", title: "Login & Security", icon: require("../../../assets/new-images/settings-icons/login-security.png") },
    { id: "r7", type: "row", title: "Notifications", icon: require("../../../assets/new-images/settings-icons/notifications.png") },
    { id: "r8", type: "row", title: "Manage subscription", icon: require("../../../assets/new-images/settings-icons/manage-subscription.png") },

    { id: "h3", type: "header", title: "Legal" },
    { id: "r9", type: "row", title: "Terms of use", icon: require("../../../assets/new-images/settings-icons/terms-of-use.png") },
    { id: "r10", type: "row", title: "Privacy policy", icon: require("../../../assets/new-images/settings-icons/privacy-policy.png") },
    { id: "r11", type: "row", title: "Logout", icon: require("../../../assets/new-images/settings-icons/logout.png") },
  ];

  const BlackSettingsList = () => {

    const onPressOption = async (item, index) => {
      console.log('item', item);
      console.log('item.title.lowercase()', item.title.toLowerCase());
      
      if (item.id === "r1") {
        router.push('/profile/founder')
      } else if (item.id === "r2") {
        //Request a feature
        Linking.openURL('https://unbound.featurebase.app/');
      } else if (item.id === "r3") {
        try {
          if (await StoreReview.hasAction()) {
            await StoreReview.requestReview();
          }
        } catch (error) {
          console.error("Error requesting review:", error);
        }
      } else if (item.id === "r4") {
        router.push('/profile/share')
      } else if (item.id === "r5") {
        //Personal information
        router.push('/profile/personal-info')
      } else if (item.id === "r6") {
        //Login & Security
        router.push('/profile/login-security')
      } else if (item.id === "r7") {
        router.push('/profile/notification')
      } else if (item.id === "r8") {
        //Manage subscription
        router.push('/profile/manage-subscription')
      } else if (item.id === "r9") {
        router.push('/profile/terms-of-use')
      } else if (item.id === "r10") {
        router.push('/profile/privacy-policy')
      } else if (item.id === "r11") {
        setShowAlert(true);
      }
    }

    const renderItem = ({ item, index }: { item: Row }) => {
      if (item.type === "header") {
        return (
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.3)",
              fontSize: scale(14),
              fontFamily: "ZillaSlab-SemiBold",
              marginHorizontal: scale(24),
              marginVertical: scale(24),
              letterSpacing: 0.5,
            }}
          >
            {item.title}
          </Text>
        );
      }

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onPressOption(item, index)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: scale(24),
            marginTop: item.title === "Logout" ? scale(24) : 0,
            marginBottom: index === DATA?.length - 1 ? 0 : scale(24)
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginRight: scale(10),
            }}
          >
            <Image
              source={item.icon}
              style={{
                width: scale(24),
                height: scale(24),
              }}
            />
          </View>

          <Text
            style={{
              flex: 1,
              color: item.title === "Logout" ? "#FF4444" : "rgba(255, 255, 255, 1)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Medium",
              letterSpacing: 0.5,
            }}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <Image
            source={require("../../../assets/new-images/right-arrow-white.png")}
            style={{
              width: scale(24),
              height: scale(24),
            }}
          />
        </TouchableOpacity>
      );
    };

    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: "rgba(0,0,0,0.5)", 
        marginTop: scale(24),
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}>
        <FlatList
          data={DATA}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: scale(24) }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        />
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

      <Text style={[styles.slogan, { marginTop: insets.top + scaleVertical(16) }]}>Jordan Peterson</Text>
      <BlackSettingsList />

      {showAlert && 
        <BlurView style={styles.alertContainer} tint={'dark'} intensity={100}>
          <View style={styles.alertView}>
            <View style={styles.dangerView}>
              <Image
              source={require("../../../assets/new-images/trouble-login.png")}
              // resizeMode={"center"}
              style={styles.cautionImage}
              />
              <Text style={styles.incorrectCode}>{"Ready to head out?"}</Text>            
              <Text style={styles.incorrectCodeDesc}>{"You’ll be logged out from your journey,\nbut your progress is safe."}</Text>            

              <TouchableOpacity
                style={[
                  styles.retryBtn,
                ]}
                onPress={() => {
                  setShowAlert(false);
                }}
                activeOpacity={0.9}
              >
                <Text style={styles.retryText}>{"Cancel"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.resendBtn,
                ]}
                onPress={() => {
                  logout();
                }}
                activeOpacity={0.9}
              >
                <Text style={styles.resendText}>{"Logout"}</Text>
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
    backgroundColor: "#000" 
  },
  image: { position: "absolute", width: "100%", height: width * 0.939 },
  overlayImage: { position: "absolute", width: "100%", height: "95%" },
  slogan: {
    color: "#FFF",
    marginHorizontal: scale(24),
    fontSize: scale(24),
    fontFamily: "ZillaSlab-SemiBold",
    textAlign: 'center',
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
  dangerView: {
    marginTop: scale(24),
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
    marginTop: scaleVertical(20),
    color: "#000",
    fontSize: scale(20),
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
  },
  incorrectCodeDesc: {
    marginTop: scaleVertical(20),
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

export default ProfileScreen;

// import { ScreenContainer } from "@/components/ui/ScreenContainer";
// import { SPACING } from "@/constants/theme";
// import { useAuth } from "@/contexts/AuthContext";
// import { supabase } from "@/lib/supabaseClient";
// import { sendTestNotification } from "@/utils/notifications";
// import { Feather, MaterialIcons } from "@expo/vector-icons";
// import * as Notifications from 'expo-notifications';
// import { useRouter } from "expo-router";
// import * as StoreReview from 'expo-store-review';
// import React, { useEffect, useRef, useState } from "react";
// import { Alert, Animated, ImageBackground, Linking, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import FounderModal from "../../components/FounderModal";

// type AccountItem = {
//   label: string;
//   icon: React.ReactNode;
//   action?: string;
//   route?: string;
// };
// const ACCOUNT: AccountItem[] = [
//   {
//     label: "Terms of Use",
//     icon: <Feather name="file-text" size={24} color="#564110" style={{ marginRight: 16 }} />,
//     action: "terms",
//   },
//   {
//     label: "Privacy Policy",
//     icon: <Feather name="lock" size={24} color="#564110" style={{ marginRight: 16 }} />,
//     action: "privacy",
//   },
//   {
//     label: "Weekly Summary Notifications",
//     icon: <Feather name="bar-chart-2" size={24} color="#564110" style={{ marginRight: 16 }} />,
//     action: "weeklyNotifications",
//   },
// ];

// type CommunityItem = {
//   label: string;
//   icon: React.ReactNode;
//   action?: string;
//   route?: string;
// };
// const COMMUNITY: CommunityItem[] = [
//   {
//     label: "Talk with the Founder",
//     icon: <MaterialIcons name="message" size={24} color="#564110" style={{ marginRight: 16 }} />,
//     route: "/profile/founder",
//   },
//   {
//     label: "Leave a review",
//     icon: <Feather name="star" size={24} color="#564110" style={{ marginRight: 16 }} />,
//     action: "review",
//   },
//   {
//     label: "Refer a friend",
//     icon: <Feather name="send" size={24} color="#564110" style={{ marginRight: 16 }} />,
//     action: "refer",
//   },
// ];

// export default function ProfileScreen() {
//   const router = useRouter();
//   const { logout, user } = useAuth();
//   const [founderModalVisible, setFounderModalVisible] = useState(false);
//   const [weeklyNotificationsEnabled, setWeeklyNotificationsEnabled] = useState(true);
//   const pressTimer = useRef<NodeJS.Timeout | null>(null);
//   const animatedValue = useRef(new Animated.Value(1)).current;

//   // Load user's notification preferences
//   useEffect(() => {
//     const loadNotificationPreferences = async () => {
//       if (!user?.id) return;
      
//       try {
//         const { data, error } = await supabase
//           .from('user_profiles')
//           .select('notification_preferences')
//           .eq('user_id', user.id)
//           .single();
        
//         if (!error && data?.notification_preferences) {
//           setWeeklyNotificationsEnabled(data.notification_preferences.weekly_summary ?? true);
//         }
//       } catch (error) {
//         console.error('Error loading notification preferences:', error);
//       }
//     };
    
//     loadNotificationPreferences();
//   }, [user?.id]);

//   const handlePressIn = () => {
//     Animated.timing(animatedValue, {
//       toValue: 0.5,
//       duration: 150,
//       useNativeDriver: true,
//     }).start();

//     pressTimer.current = setTimeout(() => {
//       Alert.alert("🎉 Founder Mode Activated");
//       setFounderModalVisible(true);
//     }, 5000); // 5 seconds
//   };

//   const handlePressOut = () => {
//     Animated.timing(animatedValue, {
//       toValue: 1,
//       duration: 150,
//       useNativeDriver: true,
//     }).start();

//     if (pressTimer.current) {
//       clearTimeout(pressTimer.current);
//     }
//   };

//   const handleAccountPress = async (item: typeof ACCOUNT[0]) => {
//     if (item?.route) {
//       router.push(item.route);
//     }
//     if (item.action === "terms") {
//       try {
//         await Linking.openURL("https://www.unboundapp.live/terms-of-use");
//       } catch (error) {
//         console.error("Error opening terms:", error);
//       }
//     }
//     if (item.action === "privacy") {
//       try {
//         await Linking.openURL("https://www.unboundapp.live/privacy-policy");
//       } catch (error) {
//         console.error("Error opening privacy policy:", error);
//       }
//     }
//     if (item.action === "notifications") {
//       try {
//         if (Platform.OS === 'ios') {
//           await Linking.openURL('app-settings:');
//         } else {
//           await Linking.openSettings();
//         }
//       } catch (error) {
//         console.error("Error opening settings:", error);
//       }
//     }
//     if (item.action === "testNotification") {
//       try {
//         await sendTestNotification();
//         Alert.alert("Test Notification", "Local notification sent! Check if you received it.");
//       } catch (error) {
//         console.error("Error sending test notification:", error);
//         Alert.alert("Error", "Failed to send test notification.");
//       }
//     }
//     if (item.action === "weeklyNotifications") {
//       const newValue = !weeklyNotificationsEnabled;

//       // If user is trying to ENABLE notifications, check for permission first
//       if (newValue === true) {
//         const { status } = await Notifications.getPermissionsAsync();
//         if (status !== 'granted') {
//           Alert.alert(
//             'Enable Notifications',
//             'To receive weekly summaries, please enable push notifications for Unbound in your phone\'s settings.',
//             [
//               { text: 'Cancel', style: 'cancel' },
//               { text: 'Open Settings', onPress: () => Linking.openSettings() },
//             ]
//           );
//           return; // Don't update the toggle state or database
//         }
//       }

//       // If we're here, either they are disabling notifications, or they have permission
//       setWeeklyNotificationsEnabled(newValue);
      
//       // Update in database
//       if (user?.id) {
//         supabase
//           .from('user_profiles')
//           .update({ 
//             notification_preferences: { weekly_summary: newValue }
//           })
//           .eq('user_id', user.id)
//           .then(({ error }) => {
//             if (error) {
//               console.error('Error updating notification preferences:', error);
//               Alert.alert('Error', 'Failed to update notification preferences');
//               setWeeklyNotificationsEnabled(!newValue); // Revert on error
//             } else {
//               Alert.alert(
//                 'Updated', 
//                 `Weekly summary notifications ${newValue ? 'enabled' : 'disabled'}`
//               );
//             }
//           });
//       }
//     }
//   };

//   const handleCommunityPress = async (item: typeof COMMUNITY[0]) => {
//     if (item?.route) {
//       router.push(item.route);
//     }
//     if (item.action === "review") {
//       try {
//         if (await StoreReview.hasAction()) {
//           await StoreReview.requestReview();
//         }
//       } catch (error) {
//         console.error("Error requesting review:", error);
//       }
//     }
//     if (item.action === "refer") {
//       try {
//         await Share.share({
//           message: "Check out Unbound, the app that helps you reclaim your focus: https://www.unboundapp.live/",
//         });
//       } catch (error) {
//         console.error("Error sharing:", error);
//       }
//     }
//     if (item.action === "testNotification") {
//       try {
//         await sendTestNotification();
//         Alert.alert("Test Notification", "Local notification sent! Check if you received it.");
//       } catch (error) {
//         console.error("Error sending test notification:", error);
//         Alert.alert("Error", "Failed to send test notification.");
//       }
//     }
//   };

//   return (
//     <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg}>
//       <ScreenContainer style={{ backgroundColor: 'transparent', paddingHorizontal: 0, paddingTop: 0 }}>
//         <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//           <Text style={styles.header} numberOfLines={1}>Profile</Text>
//           <Text style={styles.sectionTitle} numberOfLines={1}>Community</Text>
//           {COMMUNITY.map((item) => (
//             <TouchableOpacity
//               key={item.label}
//               style={styles.menuCard}
//               onPress={() => handleCommunityPress(item)}
//               onPressIn={item.action === "refer" ? handlePressIn : undefined}
//               onPressOut={item.action === "refer" ? handlePressOut : undefined}
//             >
//               {item.icon}
//               <Text style={styles.menuLabel} numberOfLines={1}>{item.label}</Text>
//               <Feather name="chevron-right" size={22} color="#564110" style={{ marginLeft: "auto" }} />
//             </TouchableOpacity>
//           ))}
//           <Text style={styles.sectionTitle} numberOfLines={1}>Account</Text>
//           {ACCOUNT.map((item) => (
//             <TouchableOpacity 
//               key={item.label} 
//               style={styles.menuCard} 
//               onPress={() => handleAccountPress(item)}
//               activeOpacity={item.action === "weeklyNotifications" ? 1 : 0.2}
//             >
//               <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
//                 {item.icon}
//                 <Text style={styles.menuLabel} numberOfLines={1}>{item.label}</Text>
//               </View>
              
//               {item.action === "weeklyNotifications" ? (
//                 <View style={[styles.toggle, weeklyNotificationsEnabled && styles.toggleActive]}>
//                   <Animated.View style={[styles.toggleThumb, weeklyNotificationsEnabled && styles.toggleThumbActive]} />
//                 </View>
//               ) : (
//                 <Feather name="chevron-right" size={22} color="#564110" />
//               )}
//             </TouchableOpacity>
//           ))}
//           <TouchableOpacity style={styles.logoutButton} onPress={logout}>
//             <Text style={styles.logoutText} numberOfLines={1}>Log Out</Text>
//           </TouchableOpacity>
//         </ScrollView>
//         <FounderModal visible={founderModalVisible} onClose={() => setFounderModalVisible(false)} />
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
//   scrollContent: {
//     padding: 0,
//     paddingBottom: 32,
//   },
//   header: {
//     fontSize: 35,
//     fontFamily: "Vollkorn-Bold",
//     color: "#2C1A05",
//     top: SPACING.xl,
//     marginTop: SPACING.xl,
//     marginBottom: SPACING.xl * 1.35,
//     textAlign: "left",
//     marginLeft: 24,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontFamily: "Vollkorn-Bold",
//     color: "#2C1A05",
//     marginBottom: SPACING.md,
//     marginLeft: 24,
//     textAlign: "left",
//   },
//   menuCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#F9E7B0",
//     borderRadius: SPACING.md,
//     borderWidth: 1.5,
//     borderColor: "#E6D3A7",
//     paddingVertical: SPACING.md,
//     paddingHorizontal: SPACING.lg,
//     marginHorizontal: SPACING.md,
//     marginBottom: SPACING.md,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   menuLabel: {
//     fontSize: 18,
//     fontFamily: "Vollkorn-SemiBold",
//     color: "#2C1A05",
//     marginLeft: 8,
//     flexShrink: 1,
//   },
//   logoutButton: {
//     backgroundColor: "#4B3415",
//     borderRadius: SPACING.md,
//     paddingVertical: SPACING.md,
//     alignItems: "center",
//     marginTop: SPACING.md,
//     marginHorizontal: 24,
//   },
//   logoutText: {
//     color: "#fff",
//     fontFamily: "Vollkorn-SemiBold",
//     fontSize: 18,
//   },
//   toggle: {
//     width: 50,
//     height: 30,
//     borderRadius: 15,
//     borderWidth: 1.5,
//     borderColor: "#564110",
//     backgroundColor: "#E6D3A7",
//     justifyContent: "center",
//     padding: 2,
//   },
//   toggleActive: {
//     backgroundColor: "#265C28",
//     borderColor: "#265C28",
//   },
//   toggleThumb: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: "#fff",
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   toggleThumbActive: {
//     transform: [{ translateX: 20 }],
//   },
// });
