import Page from "@/components/Page";
import useVoiceCall from "@/hooks/useVoiceCall";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

const Ringing = () => {
  const { roomId, toUserId } = useLocalSearchParams();
  const { endCall } = useVoiceCall(roomId as string);

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
