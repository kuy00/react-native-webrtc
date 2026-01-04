import { Stack } from "expo-router";

const CallLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        headerBackVisible: false,
      }}
    />
  );
};

export default CallLayout;
