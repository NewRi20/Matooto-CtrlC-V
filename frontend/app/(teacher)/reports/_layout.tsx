import { Stack } from 'expo-router';
import React from 'react';

export default function ReportsNestedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="generate" />
    </Stack>
  );
}
