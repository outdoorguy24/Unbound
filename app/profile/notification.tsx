import { scale, scaleVertical } from "@/constants/Scale";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import * as Notifications from 'expo-notifications';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    Linking,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");

const NotificationScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [weeklyNotificationsEnabled, setWeeklyNotificationsEnabled] = useState(true);

  // Load user's notification preferences
  useEffect(() => {
    const loadNotificationPreferences = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('notification_preferences')
          .eq('user_id', user.id)
          .single();
        
        if (!error && data?.notification_preferences) {
          setWeeklyNotificationsEnabled(data.notification_preferences.weekly_summary ?? true);
        }
      } catch (error) {
        console.error('Error loading notification preferences:', error);
      }
    };
    
    loadNotificationPreferences();
  }, [user?.id]);

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
            <Text style={styles.slogan}>{"Notifications"}</Text>
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
        
        <View style={styles.content}>
          <Text style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: scale(18),
            fontFamily: "ZillaSlab-Regular",
            letterSpacing: 0.5,
            marginTop: scaleVertical(8),
            lineHeight: scale(26),
          }}>
            <Text style={{ fontFamily: "ZillaSlab-SemiBold" }}>
              {"This app is about spending less time on your phone and more time building the life you want. "}
            </Text>
            {"With that in mind, the only notification we send is a simple yet powerful recap every Sunday evening to help you stay motivated and on track. We recommend turning it on but that's up to you."}
          </Text>
          
          
          <View>
            <View style={styles.unboundToggleView}>
              <Text style={[
                styles.label3, 
              ]}>Weekly Recap</Text>
              <Switch value={weeklyNotificationsEnabled} onValueChange={async (value) => {
                  const newValue = !weeklyNotificationsEnabled;

                  // If user is trying to ENABLE notifications, check for permission first
                  if (newValue === true) {
                    const { status } = await Notifications.getPermissionsAsync();
                    if (status !== 'granted') {
                      Alert.alert(
                        'Enable Notifications',
                        'To receive weekly summaries, please enable push notifications for Unbound in your phone\'s settings.',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Open Settings', onPress: () => Linking.openSettings() },
                        ]
                      );
                      return; // Don't update the toggle state or database
                    }
                  }

                  // If we're here, either they are disabling notifications, or they have permission
                  setWeeklyNotificationsEnabled(newValue);
                  
                  // Update in database
                  if (user?.id) {
                    supabase
                      .from('user_profiles')
                      .update({ 
                        notification_preferences: { weekly_summary: newValue }
                      })
                      .eq('user_id', user.id)
                      .then(({ error }) => {
                        if (error) {
                          console.error('Error updating notification preferences:', error);
                          Alert.alert('Error', 'Failed to update notification preferences');
                          setWeeklyNotificationsEnabled(!newValue); // Revert on error
                        } else {
                          Alert.alert(
                            'Updated', 
                            `Weekly summary notifications ${newValue ? 'enabled' : 'disabled'}`
                          );
                        }
                      });
                  }
                }}         
                ios_backgroundColor={'rgba(255, 255, 255, 0.2)'}
                trackColor={{ false: "#67CE67", true: "#67CE67" }}
                thumbColor={weeklyNotificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
                />
            </View>
            <Text style={[
                styles.label, 
              ]}>{'A weekly report to track\nimprovements and patterns.'}</Text>
          </View>
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
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: scale(24),
    marginTop: scaleVertical(24),
  },
  keyboard: {
    flex: 1,
    width: '100%',
    paddingHorizontal: scale(16),
    marginTop: scaleVertical(55),
  },

  label: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    marginTop: scaleVertical(6),
    marginBottom: scaleVertical(24),
  },
  label3: {
    color: "#FFFFFF",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    flex: 1,
  },
  unboundToggleView: {
    width: '100%',
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: scaleVertical(24),
  },
});

export default NotificationScreen;