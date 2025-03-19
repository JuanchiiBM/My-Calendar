import { removeGuestFromEvent } from "../controllers/event.guest.controller.ts";
import { corsHeaders } from "../deps.ts";

export const handleEventGuestRequest = async (
  req: Request,
): Promise<Response> => {
  try {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // DELETE /api/eventguests
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "DELETE" && url.pathname.startsWith("/api/eventguests/")) {
      const id_event = Number(req.url.split("?event_id=")[1].split("&")[0]);
      const id_user = Number(req.url.split("?user_id=")[1]);
      const events = await removeGuestFromEvent(id_event, id_user);
      return new Response(JSON.stringify(events), {
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
