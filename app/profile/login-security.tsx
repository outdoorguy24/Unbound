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

const LoginSecurityScreen = () => {
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
            

            <TouchableOpacity onPress={() => {}}>  
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
});

export default LoginSecurityScreen;