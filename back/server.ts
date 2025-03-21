import { handleUserRequest } from "./src/routes/user.routes.ts";
import { handleCategoryRequest } from "./src/routes/category.routes.ts";
import { handleEventRequest } from "./src/routes/event.routes.ts";
import { handleNotificationRequest } from "./src/routes/notification.routes.ts";
import { handleEventGuestRequest } from "./src/routes/event.guest.routes.ts";
import { connectDB } from "./src/services/database.ts";

// Conectar a la base de datos
await connectDB();

console.log("🚀 Servidor corriendo en http://localhost:8000");

const handleRequest = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  // 🔹 Rutas de usuarios
  if (url.pathname.startsWith("/api/users")) {
    return handleUserRequest(req);
  }

  // 🔹 Rutas de eventos
  if (url.pathname.startsWith("/api/events")) {
    return handleEventRequest(req);
  }

  // 🔹 Rutas de eventos de invitados
  if (url.pathname.startsWith("/api/eventguests")) {
    return handleEventGuestRequest(req);
  }

  // 🔹 Rutas de notificaciones
  if (url.pathname.startsWith("/api/notifications")) {
    return handleNotificationRequest(req);
  }

  // 🔹 Rutas de categorías
  if (url.pathname.startsWith("/api/categorys")) {
    return handleCategoryRequest(req);
  }

  // 🔹 Si la ruta no coincide con ninguna
  return new Response(JSON.stringify({ error: "Ruta no encontrada" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
};

Deno.serve({ port: 8000 }, handleRequest);
