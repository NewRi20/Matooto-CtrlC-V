import { Stack } from "expo-router";

export default function AssessmentLayout() {
  return (
    <Stack>
      <Stack.Screen name="read" options={{ headerShown: false }} />
      <Stack.Screen name="quiz" options={{ headerShown: false }} />
      <Stack.Screen name="result" options={{ headerShown: false }} />
      <Stack.Screen name="class-assessments" options={{ headerShown: false }} />
    </Stack>
  );
}
