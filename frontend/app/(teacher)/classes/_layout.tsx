import { Stack } from 'expo-router';
import React from 'react';

export default function ClassesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="[classId]" />
      <Stack.Screen name="student/[studentId]" />
    </Stack>
  );
}
