import client from "../services/database.ts";
import { connections } from "../services/websocket.ts"; // Ajusta el path según tu estructura
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
            `(SELECT * FROM "Notification"
                WHERE id_destination = $1 AND saw = false
                ORDER BY id_notification DESC
                )UNION ALL
                (SELECT * FROM "Notification"
                WHERE id_destination = $1 AND saw = true
                ORDER BY id_notification DESC
                LIMIT GREATEST(0, 10 - (
                    SELECT COUNT(*) FROM "Notification"
                    WHERE id_destination = $1 AND saw = false)))`,
            [id_destination]
        );
        return result.rows;
    } catch (error) {
        console.error("Error obteniendo notificaciones", error);
        throw new Error("Error al obtener notificaciones");
    }
}

export const createNotification = async (notification: NotificationProps, created_by: number, id_destination: number): Promise<ResponseProps> => {
    try {
        const userDestination = await getUserById(id_destination.toString())
        if (!userDestination) {
            throw new Error("El usuario no existe");
        }

        if (userDestination.id_user == created_by) {
            throw new Error("No puedes crearte una notificación a ti mismo");
        }

        await client.queryObject<NotificationProps>(
            `INSERT INTO "Notification" (id_destination, created_by, created_at, title, message, saw) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                id_destination,
                created_by,
                notification.created_at,
                notification.title,
                notification.message,
                notification.saw
            ]
        );

        const socket = connections.get(id_destination);
        if (socket) {
            socket.send(JSON.stringify({
                type: "notification",
                title: notification.title,
                message: notification.message,
                created_at: notification.created_at
            }));
        }
        return { status: 'ok', message: 'Notificación creada' };
    } catch (error) {
        console.error("Error creando notificación", error);
        throw new Error("Error al crear notificación");
    }
}

export const updateNotification = async (notification: NotificationProps, id_destination: number): Promise<ResponseProps> => {
    try {
        const userDestination = await getUserById(notification.id_destination.toString())
        if (!userDestination) {
            throw new Error("El usuario no existe");
        }

        console.log(notification.id_destination, id_destination)
        if (notification.id_destination != id_destination) {
            throw new Error("No puedes marcar como visto una notificación que no es para tí");
        }

        await client.queryObject<NotificationProps>(
            `UPDATE "Notification" SET title = $1, message = $2, saw = $3 WHERE id_notification = $4 AND id_destination = $5 RETURNING *`,
            [
                notification.title,
                notification.message,
                notification.saw,
                notification.id_notification,
                notification.id_destination
            ]
        );
        return { status: 'ok', message: 'Notificación actualizada' };
    } catch (error) {
        console.error("Error actualizando notificación", error);
        throw new Error("Error al actualizar notificación");
    }
}