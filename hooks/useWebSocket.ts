import { useCallback, useEffect, useRef, useState } from "react";

const WS_URL = process.env.EXPO_PUBLIC_WEBSOCKET_URL;

const useWebSocket = () => {
  const webSocketRef = useRef<WebSocket | null>(null);
  const messageQueue = useRef<string[]>([]);
  const [status, setStatus] = useState<"idle" | "open" | "close" | "error">(
    "idle"
  );

  useEffect(() => {
    webSocketRef.current = new WebSocket(WS_URL!);

    webSocketRef.current.onopen = () => {
      setStatus("open");
    };

    webSocketRef.current.onclose = () => {
      setStatus("close");
    };

    webSocketRef.current.onerror = () => {
      setStatus("error");
    };

    webSocketRef.current.onmessage = (event) => {
      messageHandler(event);
    };

    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (status === "open") {
      while (messageQueue.current.length > 0) {
        const message = messageQueue.current.shift();
        if (message) {
          webSocketRef.current?.send(message);
        }
      }
    }
  }, [status]);

  const sendMessage = useCallback((message: string) => {
    console.log("Sending message:", message);
    if (webSocketRef.current?.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(message);
    } else {
      messageQueue.current.push(message);
    }
  }, []);

  const connect = useCallback(
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

  const messageHandler = useCallback((event: WebSocketMessageEvent) => {
    const message = JSON.parse(event.data);
    console.log("Received message:", message);
  }, []);

  const disconnect = useCallback(() => {
    webSocketRef.current?.close();
    webSocketRef.current = null;
    messageQueue.current = [];
  }, []);

  return { connect };
};

export default useWebSocket;
