import { createEvent, getEvents, getEventsById } from "../controllers/event.controller.ts";
import { getUserByName } from "../controllers/user.controller.ts";
import { corsHeaders } from "../deps.ts";


export const handleEventRequest = async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // GET /api/events?id
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "GET" && url.pathname.startsWith("/api/events/")) {
        const id_user = req.url.split('?id=')[1]
        const events = await getEventsById(id_user);
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
        !data.category_id || !data.created_by
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
      if (data.guests && Array.isArray(data.guests)) {
        for (const guestName of data.guests) {
          const guest = await getUserByName(guestName);
          if (!guest) {
            return new Response(
              JSON.stringify({
                error: "Alguno de los invitados no es un usuario",
              }),
              {
                status: 400,
                headers: corsHeaders,
              },
            );
          }

          if (guest.id_user == data.created_by) {
            return new Response(
                JSON.stringify({
                  error: "Usted no puede asignarse como invitado",
                }),
                {
                  status: 400,
                  headers: corsHeaders,
                },
              );
          }

          if (data.guests) {
            const uniqueGuests = new Set(data.guests);
            if (uniqueGuests.size !== data.guests.length) {
              return new Response(
                JSON.stringify({
                  error: "Hay invitados repetidos en la lista",
                }),
                {
                  status: 400,
                  headers: corsHeaders,
                },
              );
            }
          }

          if (guest.id_user)
          guests.push(guest.id_user);
        }
      }

      // 🔹 Llamar al controller con los datos convertidos
      const event = await createEvent(
        data.title,
        data.description || "",
        data.start_date,
        data.end_date,
        data.category_id,
        data.created_by,
        guests,
      );

      return new Response(JSON.stringify(event), {
        status: 201,
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
