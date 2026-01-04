import "@/assets/styles/global.css";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <WebSocketProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="call"
          options={{ gestureEnabled: false, headerBackVisible: false }}
        />
      </Stack>
    </WebSocketProvider>
  );
}
