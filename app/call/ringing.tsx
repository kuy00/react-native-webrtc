import Page from "@/components/Page";
import useCall from "@/hooks/useCall";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer } from "expo-audio";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";

const Ringing = () => {
  const { roomId, toUserId } = useLocalSearchParams();
  const { endCall } = useCall(roomId as string);
  const player = useAudioPlayer(require("@/assets/sounds/call_waiting.mp3"));

  useFocusEffect(
    useCallback(() => {
      player.loop = true;
      player.play();

      return () => {
        try {
          player.pause();
        } catch {}
      };
    }, [])
  );

  return (
    <Page className="bg-black justify-between items-center py-10 px-16">
      <View className="items-center">
        <Text className="color-white font-bold text-[50px]">{toUserId}</Text>
        <Text className="color-white text-[20px]">calling...</Text>
      </View>
      <View>
        <View className="items-center gap-3">
          <Pressable
            className="bg-[#F80D23] w-20 h-20 rounded-full flex items-center justify-center"
            onPress={endCall}
          >
            <Ionicons
              name="call"
              size={35}
              color="white"
              className="rotate-[135deg]"
            />
          </Pressable>
        </View>
      </View>
    </Page>
  );
};

export default Ringing;
