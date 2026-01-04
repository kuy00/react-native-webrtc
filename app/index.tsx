import useVoiceCall from "@/hooks/useVoiceCall";
import { getRandomInt } from "@/utils/random";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Index = () => {
  const [userId, setUserId] = useState(0);
  const [toUserId, setToUserId] = useState("");
  const { init, reqeustCall } = useVoiceCall();

  useEffect(() => {
    const _userId = getRandomInt(1000);
    setUserId(_userId);
    init(_userId);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
            inputMode="numeric"
          />
          <Pressable>
            <Ionicons
              name="call"
              size={24}
              color="black"
              onPress={() => reqeustCall(parseInt(toUserId))}
            />
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Index;
