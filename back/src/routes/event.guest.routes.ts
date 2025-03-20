import { removeGuestFromEvent } from "../controllers/event.guest.controller.ts";
import { corsHeaders } from "../deps.ts";
import { verifyToken } from "../helpers/verifyToken.ts";

export const handleEventGuestRequest = async (
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
    // DELETE /api/eventguests
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "DELETE" && url.pathname.startsWith("/api/eventguests/")) {
      const id_event = Number(req.url.split("?event_id=")[1]);
      await removeGuestFromEvent(id_event, Number(userId as string));
      return new Response(JSON.stringify({ status: "ok", message: "Invitación eliminada correctamente"}), {
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
