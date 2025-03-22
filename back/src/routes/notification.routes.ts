import { createNotification, getNotifications, updateNotification } from "../controllers/notification.controller.ts";
import { getUserByName, getUserById } from "../controllers/user.controller.ts";
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
        const notification: NotificationProps = await req.json();
        console.log(notification)

        if (notification.name_of_guests) {
            notification.name_of_guests.forEach(async (guest) => {
                const userDestination = await getUserByName(guest);
                if (!userDestination) {
                return new Response(JSON.stringify({ error: "El usuario no existe" }), {
                    status: 400
                });
                }
                await createNotification(notification, Number(userId as string), userDestination.id_user as number);
            })
        } else {
                const userDestination = await getUserById(notification.id_destination.toString());
                if (!userDestination) {
                return new Response(JSON.stringify({ error: "El usuario no existe" }), {
                    status: 400
                });
                }
                await createNotification(notification, Number(userId as string), userDestination.id_user as number);
        }
      return new Response(JSON.stringify({ status: 'ok', message: 'Mensajes enviados con exito'}), {
        status: 200,
        headers: corsHeaders,
      });
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // PUT /api/notifications
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "PUT" && url.pathname === "/api/notifications") {
        const notification: NotificationProps = await req.json();
        console.log(notification)
  
          if (!notification.id_destination || !notification.message || !notification.created_at || !notification.title) {
              return new Response(JSON.stringify({ error: "Faltan datos obligatorios" }), {
                  status: 400
              });
          }
        const response = await updateNotification(notification, Number(userId as string));
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
