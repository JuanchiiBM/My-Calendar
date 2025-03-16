import { Client } from "https://deno.land/x/postgres/mod.ts";
import { assertEquals, assertRejects } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { QueryObjectResult, QueryArrayResult } from "https://deno.land/x/postgres@v0.19.3/query/query.ts";
import { stub, returnsNext, assertSpyCalls } from "https://deno.land/std/testing/mock.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Permitir todas las solicitudes
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Métodos permitidos
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // Headers permitidos
};

export {Client, corsHeaders, stub, assertEquals, assertRejects, returnsNext, assertSpyCalls, QueryArrayResult, QueryObjectResult}