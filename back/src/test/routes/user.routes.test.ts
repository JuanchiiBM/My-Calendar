import * as userController from "../../controllers/user.controller.ts";
import { handleUserRequest } from "../../routes/user.routes.ts";
import { stub, assertRejects, assertEquals } from "../../deps.ts";
import client from "../../services/database.ts";
import { UserProps } from "../../models/user.model.ts";
import { QueryObjectResult, QueryArrayResult } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

Deno.test("GET /api/users debe devolver una lista de usuarios", async () => {
    const mockUsers = [
        { id_user: 1, name: "Juan", password: "1234" },
        { id_user: 2, name: "Maria", password: "abcd" }
    ];

    const dbStub = stub(client, "queryObject", async () => ({
        rows: mockUsers,
        rowDescription: { columns: [] },
        command: "SELECT",
        rowCount: mockUsers.length,
        warnings: [],
        insertRow: undefined
    } as unknown as QueryObjectResult<UserProps>));

    const request = new Request("http://localhost/api/users", { method: "GET" });
    const response = await handleUserRequest(request);

    const jsonResponse = await response.json();

    assertEquals(response.status, 200);
    assertEquals(jsonResponse, mockUsers);

    dbStub.restore(); // 🔥 Restauramos el stub después del test
});


Deno.test("GET /api/users/:name debe devolver un usuario si existe", async () => {
    const mockUser = { id_user: 1, name: "Juan", password: "1234" };

    // 🔥 Stub directamente sobre la base de datos simulando que el usuario existe
    const dbStub = stub(client, "queryObject", async () => ({
        rows: [mockUser], // ✅ Debe ser un array
        rowDescription: { columns: [] },
        command: "SELECT",
        rowCount: 1, // ✅ Debe ser un número
        warnings: [],
        insertRow: undefined
    } as unknown as QueryObjectResult<UserProps>));
    
    const request = new Request("http://localhost/api/users/Juan", { method: "GET" });
    const response = await handleUserRequest(request);

    const jsonResponse = await response.json(); // ✅ Guardamos JSON antes de comparar

    assertEquals(response.status, 200);
    assertEquals(jsonResponse, mockUser); // ✅ Comparación correcta
    
    dbStub.restore();
});


Deno.test("GET /api/users/:name debe devolver 404 si el usuario no existe", async () => {
    // 🔥 Stub directamente sobre la base de datos para simular que no hay usuario
    const dbStub = stub(client, "queryObject", async () => ({
        rows: [], // Simulamos que no se encontraron usuarios
        rowDescription: { columns: [] },
        command: "SELECT",
        rowCount: 0,
        warnings: [],
        insertRow: undefined
    } as unknown as QueryObjectResult<UserProps>));

    const request = new Request("http://localhost/api/users/Desconocido", { method: "GET" });
    const response = await handleUserRequest(request);

    assertEquals(response.status, 404);
    assertEquals(await response.json(), { error: "Usuario no encontrado" });

    dbStub.restore(); // 🔥 Restauramos el stub después del test
});


Deno.test("POST /api/users debe crear un usuario nuevo", async () => {
    const mockUser = { id_user: 3, name: "Carlos", password: "5678" };

    // 🔥 Stub para evitar que la base de datos real se use
    const dbStub = stub(client, "queryObject", async () => ({
        rows: [],
        rowDescription: { columns: [] },
        command: "SELECT",
        rowCount: 0,
        warnings: [],
        insertRow: undefined
    } as unknown as QueryObjectResult<UserProps>));

    const dbInsertStub = stub(client, "queryArray", async () => ({
        rows: [[mockUser.id_user]], // ✅ Simulamos que devuelve un ID nuevo
        rowCount: 1,
        command: "SELECT",
        warnings: [],
        rowDescription: { columns: [] },
        insertRow: undefined
    } as unknown as QueryArrayResult<[UserProps]>));

    const request = new Request("http://localhost/api/users", {
        method: "POST",
        body: JSON.stringify({ name: "Carlos", password: "5678" }),
        headers: { "Content-Type": "application/json" }
    });

    const response = await handleUserRequest(request);
    const jsonResponse = await response.json(); // ✅ Guardamos JSON antes de comparar

    assertEquals(response.status, 201);
    assertEquals(jsonResponse, {message: "Creación de usuario exitosa"});

    dbStub.restore();
    dbInsertStub.restore();
});

Deno.test("POST /api/users debe devolver 400 si el usuario ya existe", async () => {
    const mockUser = { id_user: 1, name: "Juan", password: "1234" };
    
    // 🔥 Stub para evitar que la base de datos real se use
    const dbStub = stub(client, "queryObject", async () => ({
        rows: [[mockUser.id_user]],
        rowDescription: { columns: [] },
        command: "SELECT",
        rowCount: 0,
        warnings: [],
        insertRow: undefined
    } as unknown as QueryObjectResult<UserProps>));

    const dbInsertStub = stub(client, "queryArray", async () => ({
        rows: [[mockUser.id_user]], // ✅ Simulamos que devuelve un ID nuevo
        rowCount: 1,
        command: "SELECT",
        warnings: [],
        rowDescription: { columns: [] },
        insertRow: undefined
    } as unknown as QueryArrayResult<[UserProps]>));
    
    const request = new Request("http://localhost/api/users", {
        method: "POST",
        body: JSON.stringify({ name: "Juan", password: "1234" }),
        headers: { "Content-Type": "application/json" }
    });
    
    const response = await handleUserRequest(request);
    
    assertEquals(response.status, 400);
    assertEquals(await response.json(), { error: "El usuario ya existe" });
    
    dbStub.restore();
    dbInsertStub.restore();
});