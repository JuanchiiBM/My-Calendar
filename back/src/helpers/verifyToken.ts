import { verify } from "../deps.ts";
import { SECRET_KEY } from "../deps.ts";

export const verifyToken = async (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = authHeader.split(" ")[1];

  //@ts-ignore
  const payload = await verify(token, SECRET_KEY, "HS256"); // ✅ Si la clave está mal, dará error
  return payload.id as string
};
