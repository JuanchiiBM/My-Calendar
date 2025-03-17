import {
  createUser,
  getUserByName,
  getUsers,
  loginUser,
} from "../controllers/user.controller.ts";
import { corsHeaders } from "../deps.ts";

// 🔥 Manejar solicitudes OPTIONS (Preflight)
export const handleUserRequest = async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // GET /api/users
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "GET" && url.pathname === "/api/users") {
      const users = await getUsers();
      return new Response(JSON.stringify(users), {
        status: 200,
        headers: corsHeaders,
      });
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // GET /api/users/:name
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "GET" && url.pathname.startsWith("/api/users/")) {
      const name = url.pathname.split("/").pop();
      if (!name) {
        return new Response(JSON.stringify({ error: "Nombre requerido" }), {
          status: 400,
          headers: corsHeaders,
        });
      }
      const user = await getUserByName(name);
      if (!user) {
        return new Response(
          JSON.stringify({ error: "Usuario no encontrado" }),
          { status: 404, headers: corsHeaders },
        );
      }
      return new Response(JSON.stringify(user), {
        status: 200,
        headers: corsHeaders,
      });
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // POST /api/users
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "POST" && url.pathname === "/api/users") {
      const data = await req.json();
      if (!data.name || !data.password) {
        return new Response(
          JSON.stringify({ error: "Se requiere nombre y contraseña" }),
          { status: 400, headers: corsHeaders },
        );
      }

      const userExist = await getUserByName(data.name);
      if (userExist && data.password != userExist.password) {
        return new Response(JSON.stringify({ error: "El usuario ya existe" }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      if (userExist && data.password == userExist.password) {
        return new Response(JSON.stringify({ user: userExist, message: "Inicio de sesión exitoso", status: 'ok' }), {
          status: 201,
          headers: corsHeaders,
        });
      }

      const user = await createUser(data.name, data.password);
      return new Response(JSON.stringify({ user: userExist, message: "Creación de usuario exitosa", status: 'ok' }), {
        status: 201,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ error: "Ruta no encontrada" }), {
      status: 404,
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error("🔥 Error en el servidor:", error);
    return new Response(
      JSON.stringify({ error: `Error en el servidor: ${error.message}` }),
      { status: 500, headers: corsHeaders },
    );
  }
};
