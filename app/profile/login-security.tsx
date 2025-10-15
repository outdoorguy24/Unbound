import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    Keyboard,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import { scale, scaleVertical } from "@/constants/Scale";
import { useAuth } from "@/contexts/AuthContext";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const LoginSecurityScreen = () => {
  const insets = useSafeAreaInsets();
  const { user, updatePassword } = useAuth();
  const [toggle, setToggle] = useState(false);

  // Password editing state
  const [isEditPassword, setIsEditPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user signed up with email/password (not OAuth)
  // We'll check if the user has an email and assume they can change password
  // In a production app, you'd check user.app_metadata.provider or user.identities
  const isEmailPasswordUser = !!user?.email;
  
  // Debug logging
  console.log('Login Security - User:', user);
  console.log('Login Security - isEmailPasswordUser:', isEmailPasswordUser);

  const handleEditPassword = () => {
    setIsEditPassword(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleCancelPassword = () => {
    setIsEditPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(newPassword);
      Alert.alert("Success", "Password updated successfully");
      handleCancelPassword();
    } catch (error: any) {
      console.error("Password update error:", error);
      Alert.alert("Error", error.message || "Failed to update password");
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
        <View
          style={styles.headerView}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.slogan}>{"Login & Security"}</Text>
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

          {/* Full name field */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: scaleVertical(4),
          }}>
            <Image
              source={require("../../assets/new-images/manage-permissions.png")}
              style={{
                height: scale(24),
                width: scale(24),
                marginRight: scale(10)
              }}
            />
            <Text style={{
                color: "rgba(255, 255, 255, 1)",
                fontSize: scale(16),
                fontFamily: "ZillaSlab-SemiBold",
                letterSpacing: 0.5,
                flex: 1,
            }}>
              {"Manage permissions"}
            </Text>
            

            <TouchableOpacity onPress={() => router.push('/profile/manage-permissions')}>  
              <Image
                source={require("../../assets/new-images/right-arrow-white.png")}
                style={{
                  height: scale(24),
                  width: scale(24),
                }}
              />
            </TouchableOpacity>

          </View>
          
          <View style={{
            width: "100%",
            height: 1, 
            backgroundColor: "#D9D9D9", 
            opacity: 0.15,
            marginVertical: scaleVertical(24),
          }} />

          {/* Password field */}
          <Text style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-SemiBold",
              letterSpacing: 0.5,
          }}>
            {"Password"}
          </Text>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: scaleVertical(4),
          }}>
            <Text style={{
                color: "rgba(255, 255, 255, 1)",
                fontSize: scale(20),
                fontFamily: "ZillaSlab-SemiBold",
                letterSpacing: 0.5,
                flex: 1,
            }}>
              {"●●●●●●●●●●●●●"}
            </Text>

            {isEmailPasswordUser && (
              <TouchableOpacity onPress={handleEditPassword}>  
                <Image
                  source={require("../../assets/new-images/icon-edit-pen.png")}
                  style={{
                    height: scale(24),
                    width: scale(24),
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={{
            width: "100%",
            height: 1, 
            backgroundColor: "#D9D9D9", 
            opacity: 0.15,
            marginVertical: scaleVertical(24),
          }} />

          {/* Face Id field */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Image
              source={require("../../assets/new-images/login-face-id.png")}
              style={{
                height: scale(24),
                width: scale(24),
                marginRight: scale(10)
              }}
            />

            <Text style={{
              color: "rgba(255, 255, 255, 1)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-SemiBold",
              letterSpacing: 0.5,
              flex: 1,
            }}>
              {"Face ID"}
            </Text>

            <Switch value={toggle} onValueChange={(value) => setToggle(value)}         
              ios_backgroundColor={'rgba(255, 255, 255, 0.2)'}
              trackColor={{ false: "#67CE67", true: "#67CE67" }}
              thumbColor={toggle ? "#f4f3f4" : "#f4f3f4"}
              />
          </View>

        </ScrollView>
        <TouchableOpacity
          style={[
            styles.secondaryBtn,
            {
              marginHorizontal: scale(24),
              marginBottom: insets.bottom + scaleVertical(16),
              // backgroundColor: 'red'
            }
          ]}
          onPress={() => {
            router.push('/profile/delete-account')
          }}
          activeOpacity={0.9}
        >
          <Image
            source={require("../../assets/new-images/icon-delete-account.png")}
            style={{
              height: scale(24),
              width: scale(24),
              marginRight: scale(10)
            }}
          />
          <Text style={styles.secondaryText}>{"Delete your account"}</Text>
        </TouchableOpacity>
      </View>

      {/* Password Edit Modal */}
      <Modal
        visible={isEditPassword}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelPassword}
      >
        <BlurView intensity={20} style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Change Password</Text>
                  
                  {/* New Password Field */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>New Password</Text>
                    <View style={styles.passwordInputContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Enter new password"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showNewPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        style={styles.eyeButton}
                      >
                        <Text style={styles.eyeButtonText}>
                          {showNewPassword ? "Hide" : "Show"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Confirm Password Field */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Confirm New Password</Text>
                    <View style={styles.passwordInputContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm new password"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.eyeButton}
                      >
                        <Text style={styles.eyeButtonText}>
                          {showConfirmPassword ? "Hide" : "Show"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Buttons */}
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={handleCancelPassword}
                      disabled={isLoading}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        styles.saveButton,
                        (!newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8) && styles.disabledButton
                      ]}
                      onPress={handleUpdatePassword}
                      disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8}
                    >
                      <Text style={styles.saveButtonText}>
                        {isLoading ? "Updating..." : "Update Password"}
                      </Text>
                    </TouchableOpacity>
                  </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
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
    paddingHorizontal: scale(24),
    paddingTop: scaleVertical(45),
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
    flexDirection: 'row'
  },
  secondaryText: {
    color: "#F44",
    fontSize: scale(16),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: scale(24),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: scale(20),
    fontFamily: "ZillaSlab-SemiBold",
    textAlign: "center",
    marginBottom: scale(24),
  },
  inputContainer: {
    marginBottom: scale(20),
  },
  inputLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: scale(14),
    fontFamily: "ZillaSlab-Medium",
    marginBottom: scale(8),
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  passwordInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
  },
  eyeButton: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
  eyeButtonText: {
    color: "#FFFFFF",
    fontSize: scale(14),
    fontFamily: "ZillaSlab-Medium",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scale(8),
  },
  modalButton: {
    flex: 1,
    paddingVertical: scale(12),
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: scale(4),
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  saveButton: {
    backgroundColor: "#FF6B35",
  },
  disabledButton: {
    backgroundColor: "rgba(255, 107, 53, 0.3)",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-SemiBold",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-SemiBold",
  },
});

export default LoginSecurityScreen;