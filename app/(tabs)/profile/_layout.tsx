import { Stack } from "expo-router";
import React from "react";

export default function ProfileStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Root of the tab */}
      <Stack.Screen name="index" />
    </Stack>
  );
}