import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useBlockExit } from "./useBlockBack";
import useWebSocket from "./useWebSocket";

const useVoiceCall = (roomId?: string) => {
  const { sendMessage, lastMessage } = useWebSocket();
  const [callStatus, setCallStatus] = useState<
    "idle" | "waiting" | "connected"
  >("idle");

  useBlockExit(callStatus !== "idle");

  const init = useCallback(
    (userId: number) => {
      sendMessage(
        JSON.stringify({
          type: "auth",
          data: {
            user_id: userId,
          },
        })
      );
    },
    [sendMessage]
  );

  const reqeustCall = useCallback(
    (toUserId: number) => {
      sendMessage(
        JSON.stringify({
          type: "call.request",
          data: {
            to_user_id: toUserId,
          },
        })
      );
    },
    [sendMessage]
  );

  const endCall = useCallback(() => {
    sendMessage(
      JSON.stringify({
        type: "call.end",
        data: {
          room_id: roomId,
        },
      })
    );
  }, [sendMessage, roomId]);

  useEffect(() => {
    if (lastMessage) {
      console.log("Voice Call Message:", lastMessage);

      switch (lastMessage.type) {
        case "error":
          Alert.alert("Error", lastMessage.data.reason);
          break;
        case "call.incoming":
          setCallStatus("waiting");
          router.push({
            pathname: "/call/incoming",
            params: {
              roomId: lastMessage.data.room_id,
              fromUserId: lastMessage.data.from_user_id,
              toUserId: lastMessage.data.to_user_id,
            },
          });
          break;
        case "call.ringing":
          setCallStatus("waiting");
          router.push({
            pathname: "/call/ringing",
            params: {
              roomId: lastMessage.data.room_id,
              fromUserId: lastMessage.data.from_user_id,
              toUserId: lastMessage.data.to_user_id,
            },
          });
          break;
        case "call.ended":
          setCallStatus("idle");
          router.back();
          break;
      }
    }
  }, [lastMessage]);

  return { init, callStatus, reqeustCall, endCall };
};

export default useVoiceCall;
