import client from "../services/database.ts";
import { EventProps } from "../models/event.model.ts";

export const getEvents = async (): Promise<EventProps[]> => {
    try {
        const result = await client.queryObject<EventProps>(
            `SELECT e.*, c.color 
             FROM "Event" e
             INNER JOIN "Category" c ON e.category_id = c.id_category`
        );
        return result.rows;
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
    created_by: number, // ✅ Agregado como obligatorio
    guests?: number[]
): Promise<EventProps> => {
    try {
        // 🔹 Verificar si la categoría existe
        const categoryCheck = await client.queryObject(
            `SELECT id_category FROM "Category" WHERE id_category = $1`,
            [category_id]
        );
        if (categoryCheck.rows.length === 0) {
            throw new Error("La categoría no existe");
        }

        // 🔹 Insertar evento en la base de datos
        const result = await client.queryArray<[number]>(
            `INSERT INTO "Event" (title, description, start_date, end_date, category_id, created_by)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id_event`,
            [title, description, start_date, end_date, category_id, created_by]
        );

        const event_id = result.rows[0][0];

        // 🔹 Insertar invitados en la tabla intermedia (solo si `guests` tiene valores)
        if (guests && guests.length > 0) {
            for (const guest_id of guests) {
                await client.queryArray(
                    `INSERT INTO "EventGuest" (event_id, user_id) VALUES ($1, $2)`,
                    [event_id, guest_id]
                );
            }
        }

        return { id_event: event_id, title, description, start_date, end_date, category_id, created_by };
    } catch (error: any) {
        console.error("Error creando evento", error);
        throw new Error(`Error al crear evento: ${error.message}`);
    }
};
