import { HapticTab } from "@/components/HapticTab";
import { COLORS, SPACING } from "@/constants/theme";
import { Tabs } from "expo-router";
import React from "react";
import { Alert, Image, Platform, Text } from "react-native";
import ScreenTimeManager from "../services/ScreenTimeManager";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.tabBarActive,
        tabBarInactiveTintColor: COLORS.tabBarInactive,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: COLORS.tabBarBackground,
            borderTopWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)'
          },
          default: {
            backgroundColor: COLORS.tabBarBackground,
            borderTopWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)'
          },
        }),
      }}
    >
      <Tabs.Screen
        name="camp"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color,
                fontFamily: focused ? "SF-Pro-Display-Bold" : "SF-Pro-Display-Medium",
                fontSize: 12,
              }}
            >
              Dashboard
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused ? 
                  require("../../assets/new-images/dashboard-selected.png") :
                  require("../../assets/new-images/dashboard.png")
              }
              style={{
                width: 24,
                height: 24,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="defend"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color,
                fontFamily: focused ? "SF-Pro-Display-Bold" : "SF-Pro-Display-Medium",
                fontSize: 12,
              }}
            >
              Defend
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused ? 
                  require("../../assets/new-images/defend-selected.png") :
                  require("../../assets/new-images/defend.png")
              }
              style={{
                width: 24,
                height: 24,
              }}
            />
          ),
          tabBarButton: (props) => {
            const { onPress, ...rest } = props;
            return (
              <HapticTab
                {...rest}
                onPress={async () => {
                  await ScreenTimeManager.requestAuthorization('individual');
                  onPress?.();
                }}
              />
            );
          },
        }}
      />
      {/* <Tabs.Screen
        name="trail-log"
        options={{
          title: "Trail Log",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/traillog.png")}
              style={{
                width: 28,
                height: 28,
                tintColor: focused ? COLORS.tabBarActive : COLORS.tabBarInactive,
              }}
            />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color,
                fontFamily: focused ? "SF-Pro-Display-Bold" : "SF-Pro-Display-Medium",
                fontSize: 12,
              }}
            >
              Profile
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused ? 
                  require("../../assets/new-images/profile-selected.png") :
                  require("../../assets/new-images/profile.png")
              }
              style={{
                width: 24,
                height: 24,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
