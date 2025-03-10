import { handleRequest } from "./src/routes/user.routes.ts";
import { connectDB } from "./src/services/database.ts";

// Conectar a la base de datos
await connectDB();

console.log("🚀 Servidor corriendo en http://localhost:8000");

Deno.serve({ port: 8000 }, handleRequest);