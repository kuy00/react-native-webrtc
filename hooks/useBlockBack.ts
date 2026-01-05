import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { BackHandler, Platform } from "react-native";

export const useBlockBack = (enabled: boolean) => {
  const navigation = useNavigation();

  useEffect(() => {
    const sub = navigation.addListener("beforeRemove", (e) => {
      if (!enabled) return;

      if (e.data.action.type === "REPLACE") return;

      e.preventDefault();
    });

    return sub;
  }, [navigation, enabled]);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    if (!enabled) return;

    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);

    return () => sub.remove();
  }, [enabled]);
};
