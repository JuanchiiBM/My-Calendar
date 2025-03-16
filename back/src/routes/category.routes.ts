import { getCategorys } from "../controllers/category.controller.ts";
import { corsHeaders } from "../deps.ts";

export const handleCategoryRequest = async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    // GET /api/categorys
    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    if (req.method === "GET" && url.pathname === "/api/categorys") {
      const events = await getCategorys();
      return new Response(JSON.stringify(events), {
        status: 200,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ error: "Ruta no encontrada" }), {
      status: 404,
      headers: corsHeaders,
    });

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: `${error.message}` }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
};
