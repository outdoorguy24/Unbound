import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";

import { scale, scaleVertical } from "@/constants/Scale";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const PersonalInformationScreen = () => {
  const insets = useSafeAreaInsets();
  const { user, setUser } = useAuth();

  const [isEditName, setIsEditName] = useState(false);
  const [isEditLocation, setIsEditLocation] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Check if this is a mock user
        const isMockUser = user.id.length <= 10;
        
        if (isMockUser) {
          // For mock users, use the name from AuthContext
          setName(user.name || "John Muir");
          setLocation("Denver, CO"); // Mock location
          setUserProfile({ first_name: user.name || "John Muir", city: "Denver, CO" });
        } else {
          // For real users, fetch from Supabase
          const { data, error } = await supabase
            .from('user_profiles')
            .select('first_name, city')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error loading user profile:', error);
            setName("John Muir"); // Fallback
            setLocation("No location set");
          } else if (data) {
            setName(data.first_name || "John Muir");
            setLocation(data.city || "No location set");
            setUserProfile(data);
          } else {
            setName("John Muir"); // Fallback
            setLocation("No location set");
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setName("John Muir"); // Fallback
        setLocation("No location set");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user?.id, user?.name]);

  const handleEdit = () => {
    setIsEditName(true);
  };

  const handleEditLocation = () => {
    setIsEditLocation(true);
  };

  const handleCancel = () => {
    setIsEditName(false);
    setName(userProfile?.first_name || user?.name || "John Muir");
  };

  const handleCancelLocation = () => {
    setIsEditLocation(false);
    setLocation(userProfile?.city || "No location set");
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a valid name");
      return;
    }

    try {
      const isMockUser = user?.id && user.id.length <= 10;
      
      if (isMockUser) {
        // For mock users, update local state and AuthContext
        setUserProfile({ ...userProfile, first_name: name.trim() });
        setUser({ ...user, name: name.trim() });
        setIsEditName(false);
        Alert.alert("Success", "Name updated successfully");
      } else {
        // For real users, update in Supabase
        const { error } = await supabase
          .from('user_profiles')
          .update({ first_name: name.trim() })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating name:', error);
          Alert.alert("Error", "Failed to update name. Please try again.");
        } else {
          setUserProfile({ ...userProfile, first_name: name.trim() });
          setIsEditName(false);
          Alert.alert("Success", "Name updated successfully");
        }
      }
    } catch (error) {
      console.error('Error saving name:', error);
      Alert.alert("Error", "Failed to update name. Please try again.");
    }
  };

  const handleSaveLocation = async () => {
    if (!location.trim()) {
      Alert.alert("Error", "Please enter a valid location");
      return;
    }

    try {
      const isMockUser = user?.id && user.id.length <= 10;
      
      if (isMockUser) {
        // For mock users, update local state
        setUserProfile({ ...userProfile, city: location.trim() });
        setIsEditLocation(false);
        Alert.alert("Success", "Location updated successfully");
      } else {
        // For real users, update in Supabase
        const { error } = await supabase
          .from('user_profiles')
          .update({ city: location.trim() })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating location:', error);
          Alert.alert("Error", "Failed to update location. Please try again.");
        } else {
          setUserProfile({ ...userProfile, city: location.trim() });
          setIsEditLocation(false);
          Alert.alert("Success", "Location updated successfully");
        }
      }
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert("Error", "Failed to update location. Please try again.");
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
            <Text style={styles.slogan}>{"Personal information"}</Text>
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

          {/* First name field */}
          <Text style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-SemiBold",
              letterSpacing: 0.5,
          }}>
            {"First name"}
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
              {loading ? "Loading..." : (userProfile?.first_name || user?.name || "John Muir")}
            </Text>
            

            <TouchableOpacity onPress={handleEdit} disabled={loading}>  
              <Image
                source={require("../../assets/new-images/icon-edit-pen.png")}
                style={{
                  height: scale(24),
                  width: scale(24),
                  opacity: loading ? 0.5 : 1,
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

          {/* Location field */}
          <Text style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-SemiBold",
              letterSpacing: 0.5,
          }}>
            {"Location"}
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
              {loading ? "Loading..." : (userProfile?.city || "No location set")}
            </Text>
            

            <TouchableOpacity onPress={handleEditLocation} disabled={loading}>  
              <Image
                source={require("../../assets/new-images/icon-edit-pen.png")}
                style={{
                  height: scale(24),
                  width: scale(24),
                  opacity: loading ? 0.5 : 1,
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

          {/* Email field */}
          <Text style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-SemiBold",
              letterSpacing: 0.5,
          }}>
            {"Email"}
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
              {loading ? "Loading..." : (user?.email || "No email available")}
            </Text>
          </View>

        </ScrollView>
      </View>


      {/* ===================== MESSAGE MODAL ===================== */}
      <Modal
        transparent
        visible={isEditName}
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
                    {"Change first name"}
                  </Text>

                  <TouchableOpacity
                    onPress={handleCancel}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Image
                      source={require("../../assets/new-images/icon-close-white.png")}
                      style={{
                        height: scale(24),
                        width: scale(24),
                      }}
                    />
                  </TouchableOpacity>
                </View>

                {/* Text area */}
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: scale(16),
                    fontFamily: "ZillaSlab-Medium",
                    letterSpacing: 0.5,
                  }}
                >
                  {"First name"}
                </Text>

                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your first name"
                  placeholderTextColor="rgba(0, 0, 0, 0.5)"
                  textAlignVertical="top"
                  style={{
                    marginTop: scaleVertical(8),
                    borderRadius: 6,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    padding: scale(20),
                    color: "rgba(0, 0, 0, 1)",
                    fontSize: scale(16),
                    fontFamily: "ZillaSlab-Medium",
                  }}
                />

                {/* Save button */}
                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                  ]}
                  onPress={handleSave}
                  activeOpacity={0.9}
                >
                  <Text style={styles.primaryText}>{"Save"}</Text>
                </TouchableOpacity>
                

                {/* Cancel */}
                <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.9} onPress={handleCancel}>
                  <Text style={styles.secondaryText}>Cancel</Text>
                </TouchableOpacity>
              </View>
          </BlurView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ===================== LOCATION EDIT MODAL ===================== */}
      <Modal
        transparent
        visible={isEditLocation}
        animationType="slide"
        onRequestClose={handleCancelLocation}
      >
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleCancelLocation}>
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
                    {"Change location"}
                  </Text>

                  <TouchableOpacity
                    onPress={handleCancelLocation}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Image
                      source={require("../../assets/new-images/icon-close-white.png")}
                      style={{
                        height: scale(24),
                        width: scale(24),
                      }}
                    />
                  </TouchableOpacity>
                </View>

                {/* Text area */}
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: scale(16),
                    fontFamily: "ZillaSlab-Medium",
                    letterSpacing: 0.5,
                  }}
                >
                  {"Location"}
                </Text>

                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter your location (e.g., Denver, CO)"
                  placeholderTextColor="rgba(0, 0, 0, 0.5)"
                  textAlignVertical="top"
                  style={{
                    marginTop: scaleVertical(8),
                    borderRadius: 6,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    padding: scale(20),
                    color: "rgba(0, 0, 0, 1)",
                    fontSize: scale(16),
                    fontFamily: "ZillaSlab-Medium",
                  }}
                />

                {/* Save button */}
                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                  ]}
                  onPress={handleSaveLocation}
                  activeOpacity={0.9}
                >
                  <Text style={styles.primaryText}>{"Save"}</Text>
                </TouchableOpacity>
                

                {/* Cancel */}
                <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.9} onPress={handleCancelLocation}>
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
    paddingHorizontal: scale(24),
    paddingTop: scaleVertical(45),
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

export default PersonalInformationScreen;