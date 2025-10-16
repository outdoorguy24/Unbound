import { scale, scaleVertical } from "@/constants/Scale";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const DeleteAccountScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      Alert.alert("Error", "No user found");
      return;
    }

    setIsDeleting(true);
    setShowAlert(false);

    try {
      // Check if this is a mock user
      const isMockUser = user.id.length > 10; // Mock UUIDs are longer
      
      if (isMockUser) {
        // For mock users, just show success message
        Alert.alert(
          "Account Deleted",
          "Your mock account has been deleted successfully.",
          [
            {
              text: "OK",
              onPress: () => {
                // Navigate to login screen
                router.replace("/(auth)/login");
              }
            }
          ]
        );
      } else {
        // For real users, call the Supabase Edge Function
        try {
          const { data, error } = await supabase.functions.invoke('delete-account', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (error) {
            console.error('Error deleting account:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            
            // Check if it's a function not found error
            if (error.message?.includes('Function not found') || error.message?.includes('non-2xx')) {
              Alert.alert(
                "Function Not Available",
                "The account deletion service is temporarily unavailable. Please contact support to delete your account.",
                [{ text: "OK" }]
              );
            } else {
              Alert.alert(
                "Error",
                `Failed to delete account: ${error.message || 'Unknown error'}. Please try again or contact support.`,
                [{ text: "OK" }]
              );
            }
          } else if (data?.success) {
            Alert.alert(
              "Account Deleted",
              "Your account and all associated data have been permanently deleted.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    // Navigate to login screen
                    router.replace("/(auth)/login");
                  }
                }
              ]
            );
          } else {
            Alert.alert(
              "Error",
              data?.error || "Failed to delete account. Please try again.",
              [{ text: "OK" }]
            );
          }
        } catch (functionError) {
          console.error('Function call error:', functionError);
          Alert.alert(
            "Service Unavailable",
            "The account deletion service is temporarily unavailable. Please contact support to delete your account.",
            [{ text: "OK" }]
          );
        }
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again or contact support.",
        [{ text: "OK" }]
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View style={styles.safe}>
      <Image
        source={require("../../assets/new-images/delete-bg.png")}
        style={styles.image}
      />
      <Image
        source={require("../../assets/new-images/delete-bg-overlay.png")}
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
                <Text style={styles.screenTitle}>{"Delete account"}</Text>
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
                <Text style={styles.slogan}>{"We’re sorry to see you go."}</Text>
                <Text style={styles.inviteText}>{"Your journey’s just getting started. Are sure you want to leave the trail?"}</Text>
            </View>
          </View>

        <View style={{
          marginHorizontal: scale(24),
          marginBottom: insets.bottom + scaleVertical(16),
        }}>
          <TouchableOpacity
            style={[
              styles.primaryBtn,
            ]}
            onPress={() => router.back()}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryText}>{"No, do not delete"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[{
              flexDirection: "row",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#FD4949",
              marginTop: scaleVertical(16),
              marginBottom: scaleVertical(16)
            }]}
            activeOpacity={0.8}
            onPress={() => setShowAlert(true)}
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
                  color: "#FD4949",
                  fontSize: scale(18),
                  fontFamily: "ZillaSlab-SemiBold",
                  letterSpacing: 0,
                  paddingVertical: scaleVertical(18),
                }]}>
                  {"Delete account and all data"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {showAlert && 
          <BlurView style={styles.alertContainer} tint={'dark'} intensity={100}>
            <View style={styles.alertView}>
              <TouchableOpacity style={styles.btnClose} onPress={() => setShowAlert(false)}>
                <Image
                  source={require("../../assets/new-images/icon-close-black.png")}
                  style={{
                    height: scale(24),
                    width: scale(24),
                  }}
                />
              </TouchableOpacity>
              <View style={styles.dangerView}>
                <Image
                source={require("../../assets/new-images/icon-delete-account-popup.png")}
                style={styles.cautionImage}
                />
                <Text style={styles.incorrectCode}>{"Delete your account and all data"}</Text>            
                <Text style={styles.incorrectCodeDesc}>{"This will permanently delete your account, progress, and all saved data. There’s no way back from here."}</Text>            
  
                <TouchableOpacity
                  style={[
                    styles.retryBtn,
                    isDeleting && { opacity: 0.6 }
                  ]}
                  activeOpacity={0.9}
                  onPress={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <ActivityIndicator color="#FFFFFF" size="small" style={{ marginRight: scale(8) }} />
                      <Text style={styles.retryText}>{"Deleting..."}</Text>
                    </View>
                  ) : (
                    <Text style={styles.retryText}>{"Delete account"}</Text>
                  )}
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={[
                    styles.resendBtn,
                    isDeleting && { opacity: 0.6 }
                  ]}
                  onPress={() => {
                    setShowAlert(false);
                  }}
                  activeOpacity={0.9}
                  disabled={isDeleting}
                >
                  <Text style={styles.resendText}>{"Cancel"}</Text>
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
  screenTitle: {
    position: 'absolute',
    color: "#FFF",
    fontSize: scale(22),
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
    width: '100%',
    textAlign: 'center',
  },
  slogan: {
    color: "#FFF",
    fontSize: scale(32),
    fontFamily: "ZillaSlab-Regular",
    width: '100%',
    marginTop: scaleVertical(40),
  },
  inviteText: {
    color: "#FF8500",
    lineHeight: scale(29),
    fontSize: scale(24),
    fontFamily: "ZillaSlab-SemiBold",
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
    marginTop: scaleVertical(16)
  },
  dangerView: {
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: scaleVertical(24),
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

export default DeleteAccountScreen;