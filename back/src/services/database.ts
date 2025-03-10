import { Client } from "../deps.ts";

const client = new Client({
  user: Deno.env.get("DB_USER") ?? "postgres",
  password: Deno.env.get("DB_PASSWORD") ?? "Philipso1965!",
  database: Deno.env.get("DB_NAME") ?? "calendar_db",
  hostname: Deno.env.get("DB_HOST") ?? "localhost",
  port: Number(Deno.env.get("DB_PORT")) ?? 5432,
});

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("✅ Conectado a PostgreSQL");
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error);
  }
};

export default client;