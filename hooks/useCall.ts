import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

import { useBlockBack } from "./useBlockBack";
import useWebSocket from "./useWebSocket";

const useCall = (roomId?: string) => {
  const { sendMessage, lastMessage } = useWebSocket();
  const [isInCall, setIsInCall] = useState(false);

  useBlockBack(isInCall);

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

  const acceptCall = useCallback(() => {
    sendMessage(
      JSON.stringify({
        type: "call.accept",
        data: {
          room_id: roomId,
        },
      })
    );
  }, [sendMessage, roomId]);

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
      switch (lastMessage.type) {
        case "error":
          Alert.alert("Error", lastMessage.data.reason);
          break;
        case "call.incoming":
          setIsInCall(true);
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
          setIsInCall(true);
          router.push({
            pathname: "/call/ringing",
            params: {
              roomId: lastMessage.data.room_id,
              fromUserId: lastMessage.data.from_user_id,
              toUserId: lastMessage.data.to_user_id,
            },
          });
          break;
        case "call.ready":
          setIsInCall(true);
          router.push({
            pathname: "/call/active",
            params: {
              roomId: lastMessage.data.room_id,
              role: lastMessage.data.role,
              fromUserId: lastMessage.data.from_user_id,
              toUserId: lastMessage.data.to_user_id,
            },
          });
          break;
        case "call.ended":
          setIsInCall(false);
          router.replace("/");
          break;
      }
    }
  }, [lastMessage]);

  return { init, reqeustCall, acceptCall, endCall };
};

export default useCall;
