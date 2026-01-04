import { WebSocketContext } from "@/providers/WebSocketProvider";
import { WebSocketMessageType } from "@/types/webSocket";
import { useFocusEffect } from "expo-router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

const useWebSocket = () => {
  const wsRef = useContext(WebSocketContext);
  const ws = wsRef?.current;
  const messageQueue = useRef<string[]>([]);
  const [status, setStatus] = useState<"idle" | "open" | "close" | "error">(
    "idle"
  );
  const [lastMessage, setLastMessage] = useState<WebSocketMessageType | null>(
    null
  );
  const clientTag = `${Platform.OS}-${Math.random().toString(16).slice(2, 6)}`;

  const sendMessage = useCallback(
    (message: string) => {
      console.log(clientTag, "[WebSocket] Sending message:", message);
      if (ws?.readyState === WebSocket.OPEN) {
        ws?.send(message);
      } else {
        messageQueue.current.push(message);
      }
    },
    [ws]
  );

  const messageHandler = useCallback((event: WebSocketMessageEvent) => {
    const message = JSON.parse(event.data);
    console.log(clientTag, "[WebSocket] Received message:", message);
    setLastMessage(message);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!ws) return;

      const onMessage = (event: MessageEvent) => messageHandler(event);
      const onOpen = () => setStatus("open");
      const onClose = () => setStatus("close");
      const onError = () => setStatus("error");

      ws.addEventListener("open", onOpen);
      ws.addEventListener("close", onClose);
      ws.addEventListener("error", onError);
      ws.addEventListener("message", onMessage);

      return () => {
        ws.removeEventListener("open", onOpen);
        ws.removeEventListener("close", onClose);
        ws.removeEventListener("error", onError);
        ws.removeEventListener("message", onMessage);
        messageQueue.current = [];
      };
    }, [ws, messageHandler])
  );

  useEffect(() => {
    if (status === "open") {
      while (messageQueue.current.length > 0) {
        const message = messageQueue.current.shift();
        if (message) {
          ws?.send(message);
        }
      }
    }
  }, [ws, status]);

  return { clientTag, sendMessage, lastMessage };
};

export default useWebSocket;
