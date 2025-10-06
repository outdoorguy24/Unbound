import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";

import { height, scale, scaleVertical } from "@/constants/Scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const PersonalInformationScreen = () => {
  const insets = useSafeAreaInsets();
  const [toggle, setToggle] = useState(false);

  const [isEditName, setIsEditName] = useState(false);
  const [name, setName] = useState("John Adams");

  const handleEdit = () => {
    setIsEditName(true);
    setName("");
  };

  const handleCancel = () => setIsEditName(false);
  
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

          {/* Full name field */}
          <Text style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-SemiBold",
              letterSpacing: 0.5,
          }}>
            {"Full name"}
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
              {"John Adams"}
            </Text>
            

            <TouchableOpacity onPress={handleEdit}>  
              <Image
                source={require("../../assets/new-images/icon-edit-pen.png")}
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
              {"jordan.adams@gmail.com"}
            </Text>
          </View>
          
          <View style={{
            width: "100%",
            height: 1, 
            backgroundColor: "#D9D9D9", 
            opacity: 0.15,
            marginVertical: scaleVertical(24),
          }} />

          {/* Location field */}

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Image
              source={require("../../assets/new-images/icon-location-pin.png")}
              style={{
                height: scale(24),
                width: scale(24),
                marginRight: scale(10)
              }}
            />

            <Text style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-SemiBold",
              letterSpacing: 0.5,
              flex: 1,
            }}>
              {"Location"}
            </Text>

            <Switch value={toggle} onValueChange={(value) => setToggle(value)}         
              ios_backgroundColor={'rgba(255, 255, 255, 0.2)'}
              trackColor={{ false: "#67CE67", true: "#67CE67" }}
              thumbColor={toggle ? "#f4f3f4" : "#f4f3f4"}
              />
          </View>

          <Text style={{
              marginTop: scaleVertical(10),
              color: "rgba(255, 255, 255, 1)",
              fontSize: scale(20),
              fontFamily: "ZillaSlab-SemiBold",
              letterSpacing: 0.5,
              flex: 1,
          }}>
            {"123 Main St, Springfield, IL 62704"}
          </Text>

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
                    {"Change full name"}
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
                  {"Full name"}
                </Text>

                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#rgba(0, 0, 0, 0.5)"
                  textAlignVertical="top"
                  style={{
                    marginTop: scaleVertical(8),
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
                  <Text style={styles.primaryText}>{"Save"}</Text>
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