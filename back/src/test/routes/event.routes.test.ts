import { handleEventRequest } from "../../routes/event.routes.ts";
import * as eventController from "../../controllers/event.controller.ts";
import * as userController from "../../controllers/user.controller.ts";
import { stub, assertRejects, assertEquals, QueryArrayResult, QueryObjectResult } from "../../deps.ts";
import client from "../../services/database.ts";
import { EventProps } from "../../models/event.model.ts";

// Proxy para evitar conflictos de stub
const eventControllerProxy = { ...eventController };
const userControllerProxy = { ...userController };

// 🔹 GET /api/events debe devolver una lista de eventos
Deno.test("GET /api/events debe devolver una lista de eventos", async () => {
    const mockEvents: EventProps[] = [
        { id_event: 1, title: "Evento 1", description: "Desc 1", start_date: "2024-05-01", end_date: "2024-05-02", category_id: 1, created_by: 1 },
        { id_event: 2, title: "Evento 2", description: "Desc 2", start_date: "2024-06-01", end_date: "2024-06-02", category_id: 2, created_by: 2 }
    ];

    const dbStub = stub(client, "queryObject", async () => ({
        rows: mockEvents,
        rowDescription: { columns: [] },
        command: "SELECT",
        rowCount: mockEvents.length,
        warnings: [],
        insertRow: undefined
    } as unknown as QueryObjectResult<EventProps>));

    const request = new Request("http://localhost/api/events", { method: "GET" });
    const response = await handleEventRequest(request);
    const jsonResponse = await response.json();

    assertEquals(response.status, 200);
    assertEquals(jsonResponse, mockEvents);

    dbStub.restore();
});

// 🔹 GET /api/events debe manejar un error en la base de datos
Deno.test("GET /api/events debe manejar un error en la base de datos", async () => {
    const dbStub = stub(client, "queryObject", async () => {
        throw new Error("DB error");
    });

    const request = new Request("http://localhost/api/events", { method: "GET" });
    const response = await handleEventRequest(request);

    assertEquals(response.status, 500);
    assertEquals(await response.json(), { error: "Error al obtener eventos" });

    dbStub.restore();
});

// 🔹 POST /api/events debe crear un evento correctamente
Deno.test("POST /api/events debe crear un evento correctamente", async () => {
    const mockEvent = { id_event: 3, title: "Nuevo Evento", description: "Desc 3", start_date: "2024-07-01", end_date: "2024-07-02", category_id: 1, created_by: 1 };

    const dbStub = stub(client, "queryArray", async () => ({
        rows: [[mockEvent.id_event]],
        rowCount: 1,
        command: "INSERT",
        warnings: [],
        rowDescription: { columns: [] },
        insertRow: undefined
    } as unknown as QueryArrayResult<[number]>));

    const request = new Request("http://localhost/api/events", {
        method: "POST",
        body: JSON.stringify({
            title: "Nuevo Evento",
            description: "Desc 3",
            start_date: "2024-07-01",
            end_date: "2024-07-02",
            category_id: 1,
            created_by: 1
        }),
        headers: { "Content-Type": "application/json" }
    });

    const response = await handleEventRequest(request);
    const jsonResponse = await response.json();

    assertEquals(response.status, 201);
    assertEquals(jsonResponse, mockEvent);

    dbStub.restore();
});

// 🔹 POST /api/events debe devolver 400 si faltan datos obligatorios
Deno.test("POST /api/events debe devolver 400 si faltan datos obligatorios", async () => {
    const request = new Request("http://localhost/api/events", {
        method: "POST",
        body: JSON.stringify({ title: "Evento sin fecha" }),
        headers: { "Content-Type": "application/json" }
    });

    const response = await handleEventRequest(request);

    assertEquals(response.status, 400);
    assertEquals(await response.json(), { error: "Faltan datos obligatorios" });
});

// 🔹 POST /api/events debe devolver 400 si un invitado no es un usuario
Deno.test("POST /api/events debe devolver 400 si un invitado no es un usuario", async () => {
    const getUserStub = stub(userControllerProxy, "getUserByName", async (name: string) => {
        if (name === "UsuarioExistente") return { id_user: 1, name: "UsuarioExistente", password: "1234" };
        return null;
    });

    const request = new Request("http://localhost/api/events", {
        method: "POST",
        body: JSON.stringify({
            title: "Evento con invitado desconocido",
            description: "Desc 4",
            start_date: "2024-07-01",
            end_date: "2024-07-02",
            category_id: 1,
            created_by: 1,
            guests: ["UsuarioDesconocido"]
        }),
        headers: { "Content-Type": "application/json" }
    });

    const response = await handleEventRequest(request);

    assertEquals(response.status, 400);
    assertEquals(await response.json(), { error: "Alguno de los invitados no es un usuario" });

    getUserStub.restore();
});

// 🔹 POST /api/events debe manejar un error en la base de datos
Deno.test("POST /api/events debe manejar un error en la base de datos", async () => {
    const dbStub = stub(client, "queryArray", async () => {
        throw new Error("DB error");
    });

    const request = new Request("http://localhost/api/events", {
        method: "POST",
        body: JSON.stringify({
            title: "Evento con error",
            description: "Desc 5",
            start_date: "2024-07-01",
            end_date: "2024-07-02",
            category_id: 1,
            created_by: 1
        }),
        headers: { "Content-Type": "application/json" }
    });

    const response = await handleEventRequest(request);

    assertEquals(response.status, 500);
    assertEquals(await response.json(), { error: "Error al crear evento: DB error" });

    dbStub.restore();
});
