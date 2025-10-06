import { Stack } from "expo-router";
import React from "react";

export default function DefendStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Root of the tab */}
      <Stack.Screen name="index" />
      <Stack.Screen name="ChooseSchedule" />
    </Stack>
  );
}