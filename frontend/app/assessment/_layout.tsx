import { Stack } from 'expo-router';

export default function AssessmentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="read" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="result" />
      <Stack.Screen name="review" />
      <Stack.Screen name="attempt_read" />
      <Stack.Screen name="attempt_quiz" />
      <Stack.Screen name="attempt_result" />
    </Stack>
  );
}
