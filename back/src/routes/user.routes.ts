import { getUsers, createUser, getUserByName } from "../controllers/user.controller.ts";

export const handleRequest = async (req: Request): Promise<Response> => {
    try {
        const url = new URL(req.url);

        if (req.method === "GET" && url.pathname === "/api/users") {
            const users = await getUsers();
            return new Response(JSON.stringify(users), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (req.method === "GET" && url.pathname.startsWith("/api/users/")) {
            const name = url.pathname.split("/").pop();
            if (!name) {
                return new Response(JSON.stringify({ error: "Nombre requerido" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
            const user = await getUserByName(name);
            if (!user) {
                return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                });
            }
            return new Response(JSON.stringify(user), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (req.method === "POST" && url.pathname === "/api/users") {
            const data = await req.json();
            if (!data.name || !data.password) {
                return new Response(JSON.stringify({ error: "Se requieren name y password" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const userExist = await getUserByName(data.name);
            if (userExist) {
                return new Response(JSON.stringify({ error: "El usuario ya existe" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const user = await createUser(data.name, data.password);
            return new Response(JSON.stringify(user), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ error: "Ruta no encontrada" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: `Error en el servidor: ${error.message}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};