import client from "../services/database.ts";
import { NotificationProps } from "../models/notification.model.ts";
import { getUserById } from "./user.controller.ts";
import { ResponseProps } from "../models/success.model.ts";

export const getNotifications = async (id_destination: number): Promise<NotificationProps[]> => {
    try {
        if (!id_destination) {
            throw new Error("Falta el id de destino");
        }

        const userDestination = await getUserById(id_destination.toString())
        if (!userDestination) {
            throw new Error("El usuario no existe");
        }

        const result = await client.queryObject<NotificationProps>(
            `SELECT * FROM "Notification" WHERE id_destination = $1 ORDER BY created_at DESC`,
            [id_destination]
        );
        return result.rows;
    } catch (error) {
        console.error("Error obteniendo notificaciones", error);
        throw new Error("Error al obtener notificaciones");
    }
}

export const createNotification = async (notification: NotificationProps, created_by: number): Promise<ResponseProps> => {
    try {
        const userDestination = await getUserById(notification.id_destination.toString())
        if (!userDestination) {
            throw new Error("El usuario no existe");
        }

        if (userDestination.id_user == created_by) {
            throw new Error("No puedes crearte una notificación a ti mismo");
        }

        await client.queryObject<NotificationProps>(
            `INSERT INTO "Notification" (id_destination, created_by, created_at, title, message, saw) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                notification.id_destination,
                created_by,
                notification.created_at,
                notification.title,
                notification.message,
                notification.saw
            ]
        );
        return { status: 'ok', message: 'Notificación creada' };
    } catch (error) {
        console.error("Error creando notificación", error);
        throw new Error("Error al crear notificación");
    }
}