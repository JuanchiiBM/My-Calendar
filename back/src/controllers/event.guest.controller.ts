import { ResponseProps } from "../models/success.model.ts";
import client from "../services/database.ts";

export const addGuestToEvent = async (event_id: number,user_id: number): Promise<ResponseProps> => {
  try {
    // 🔹 Verificar si el evento existe
    const eventCheck = await client.queryObject<{ id_event: number }>(
      `SELECT id_event FROM "Event" WHERE id_event = $1`,
      [event_id]
    );
    if (eventCheck.rows.length === 0) {
      throw new Error("El evento no existe.");
    }

    // 🔹 Verificar si el usuario existe
    const userCheck = await client.queryObject<{ id_user: number }>(
      `SELECT id_user FROM "User" WHERE id_user = $1`,
      [user_id]
    );
    if (userCheck.rows.length === 0) {
      throw new Error("El usuario no existe.");
    }

    // 🔹 Verificar si ya está invitado
    const guestCheck = await client.queryObject<{ user_id: number }>(
      `SELECT user_id FROM "EventGuest" WHERE event_id = $1 AND user_id = $2`,
      [event_id, user_id]
    );
    if (guestCheck.rows.length > 0) {
      return { message: "Invitado omitido ya que ya se encontraba agregado." }
    }

    // 🔹 Agregar invitado
    await client.queryArray(
      `INSERT INTO "EventGuest" (event_id, user_id) VALUES ($1, $2)`,
      [event_id, user_id]
    );

    return { message: "Invitado agregado exitosamente." };
  } catch (error: any) {
    console.error("Error agregando invitado", error);
    throw new Error(`Error al agregar invitado: ${error.message}`);
  }
};

export const removeGuestFromEvent = async (event_id: number, user_id: number): Promise<ResponseProps> => {
  try {
    console.log(event_id, user_id);
    // 🔹 Verificar si el evento existe
    const eventCheck = await client.queryObject<{ id_event: number }>(
      `SELECT id_event FROM "Event" WHERE id_event = $1`,
      [event_id]
    );
    if (eventCheck.rows.length === 0) {
      throw new Error("El evento no existe.");
    }

    // 🔹 Verificar si el usuario está invitado
    const guestCheck = await client.queryObject<{ user_id: number }>(
      `SELECT user_id FROM "EventGuest" WHERE event_id = $1 AND user_id = $2`,
      [event_id, user_id]
    );
    if (guestCheck.rows.length === 0) {
      throw new Error("El usuario no está invitado a este evento.");
    }

    // 🔹 Eliminar invitado
    await client.queryArray(
      `DELETE FROM "EventGuest" WHERE event_id = $1 AND user_id = $2`,
      [event_id, user_id]
    );

    return { status: 'ok', message: "Invitación eliminada." };
  } catch (error: any) {
    console.error("Error eliminando invitado", error);
    throw new Error(`${error.message}`);
  }
};
