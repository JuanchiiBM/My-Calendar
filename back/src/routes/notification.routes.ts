import { createNotification, getNotifications } from "../controllers/notification.controller.ts";
import { corsHeaders } from "../deps.ts";
import { verifyToken } from "../helpers/verifyToken.ts";
import { NotificationProps } from "../models/notification.model.ts";

export const handleNotificationRequest = async (
  req: Request,
): Promise<Response> => {
  try {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const userId = await verifyToken(req);
    if (!userId) {
        return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // GET /api/notifications
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "GET" && url.pathname === "/api/notifications") {
      const response = await getNotifications(Number(userId as string));
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: corsHeaders,
      });
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // POST /api/notifications
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "POST" && url.pathname === "/api/notifications") {
      const body: NotificationProps = await req.json();
      console.log(body)

        if (!body.id_destination || !body.message || !body.created_at || !body.title) {
            return new Response(JSON.stringify({ error: "Faltan datos obligatorios" }), {
                status: 400
            });
        }
      const response = await createNotification(body, Number(userId as string));
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ error: "Ruta no encontrada" }), {
      status: 404,
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: `${error.message}` }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
};
