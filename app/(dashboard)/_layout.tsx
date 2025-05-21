import React from "react";
import { Stack } from "expo-router";
import { colors } from "../../constants/colors";

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        // headerStyle: {
        //   backgroundColor: colors.white,
        // },
        // headerTintColor: colors.primary,
        // headerTitleStyle: {
        //   fontWeight: "bold",
        // },
        contentStyle: {
          backgroundColor: colors.background,
        },

        headerShown: false,

        // headerBackTitleVisible: false
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Choose Registration",
          headerShown: true,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="tourist/index"
        options={{
          title: "Tourist Dashboard",
          headerShown: true,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="tourist/register"
        options={{
          title: "Tourist Registration",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="tourist/add-member"
        options={{
          title: "Add Member",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="tourist/hotels"
        options={{
          title: "Hotels",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="tourist/cabs"
        options={{
          title: "Cabs",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="labour/index"
        options={{
          title: "Labour Dashboard",
          headerShown: true,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="labour/register"
        options={{
          title: "Labour Registration",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="labour/view-card"
        options={{
          title: "Labour Card",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
