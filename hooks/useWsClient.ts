import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

const WS_URL = process.env.EXPO_PUBLIC_WEBSOCKET_URL;

const useWsClient = () => {
  const { sendMessage, lastMessage } = useWebSocket(WS_URL!, {
    heartbeat: {
      message: () => JSON.stringify({ type: "ping" }),
      returnMessage: "pong",
      timeout: 60000, // 1분
      interval: 25000, // 25초
    },
  });

  const connect = (userId: number) => {
    sendMessage(
      JSON.stringify({
        type: "auth",
        data: {
          user_id: userId,
        },
      })
    );
  };

  useEffect(() => {
    if (lastMessage !== null && lastMessage.data) {
      const data = JSON.parse(lastMessage.data);

      console.log(data);
    }
  }, [lastMessage]);

  return { connect };
};

export default useWsClient;
