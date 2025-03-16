import client from "../services/database.ts";
import { UserProps } from "../models/user.model.ts";

export async function getUsers(): Promise<UserProps[]> {
    try {
        const result = await client.queryObject<UserProps>("SELECT * FROM \"User\"");
        return result.rows;
    } catch (error) {
        console.error("Error obteniendo usuarios", error);
        throw new Error("Error al obtener usuarios");
    }
}

export const getUserByName = async (name: string): Promise<UserProps | null> => {
    try {
        const result = await client.queryObject<UserProps>(
            `SELECT * FROM "User" WHERE name = $1 LIMIT 1`,
            [name]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error obteniendo usuario por nombre", error);
        throw new Error("Error al obtener usuario");
    }
};

export const createUser = async (name: string, password: string): Promise<UserProps> => {
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

export const loginUser = async (name: string, password: string): Promise<UserProps | null> => {
    try {
        const result = await client.queryObject<UserProps>(
            `SELECT * FROM "User" WHERE name = $1 AND password = $2 LIMIT 1`,
            [name, password]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error iniciando sesión", error);
        throw new Error("Error al iniciar sesión");
    }
};