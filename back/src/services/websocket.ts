export const connections = new Map<number, WebSocket>(); // id_usuario -> socket

export function startWebSocketServer() {
  Deno.serve({ port: 8080 }, (req) => {
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      console.log("🔌 Cliente conectado");
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "auth") {
        connections.set(data.userId, socket);
        console.log(`✅ Conectado como user ${data.userId}`);
      }
    };

    socket.onclose = () => {
      for (const [id, s] of connections) {
        if (s === socket) {
          connections.delete(id);
          break;
        }
      }
      console.log("❌ Cliente desconectado");
    };

    return response;
  });

  console.log("🧠 WebSocket corriendo en ws://localhost:8080");
}
