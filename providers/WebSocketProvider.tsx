import React, {
  createContext,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
} from "react";

interface WebSocketProviderProps {
  children: ReactNode;
}

const WS_URL = process.env.EXPO_PUBLIC_WEBSOCKET_URL;

export const WebSocketContext =
  createContext<RefObject<WebSocket | null> | null>(null);

export const WebSocketProvider = (props: WebSocketProviderProps) => {
  const { children } = props;
  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!WS_URL) return;

    const ws = new WebSocket(WS_URL);
    webSocketRef.current = ws;

    return () => {
      ws.close();
      webSocketRef.current = null;
    };
  }, []);

  return (
    <WebSocketContext.Provider value={webSocketRef}>
      {children}
    </WebSocketContext.Provider>
  );
};
