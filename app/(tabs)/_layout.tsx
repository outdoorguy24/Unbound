import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="camp"
        options={{
          title: 'Camp',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tent" color={color} />,
        }}
      />
      <Tabs.Screen
        name="defend"
        options={{
          title: 'Defend',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="shield" color={color} />,
        }}
      />
      <Tabs.Screen
        name="trail-log"
        options={{
          title: 'Trail Log',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="signpost" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="hat" color={color} />,
        }}
      />
    </Tabs>
  );
}
