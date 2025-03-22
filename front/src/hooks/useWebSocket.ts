import { useEffect, useRef } from "react";

const useWebSocket = (userId: number, onMessage: (data: any) => void) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Conectado al WebSocket");
      socket.send(JSON.stringify({ type: "auth", userId }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    socket.onclose = () => {
      console.log("🔌 Desconectado del WebSocket");
    };

    return () => {
      socket.close();
    };
  }, [userId]);
};

export default useWebSocket;
