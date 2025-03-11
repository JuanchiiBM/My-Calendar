import { getUsers, createUser, loginUser } from "../../controllers/user.controller.ts";
import { stub, assertRejects, assertEquals, QueryArrayResult, QueryObjectResult } from "../../deps.ts";
import client from "../../services/database.ts";
import { UserProps } from "../../models/user.model.ts";

// getUsers //

Deno.test("getUsers debe devolver una lista de usuarios", async () => {
    const mockUsers: UserProps[] = [
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
    } as unknown as QueryObjectResult<UserProps>));
    
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

Deno.test("loginUser debe devolver un usuario si las credenciales son correctas", async () => {
    const mockUser: UserProps = { id_user: 1, name: "Juan", password: "1234" };

    // 🔥 Stub para evitar acceder a la base de datos real
    const dbStub = stub(client, "queryObject", async () => ({
        rows: [mockUser], // ✅ Simulamos que encontró un usuario
        rowDescription: { columns: [] },
        command: "SELECT",
        rowCount: 1,
        warnings: [],
        insertRow: undefined
    } as unknown as QueryObjectResult<UserProps>));

    const user = await loginUser("Juan", "1234");

    assertEquals(user, mockUser); // ✅ Verifica que el usuario devuelto es el correcto

    dbStub.restore();
});

Deno.test("loginUser debe devolver null si las credenciales son incorrectas", async () => {
    // 🔥 Stub para simular que no se encontró un usuario con esas credenciales
    const dbStub = stub(client, "queryObject", async () => ({
        rows: [], // ✅ Simulamos que no encontró ningún usuario
        rowDescription: { columns: [] },
        command: "SELECT",
        rowCount: 0,
        warnings: [],
        insertRow: undefined
    } as unknown as QueryObjectResult<UserProps>));

    const user = await loginUser("Juan", "wrongpassword");

    assertEquals(user, null); // ✅ Debe devolver null

    dbStub.restore();
});

Deno.test("loginUser debe lanzar un error si la consulta falla", async () => {
    // 🔥 Stub para simular un error en la base de datos
    const dbStub = stub(client, "queryObject", async () => {
        throw new Error("DB error");
    });

    await assertRejects(async () => {
        await loginUser("Juan", "1234");
    }, Error, "Error al iniciar sesión");

    dbStub.restore();
});

// createUser

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