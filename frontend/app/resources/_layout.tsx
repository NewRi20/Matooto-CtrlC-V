import { Stack } from 'expo-router';

export default function ResourcesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="lessons" />
      <Stack.Screen name="lesson-detail" />
    </Stack>
  );
}
