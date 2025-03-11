import { assertEquals, assertRejects } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { stub } from "https://deno.land/std@0.202.0/testing/mock.ts";
import client from "../../services/database.ts";
import { getEvents, createEvent } from "../../controllers/event.controller.ts";
import { EventProps } from "../../models/event.model.ts";
import { QueryObjectResult, QueryArrayResult } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

Deno.test("getEvents debe devolver una lista de eventos", async () => {
    const mockEvents: EventProps[] = [
        { id_event: 1, title: "Evento 1", description: "Desc 1", start_date: "2024-03-10T10:00:00", end_date: "2024-03-10T11:00:00", category_id: 1, created_by: 1 },
        { id_event: 2, title: "Evento 2", description: "Desc 2", start_date: "2024-03-11T10:00:00", end_date: "2024-03-11T11:00:00", category_id: 2, created_by: 2 }
    ];

    // 🔥 Stub para simular la consulta a la base de datos
    const dbStub = stub(client, "queryObject", async () => ({
        rows: mockEvents,
        rowDescription: { columns: [] },
        command: "SELECT",
        rowCount: mockEvents.length,
        warnings: [],
        insertRow: undefined
    } as unknown as QueryObjectResult<EventProps>));

    const events = await getEvents();

    assertEquals(events, mockEvents); // ✅ Verificar que devuelve los eventos simulados

    dbStub.restore();
});

Deno.test("getEvents debe lanzar un error si la consulta falla", async () => {
    // 🔥 Stub para simular error en la consulta
    const dbStub = stub(client, "queryObject", async () => {
        throw new Error("DB error");
    });

    await assertRejects(
        async () => await getEvents(),
        Error,
        "Error al obtener eventos"
    );

    dbStub.restore();
});

Deno.test("createEvent debe devolver un evento creado correctamente", async () => {
    const mockEvent: EventProps = { id_event: 3, title: "Evento Nuevo", description: "Desc", start_date: "2024-03-12T10:00:00", end_date: "2024-03-12T11:00:00", category_id: 1, created_by: 1 };

    // 🔥 Stub para simular la verificación de categoría
    const categoryStub = stub(client, "queryObject", async () => ({
        rows: [{ id_category: 1 }],
        rowDescription: { columns: [] },
        command: "SELECT",
        rowCount: 1,
        warnings: [],
        insertRow: undefined
    } as unknown as QueryObjectResult<{ id_category: number }>));

    // 🔥 Stub para simular la inserción del evento
    const eventStub = stub(client, "queryArray", async () => ({
        rows: [[mockEvent.id_event]],
        rowCount: 1,
        command: "INSERT",
        warnings: [],
        rowDescription: { columns: [] },
        insertRow: undefined
    } as unknown as QueryArrayResult<[number]>));

    const event = await createEvent(mockEvent.title, mockEvent.description, mockEvent.start_date, mockEvent.end_date, mockEvent.category_id, mockEvent.created_by);

    assertEquals(event, mockEvent);

    categoryStub.restore();
    eventStub.restore();
});

Deno.test("createEvent debe lanzar un error si la categoría no existe", async () => {
    // 🔥 Stub para simular que la categoría no existe
    const categoryStub = stub(client, "queryObject", async () => ({
        rows: [],
        rowDescription: { columns: [] },
        command: "SELECT",
        rowCount: 0,
        warnings: [],
        insertRow: undefined
    } as unknown as QueryObjectResult<{ id_category: number }>));

    await assertRejects(
        async () => await createEvent("Evento Malo", "Desc", "2024-03-12T10:00:00", "2024-03-12T11:00:00", 99, 1),
        Error,
        "La categoría no existe"
    );

    categoryStub.restore();
});

Deno.test("createEvent debe lanzar un error si la consulta falla", async () => {
    // 🔥 Stub para simular error en la base de datos
    const dbStub = stub(client, "queryArray", async () => {
        throw new Error("DB error");
    });

    await assertRejects(
        async () => await createEvent("Evento Fallido", "Desc", "2024-03-12T10:00:00", "2024-03-12T11:00:00", 1, 1),
        Error,
        "Error al crear evento"
    );

    dbStub.restore();
    await client.end()
});
