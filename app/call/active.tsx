import Page from "@/components/Page";
import useTimer from "@/hooks/useTimer";
import useWebRtc from "@/hooks/useWebRtc";
import { formatTime } from "@/utils/time";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

const Active = () => {
  const { roomId, role, fromUserId, toUserId } = useLocalSearchParams();
  const { time } = useTimer();
  const { endCall } = useWebRtc(roomId as string, role as "caller" | "callee");

  return (
    <Page className="bg-black justify-between items-center py-10 px-16">
      <View className="items-center">
        <Text className="color-white font-bold text-[50px]">
          {role === "caller" ? toUserId : fromUserId}
        </Text>
        <Text className="color-white text-[20px]">{formatTime(time)}</Text>
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

export default Active;
