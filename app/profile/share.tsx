import { scale, scaleVertical } from "@/constants/Scale";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Clipboard,
  Dimensions,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ShareScreen = () => {
  const insets = useSafeAreaInsets();

  const handleCopyLink = () => {
    try {
      const appStoreLink = "https://apps.apple.com/app/unbound/id123456789"; // Placeholder link
      Clipboard.setString(appStoreLink);
      Alert.alert("Link Copied!", "The app store link has been copied to your clipboard.");
    } catch (error) {
      console.error("Error copying link:", error);
      Alert.alert("Error", "Failed to copy link to clipboard.");
    }
  };
  
  return (
    <View style={styles.safe}>
      <Image
        source={require("../../assets/new-images/share-screen-bg.png")}
        style={styles.image}
      />
      <Image
        source={require("../../assets/new-images/share-screen-bg-overlay.png")}
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
        </View>

        <View style={{
          marginHorizontal: scale(24),
          marginBottom: insets.bottom + scaleVertical(16),
        }}>
          <Text style={styles.slogan}>{"Dudes helping dudes. You love to see it."}</Text>
          <Text style={styles.inviteText}>{"Invite a friend to join the movement."}</Text>

          <TouchableOpacity
            style={[
              styles.primaryBtn,
            ]}
            onPress={async () => {
              try {
                await Share.share({
                  message: "Check out Unbound, the app that helps you reclaim your focus: https://www.unboundapp.live/",
                });
              } catch (error) {
                console.error("Error sharing:", error);
              }
            }}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryText}>{"Share via text"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[{
              flexDirection: "row",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.2)",
              marginTop: scaleVertical(16),
              marginBottom: scaleVertical(16)
            }]}
            activeOpacity={0.8}
            onPress={handleCopyLink}
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
                  {"Copy the link"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
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
    height: width * 1.38,
  },
  overlayImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
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
  headerView: {
    width: '100%',
    paddingHorizontal: scale(24),
  },

  slogan: {
    color: "#FFF",
    fontSize: scale(18),
    fontFamily: "ZillaSlab-Regular",
    width: '100%',
  },
  inviteText: {
    color: "#FF8500",
    fontSize: scale(40),
    fontFamily: "ZillaSlab-Bold",
    width: '100%',
    marginTop: scaleVertical(20),
    marginBottom: scaleVertical(45)
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
});

export default ShareScreen;