import useWsClient from "@/hooks/useWsClient";
import { getRandomInt } from "@/utils/random";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const Index = () => {
  const [userId, setUserId] = useState(0);
  const [toUserId, setToUserId] = useState("");
  const { connect } = useWsClient();

  useEffect(() => {
    setUserId(getRandomInt(1000));
  }, []);

  useEffect(() => {
    if (userId) {
      connect(userId);
    }
  }, [userId, connect]);

  return (
    <View className="flex-1 items-center justify-center bg-white gap-4">
      <View>
        <Text>내 아이디: {userId}</Text>
      </View>
      <View className="flex-row gap-4 items-center">
        <Text>상대방 아이디</Text>
        <TextInput
          className="border border-[#E3E3E3] w-[200px] h-[35px] rounded-md"
          value={toUserId}
          onChangeText={setToUserId}
        />
        <Pressable>
          <Ionicons name="call" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
};

export default Index;
