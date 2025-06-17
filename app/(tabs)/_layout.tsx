import { HapticTab } from "@/components/HapticTab";
import { COLORS, SPACING } from "@/constants/theme";
import { Tabs } from "expo-router";
import React from "react";
import { Image, Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.tabBarActive,
        tabBarInactiveTintColor: COLORS.tabBarInactive,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: COLORS.tabBarBackground,
            borderTopWidth: 0,
            paddingTop: SPACING.sm,
          },
          default: {
            backgroundColor: COLORS.tabBarBackground,
            borderTopWidth: 0,
            paddingTop: SPACING.sm,
          },
        }),
        tabBarLabelStyle: {
          fontFamily: "Vollkorn-Bold",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="camp"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/home.png")}
              style={{
                width: 28,
                height: 28,
                tintColor: focused ? COLORS.tabBarActive : COLORS.tabBarInactive,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="defend"
        options={{
          title: "Defend",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/defend.png")}
              style={{
                width: 28,
                height: 28,
                tintColor: focused ? COLORS.tabBarActive : COLORS.tabBarInactive,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trail-log"
        options={{
          title: "Trail Log",
          headerShown: false,
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
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/profile.png")}
              style={{
                width: 28,
                height: 28,
                tintColor: focused ? COLORS.tabBarActive : COLORS.tabBarInactive,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
