import {
checkOwnerOfEvent,
  createEvent,
  deleteEvent,
  getEvents,
  getEventsById,
  updateEvent,
} from "../controllers/event.controller.ts";
import { corsHeaders } from "../deps.ts";
import { errorGuestHandler } from "../helpers/errorGuestsHandler.ts";
import { verifyToken } from "../helpers/verifyToken.ts";

export const handleEventRequest = async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const userId = await verifyToken(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
      });
    }
    
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // GET /api/events/checkOwner
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "GET" && url.pathname.startsWith("/api/events/checkOwner/")) {
        const event_id = Number(req.url.split("?event_id=")[1]);

        if (!event_id || isNaN(event_id)) {
            return new Response(
              JSON.stringify({ error: "ID de evento inválido" }),
              {
                status: 400,
                headers: corsHeaders,
              },
            );
        }
        const message = await checkOwnerOfEvent(event_id.toString(), userId as string);
        return new Response(
          JSON.stringify({ message }),
          {
            status: 200,
            headers: corsHeaders,
          },
        );
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // GET /api/events?id
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "GET" && url.pathname.startsWith("/api/events/")) {
      const events = await getEventsById(userId as string);
      return new Response(JSON.stringify(events), {
        status: 200,
        headers: corsHeaders,
      });
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // GET /api/events
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "GET" && url.pathname === "/api/events") {
      const events = await getEvents();
      return new Response(JSON.stringify(events), {
        status: 200,
        headers: corsHeaders,
      });
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // POST /api/events
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "POST" && url.pathname === "/api/events") {
      const data = await req.json();

      // 🔹 Validar datos requeridos
      if (
        !data.title || !data.start_date || !data.end_date ||
        !data.category_id
      ) {
        return new Response(
          JSON.stringify({ error: "Faltan datos obligatorios" }),
          {
            status: 400,
            headers: corsHeaders,
          },
        );
      }

      // 🔹 guests es opcional -> Convertimos nombres en IDs si existen
      const guests: number[] = [];
      await errorGuestHandler(data, guests);

      // 🔹 Llamar al controller con los datos convertidos
      const event = await createEvent(
        data.title,
        data.description || "",
        data.start_date,
        data.end_date,
        data.category_id,
        Number(userId as string),
        guests,
      );

      return new Response(
        JSON.stringify({
          status: "ok",
          message: "Evento creado",
          event: event,
        }),
        {
          status: 201,
          headers: corsHeaders,
        },
      );
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // PUT /api/events
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

    if (req.method === "PUT" && url.pathname.startsWith("/api/events/")) {
      const event_id = Number(req.url.split("?event_id=")[1]);
      const data = await req.json();

      if (!event_id || isNaN(event_id)) {
        return new Response(
          JSON.stringify({ error: "ID de evento inválido" }),
          {
            status: 400,
            headers: corsHeaders,
          },
        );
      }

      // 🔹 guests es opcional -> Convertimos nombres en IDs si existen
      const guests: number[] = [];
      await errorGuestHandler(data, guests);

      const _result = await updateEvent(event_id, data, userId as string, data.guests);

      return new Response(
        JSON.stringify({ status: "ok", message: "Evento actualizado" }),
        {
          status: 200,
          headers: corsHeaders,
        },
      );
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // DELETE /api/eventguests
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "DELETE" && url.pathname.startsWith("/api/events/")) {
      const event_id = Number(req.url.split("?event_id=")[1])
      await deleteEvent(event_id, Number(userId as string));
      return new Response(
        JSON.stringify({ status: "ok", message: "Evento eliminado" }),
        {
          status: 200,
          headers: corsHeaders,
        },
      );
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // DEFAULT ERROR
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

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
