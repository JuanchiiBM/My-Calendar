import client from "../services/database.ts";
import { User } from "../models/user.model.ts";

export const getUsers = async (): Promise<User[]> => {
    try {
        const result = await client.queryObject<User>("SELECT * FROM \"User\"");
        return result.rows;
    } catch (error) {
        console.error("Error obteniendo usuarios", error);
        throw new Error("Error al obtener usuarios");
    }
};

export const getUserByName = async (name: string): Promise<User | null> => {
    try {
        const result = await client.queryObject<User>(
            `SELECT * FROM "User" WHERE name = $1 LIMIT 1`,
            [name]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error obteniendo usuario por nombre", error);
        throw new Error("Error al obtener usuario");
    }
};

export const createUser = async (name: string, password: string): Promise<User> => {
    try {
        const result = await client.queryArray<[number]>(
            `SELECT ensure_user_exists('${name}', '${password}')`
        );
        return { id_user: result.rows[0][0] as number, name, password };
    } catch (error) {
        console.error("Error creando usuario", error);
        throw new Error("Error al crear usuario");
    }
};