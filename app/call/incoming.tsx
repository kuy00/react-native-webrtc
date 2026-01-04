import Page from "@/components/Page";
import useVoiceCall from "@/hooks/useVoiceCall";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

const Incoming = () => {
  const { roomId, fromUserId } = useLocalSearchParams();
  const { endCall } = useVoiceCall(roomId as string);

  return (
    <Page className="bg-black justify-between items-center py-10 px-16">
      <View className="items-center">
        <Text className="color-white font-bold text-[50px]">{fromUserId}</Text>
        <Text className="color-white text-[20px]">is calling</Text>
      </View>
      <View className="flex-row w-full justify-between">
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
          <Text className="color-white">Decline</Text>
        </View>
        <View className="items-center gap-3">
          <Pressable className="bg-[#27CC4E] w-20 h-20 rounded-full flex items-center justify-center">
            <Ionicons name="call" size={35} color="white" />
          </Pressable>
          <Text className="color-white">Accept</Text>
        </View>
      </View>
    </Page>
  );
};

export default Incoming;
