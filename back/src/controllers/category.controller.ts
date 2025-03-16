import client from "../services/database.ts";
import { CategoryProps } from "../models/category.model.ts"

export const getCategorys = async (): Promise<CategoryProps[]> => {
    try {
        const result = await client.queryObject<CategoryProps>(
            `SELECT * FROM "Category"`
        );
        return result.rows;
    } catch (error) {
        console.error("Error obteniendo categorías", error);
        throw new Error("Error al obtener categorías");
    }
};