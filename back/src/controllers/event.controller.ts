import client from "../services/database.ts";
import { EventProps } from "../models/event.model.ts";
import {
  addGuestToEvent,
  removeGuestFromEvent,
} from "./event.guest.controller.ts";
import { getUserByName } from "./user.controller.ts";
import { getIdGuests } from "../helpers/getIdGuests.ts";

export const getEvents = async (): Promise<EventProps[]> => {
  try {
    const result = await client.queryObject<EventProps>(
      `SELECT e.*, c.color 
             FROM "Event" e
             INNER JOIN "Category" c ON e.category_id = c.id_category`,
    );
    return result.rows;
  } catch (error) {
    console.error("Error obteniendo eventos", error);
    throw new Error("Error al obtener eventos");
  }
};

export const getEventsById = async (id: string): Promise<EventProps[]> => {
  try {
    const result = await client.queryObject<EventProps>(
      `SELECT e.*, eg.user_id AS invited_user, c.color, u.name AS name_invited_user
            FROM "Event" e
            LEFT JOIN "EventGuest" eg ON e.id_event = eg.event_id
            LEFT JOIN "User" u ON eg.user_id = u.id_user
            INNER JOIN "Category" c ON e.category_id = c.id_category
            WHERE e.created_by = $1 OR eg.user_id = $1;`,
      [id],
    );

    const eventsMap: { [key: string]: any } = {};

    result.rows.forEach((row: any) => {
      if (!eventsMap[row.id_event]) {
        eventsMap[row.id_event] = {
          ...row,
          invited_user: row.invited_user ? [row.invited_user] : [],
          name_invited_user: row.name_invited_user
            ? [row.name_invited_user]
            : [],
        };
      } else {
        if (row.invited_user) {
          eventsMap[row.id_event].invited_user.push(row.invited_user);
        }
        if (row.name_invited_user) {
          eventsMap[row.id_event].name_invited_user.push(row.name_invited_user);
        }
      }
    });

    return Object.values(eventsMap);
  } catch (error) {
    console.error("Error obteniendo eventos", error);
    throw new Error("Error al obtener eventos");
  }
};

export const createEvent = async (
  title: string,
  description: string,
  start_date: string,
  end_date: string,
  category_id: number,
  created_by: number,
  guests?: number[],
): Promise<EventProps> => {
  try {
    // 🔹 Verificar si la categoría existe
    const categoryCheck = await client.queryObject(
      `SELECT id_category FROM "Category" WHERE id_category = $1`,
      [category_id],
    );
    if (categoryCheck.rows.length === 0) {
      throw new Error("La categoría no existe");
    }

    // 🔹 Insertar evento en la base de datos
    const result = await client.queryArray<[number]>(
      `INSERT INTO "Event" (title, description, start_date, end_date, category_id, created_by)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id_event`,
      [title, description, start_date, end_date, category_id, created_by],
    );

    const event_id = result.rows[0][0];

    // 🔹 Insertar invitados en la tabla intermedia (solo si `guests` tiene valores)
    if (guests && guests.length > 0) {
      for (const guest_id of guests) {
        await client.queryArray(
          `INSERT INTO "EventGuest" (event_id, user_id) VALUES ($1, $2)`,
          [event_id, guest_id],
        );
      }
    }

    return {
      id_event: event_id,
      title,
      description,
      start_date,
      end_date,
      category_id,
      created_by,
    };
  } catch (error: any) {
    console.error("Error creando evento", error);
    throw new Error(`${error.message}`);
  }
};

export const updateEvent = async (
  event_id: number,
  updatedData: Partial<EventProps>,
  id_user: string,
  guests?: string[],
): Promise<{ message: string }> => {
  try {
    // 🔹 Verificar si el evento existe
    const eventCheck = await client.queryObject<{ id_event: number }>(
      `SELECT id_event FROM "Event" WHERE id_event = $1`,
      [event_id],
    );
    if (eventCheck.rows.length === 0) {
      throw new Error("El evento no existe.");
    }

    // 🔹 Verificar si el editor es uno mismo
    const editorCheck = await client.queryObject<{ id_event: number }>(
      `SELECT created_by, id_event FROM "Event" WHERE id_event = $1 AND created_by = $2`,
      [event_id, id_user],
    );
    if (editorCheck.rows.length === 0) {
      throw new Error("Usted no posee permisos para editar este evento.");
    }

    // 🔹 Obtener id de usuarios invitados
    const idGuests = await getIdGuests(guests);

    await client.queryArray(
      `UPDATE "Event" 
         SET title = $1, description = $2, start_date = $3, end_date = $4, category_id = $5 
         WHERE id_event = $6;`,
      [
        updatedData.title,
        updatedData.description,
        updatedData.start_date,
        updatedData.end_date,
        updatedData.category_id,
        event_id,
      ],
    );

    // 🔹 Actualizar invitados en la tabla EventGuest si `guests` está definido
    if (guests) {
      // Obtener los invitados actuales
      const currentGuests = await client.queryObject<{ user_id: number }>(
        `SELECT user_id FROM "EventGuest" WHERE event_id = $1`,
        [event_id],
      );

      const currentGuestIds = currentGuests.rows.map((g) => g.user_id);

      // 🔥 Buscar invitados a eliminar (los que ya no están en la lista nueva)
      const guestsToRemove = currentGuestIds.filter((id) =>
        !idGuests.includes(id)
      );
      for (const guestId of guestsToRemove) {
        await removeGuestFromEvent(event_id, guestId);
      }

      // 🔥 Buscar invitados a agregar (los nuevos que no estaban antes)
      const guestsToAdd = idGuests.filter((id) =>
        id && !currentGuestIds.includes(id)
      );
      for (const guestId of guestsToAdd) {
        await addGuestToEvent(event_id, guestId || 0);
      }
    }

    return { message: "Evento actualizado correctamente." };
  } catch (error: any) {
    console.error("Error actualizando evento", error);
    throw new Error(`${error.message}`);
  }
};

export const deleteEvent = async (
  id_event: number,
  id_user: number,
): Promise<{ message: string }> => {
  try {
    // 🔹 Verificar si el evento existe
    const eventCheck = await client.queryObject<{ id_event: number }>(
      `SELECT id_event FROM "Event" WHERE id_event = $1`,
      [id_event],
    );
    if (eventCheck.rows.length === 0) {
      throw new Error("El evento no existe.");
    }

    // 🔹 Verificar si el editor es uno mismo
    const editorCheck = await client.queryObject<{ id_event: number }>(
      `SELECT created_by, id_event FROM "Event" WHERE id_event = $1 AND created_by = $2`,
      [id_event, id_user],
    );
    if (editorCheck.rows.length === 0) {
      throw new Error("Usted no posee permisos para eliminar este evento.");
    }

    await client.queryArray(
      `DELETE FROM "Event" WHERE id_event = $1;`,
      [id_event],
    );

    return { message: "Evento eliminado correctamente." };
  } catch (error: any) {
    console.error("Error eliminando evento", error);
    throw new Error(error.message);
  }
};

export const checkOwnerOfEvent = async (
  id_event: string,
  id_user: string,
): Promise<{ status: string }> => {
  try {
    // 🔹 Verificar si el editor es uno mismo
    const editorCheck = await client.queryObject<{ id_event: number }>(
      `SELECT created_by, id_event FROM "Event" WHERE id_event = $1 AND created_by = $2`,
      [id_event, id_user],
    );
    if (editorCheck.rows.length === 0) {
      return { status: "guest" };
    }

    return { status: "ok"}
  } catch (error) {
    console.error("Error obteniendo eventos", error);
    throw new Error("Error al obtener eventos");
  }
};
