import { getUsers, createUser } from "../../controllers/user.controller.ts";
import { stub, assertRejects, assertEquals, QueryArrayResult, QueryObjectResult } from "../../deps.ts";
import client from "../../services/database.ts";
import { User } from "../../models/user.model.ts";

// getUsers //

Deno.test("getUsers debe devolver una lista de usuarios", async () => {
    const mockUsers: User[] = [
        { id_user: 1, name: "Juan", password: "1234" },
        { id_user: 2, name: "Maria", password: "abcd" }
    ];

    const dbStub = stub(client, "queryObject", async () => ({
        rows: mockUsers,
        rowDescription: { columns: [] },
        command: "SELECT",
        rowCount: mockUsers.length,
        warnings: [],
        insertRow: undefined,
        query: "SELECT * FROM \"User\"",  // Se agrega query como parte del objeto simulado
        loadColumnDescriptions: () => [] as any,  // Se simula esta función
        handleCommandComplete: () => {} // Se simula esta función vacía
    } as unknown as QueryObjectResult<User>));
    
    const users = await getUsers();
    assertEquals(users, mockUsers);
    
    dbStub.restore();
});

Deno.test("getUsers debe lanzar un error si la consulta falla", async () => {
  const dbStub = stub(client, "queryObject", async () => {
    throw new Error("DB error");
  });

  await assertRejects( async () => {
      await getUsers();
    }, Error, "Error al obtener usuarios");

  dbStub.restore();
});

// createUser //

Deno.test("createUser debe devolver un usuario creado correctamente", async () => {
    const mockUser = { id_user: 3, name: "Carlos", password: "5678" };

    const dbStub = stub(client, "queryArray", async () => ({
        rows: [[mockUser.id_user]],
        rowCount: 1,
        command: "SELECT",
        warnings: [],
        rowDescription: { columns: [] },
        insertRow: undefined
    } as unknown as QueryArrayResult<[number]>));
    
    
    const user = await createUser(mockUser.name, mockUser.password);
    assertEquals(user, mockUser);
    
    dbStub.restore();
});

Deno.test("createUser debe lanzar un error si la consulta falla", async () => {
    const dbStub = stub(client, "queryArray", async () => { throw new Error("DB error"); });
    
    await assertRejects(async () => {
        await createUser("ErrorUser", "error123");
    }, Error, "Error al crear usuario");
    
    dbStub.restore();
});