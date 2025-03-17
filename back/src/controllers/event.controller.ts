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

export const getEventsById = async (id: string): Promise<EventProps[]> => {
    try {
        const result = await client.queryObject<EventProps>(
            `SELECT e.*, eg.user_id AS invited_user, c.color, u.name AS name_invited_user
            FROM "Event" e
            LEFT JOIN "EventGuest" eg ON e.id_event = eg.event_id
            LEFT JOIN "User" u ON eg.user_id = u.id_user
            INNER JOIN "Category" c ON e.category_id = c.id_category
            WHERE e.created_by = $1 OR eg.user_id = $1;`,
            [id]
        )

        const eventsMap: { [key: string]: any } = {};

        result.rows.forEach((row: any) => {
            if (!eventsMap[row.id_event]) {
            eventsMap[row.id_event] = {
                ...row,
                invited_user: row.invited_user ? [row.invited_user] : [],
                name_invited_user: row.name_invited_user ? [row.name_invited_user] : []
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
}

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
