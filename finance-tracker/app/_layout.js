import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="splash" />
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="expense-details" />
    </Stack>
  );
} 