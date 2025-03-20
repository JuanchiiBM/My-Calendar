export const generateKey = async (secret: string): Promise<CryptoKey> => {
    return await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret), // 🔹 Convierte el string en un buffer
      { name: "HMAC", hash: "SHA-256" }, // 🔹 Algoritmo de encriptación
      false,
      ["sign", "verify"]
    );
  };