import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { scale, scaleVertical } from "@/constants/Scale";
import { ScreenTimeManager } from "@/lib/ScreenTime";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ManagePermissionsScreen = () => {
  const insets = useSafeAreaInsets();
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'not-determined' | 'loading'>('loading');

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      setPermissionStatus('loading');
      // Check Screen Time permission status
      const isGranted = await ScreenTimeManager.isAuthorized();
      setPermissionStatus(isGranted ? 'granted' : 'denied');
    } catch (error) {
      console.error('Error checking permission status:', error);
      setPermissionStatus('denied');
    }
  };

  const handlePermissionTap = () => {
    Alert.alert(
      "Screen Time Permission",
      "To manage Screen Time permissions, you'll be taken to your device settings.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Open Settings",
          onPress: () => {
            Linking.openSettings();
          }
        }
      ]
    );
  };

  const getStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'On';
      case 'denied':
        return 'Off';
      case 'not-determined':
        return 'Not Set';
      case 'loading':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    switch (permissionStatus) {
      case 'granted':
        return '#67CE67'; // Green
      case 'denied':
        return '#FF4444'; // Red
      case 'not-determined':
        return '#FFA500'; // Orange
      case 'loading':
        return '#888888'; // Gray
      default:
        return '#888888';
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
        <View style={styles.headerView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.slogan}>{"Manage Permissions"}</Text>
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
          style={[styles.keyboard, {marginTop: scaleVertical(16), marginBottom: insets.bottom + scaleVertical(16)}]}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Screen Time Permission */}
          <View style={styles.permissionCard}>
            <View style={styles.permissionHeader}>
              <View style={styles.permissionIconContainer}>
                <Image
                  source={require("../../assets/new-images/manage-permissions.png")}
                  style={styles.permissionIcon}
                />
              </View>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionTitle}>Screen Time & Family Controls</Text>
                <Text style={styles.permissionDescription}>
                  Allows the app to block distracting apps and track your screen time usage
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.permissionStatusContainer}
              onPress={handlePermissionTap}
              activeOpacity={0.7}
            >
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}>
                <Text style={styles.statusText}>{getStatusText()}</Text>
              </View>
              <Image
                source={require("../../assets/new-images/right-arrow-white.png")}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Help Text */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpTitle}>Why is this permission needed?</Text>
            <Text style={styles.helpText}>
              Screen Time & Family Controls permission is essential for Unbound to help you stay focused by blocking distracting apps during your focus sessions.
            </Text>
            <Text style={styles.helpText}>
              Without this permission, the app cannot effectively help you manage your screen time.
            </Text>
          </View>
        </ScrollView>
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
  keyboard: {
    flex: 1,
    width: '100%',
    paddingHorizontal: scale(24),
    paddingTop: scaleVertical(45),
  },
  permissionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: scale(20),
    marginBottom: scale(20),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scale(16),
  },
  permissionIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  permissionIcon: {
    height: scale(24),
    width: scale(24),
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    color: "#FFFFFF",
    fontSize: scale(18),
    fontFamily: "ZillaSlab-SemiBold",
    marginBottom: scale(4),
  },
  permissionDescription: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: scale(14),
    fontFamily: "ZillaSlab-Medium",
    lineHeight: scale(20),
  },
  permissionStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: scale(16),
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  statusIndicator: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    minWidth: scale(80),
    alignItems: 'center',
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: scale(14),
    fontFamily: "ZillaSlab-SemiBold",
  },
  arrowIcon: {
    height: scale(20),
    width: scale(20),
  },
  helpContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: scale(20),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  helpTitle: {
    color: "#FFFFFF",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-SemiBold",
    marginBottom: scale(12),
  },
  helpText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: scale(14),
    fontFamily: "ZillaSlab-Medium",
    lineHeight: scale(20),
    marginBottom: scale(8),
  },
});

export default ManagePermissionsScreen;
