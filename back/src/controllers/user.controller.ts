import client from "../services/database.ts";
import { UserProps } from "../models/user.model.ts";
import { create, getNumericDate } from "../deps.ts";
import { SECRET_KEY } from "../deps.ts";

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
        const trimmedName = name.trim();
        const result = await client.queryObject<UserProps>(
            `SELECT * FROM "User" WHERE TRIM(name) = $1 LIMIT 1`,
            [trimmedName]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error obteniendo usuario por nombre", error);
        throw new Error("Error al obtener usuario");
    }
};

export const getUserById = async (id: string): Promise<UserProps | null> => {
    try {
        const result = await client.queryObject<UserProps>(
            `SELECT * FROM "User" WHERE id_user = $1 LIMIT 1`,
            [id]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error obteniendo usuario por id", error);
        throw new Error("Error al obtener usuario");
    }
};

export const createUser = async (name: string, password: string): Promise<{ name: string, userToken: string}> => {
    try {
        const result = await client.queryArray<[number]>(
            `SELECT ensure_user_exists('${name}', '${password}')`
        );

        const jwt = await create(
            { alg: "HS256", typ: "JWT" },
            { id: result.rows[0][0], name: name, exp: getNumericDate(60 * 60) }, 
            SECRET_KEY
        );

        return { name, userToken: jwt };
    } catch (error) {
        console.error("Error creando usuario", error);
        throw new Error("Error al crear usuario");
    }
};

export const loginUser = async (name: string, password: string): Promise<{ name: string, userToken: string}> => {
    try {
        const result = await client.queryObject<UserProps>(
            `SELECT * FROM "User" WHERE name = $1 AND password = $2 LIMIT 1`,
            [name, password]
        );

        const jwt = await create(
            { alg: "HS256", typ: "JWT" },
            { id: result.rows[0].id_user, name: name, exp: getNumericDate(60 * 60) }, 
            SECRET_KEY
        );

        return { name, userToken: jwt };
    } catch (error) {
        console.error("Error iniciando sesión", error);
        throw new Error("Error al iniciar sesión");
    }
};