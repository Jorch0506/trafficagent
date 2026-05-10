// pages/api/generate.js
// Streaming de respuesta de Claude — el plan se construye en tiempo real

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PLAN_LIMITS = {
  free:    { posts: 2,  articulos: 1,  directorios: 1,  keywordsPrimarias: 3,  keywordsLongTail: 1,  acciones: 3,  analyses: 1   },
  starter: { posts: 10, articulos: 5,  directorios: 5,  keywordsPrimarias: 5,  keywordsLongTail: 3,  acciones: 5,  analyses: 20  },
  growth:  { posts: 25, articulos: 12, directorios: 15, keywordsPrimarias: 10, keywordsLongTail: 8,  acciones: 10, analyses: 60  },
  agency:  { posts: 25, articulos: 12, directorios: 20, keywordsPrimarias: 10, keywordsLongTail: 8,  acciones: 10, analyses: 100 },
};

const BUSINESS_TYPE_TO_NICHE = {
  ecommerce: "ecommerce",
  saas:      "saas",
  local:     "local",
  agency:    "agency",
  health:    "health",
  general:   "general",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url, instagram, facebook, businessType, description, userId } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL requerida" });
  }

  let userPlan = "free";
  let user = null;

  if (userId) {
    const { data: userData, error } = await supabase
      .from("users")
      .select("plan, analyses_used, analyses_limit, subscription_status")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Supabase error:", JSON.stringify(error));
      return res.status(403).json({ error: "Error consultando usuario", detail: error.message });
    }

    if (!userData) {
      return res.status(403).json({ error: "Usuario no encontrado" });
    }

    if (userData.analyses_used >= userData.analyses_limit) {
      return res.status(403).json({
        error: "limite_alcanzado",
        plan: userData.plan,
        used: userData.analyses_used,
        limit: userData.analyses_limit,
      });
    }

    user = userData;
    userPlan = userData.plan || "free";
  }

  const limits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;

  let niche = BUSINESS_TYPE_TO_NICHE[businessType] || "general";

  if (niche === "general") {
    const NICHES = {
      health:    ["health", "salud", "bienestar", "clinic", "medical", "wellness", "preventiva", "doctor", "farmacia", "nutricion", "psicolog"],
      saas:      ["app", "software", "platform", "dashboard", "api", "tool", "service", "tech", "digital", "cloud", "sistema"],
      ecommerce: ["merch", "shop", "store", "tienda", "buy", "beer", "clothing", "apparel", "moda", "zapatos", "productos"],
      local:     ["restaurant", "cafe", "salon", "gym", "clinic", "dental", "hotel", "spa", "taller"],
      agency:    ["agency", "marketing", "design", "consulting", "studio", "agencia", "publicidad"],
    };
    const lower = (url + " " + (description || "")).toLowerCase();
    for (const [n, keywords] of Object.entries(NICHES)) {
      if (keywords.some((k) => lower.includes(k))) { niche = n; break; }
    }
  }

  const systemPrompt = `Eres un experto en marketing digital y SEO para negocios latinoamericanos.
Genera un plan de trafico REAL y ESPECIFICO basado en la informacion del negocio.
Responde UNICAMENTE en JSON valido, sin markdown, sin backticks, sin texto extra antes o despues.

REGLAS ESTRICTAS PARA EVITAR JSON LARGO:
- caption de posts: maximo 200 caracteres
- metaDescription: maximo 120 caracteres
- estructura de articulos: exactamente 3 strings H2
- hashtags: exactamente 3 hashtags por post
- palabrasClave de articulos: exactamente 2 keywords
- potencialCrecimiento: maximo 4 palabras
- competencia.nivel: maximo 2 palabras
- competencia.oportunidad: maximo 8 palabras
- accionesInmediatas: maximo 80 caracteres cada una
- Genera EXACTAMENTE el numero de items indicado en cada array

El JSON debe tener EXACTAMENTE esta estructura:
{
  "niche": "string",
  "keywordsPrimarias": [${limits.keywordsPrimarias} strings],
  "keywordsLongTail": [${limits.keywordsLongTail} strings],
  "traficoEstimado": {"min": number, "max": number, "periodo": "mensual"},
  "competencia": {"nivel": "string", "oportunidad": "string"},
  "posts": [${limits.posts} objetos con {red, tipo, titulo, caption, hashtags}],
  "articulosSEO": [${limits.articulos} objetos con {titulo, slug, metaDescription, palabrasClave, estructura}],
  "directorios": [${limits.directorios} objetos con {nombre, url, prioridad}],
  "accionesInmediatas": [${limits.acciones} strings],
  "scoreSEO": number entre 0 y 100,
  "potencialCrecimiento": "string maximo 4 palabras"
}

Para posts: {"red": "Instagram" o "Facebook", "tipo": "string", "titulo": "string", "caption": "string max 200 chars", "hashtags": ["#h1","#h2","#h3"]}
Para articulosSEO: {"titulo": "string", "slug": "string", "metaDescription": "string max 120 chars", "palabrasClave": ["kw1","kw2"], "estructura": ["H2: string", "H2: string", "H2: string"]}
Para directorios: {"nombre": "string", "url": "string", "prioridad": "Alta" o "Media" o "Baja"}`;

  const prompt = `Analiza este negocio y genera su plan de trafico organico:

URL: ${url}
Instagram: ${instagram || "No tiene"}
Facebook: ${facebook || "No tiene"}
Tipo: ${businessType || "general"}
Descripcion: ${description || "Sin descripcion"}
Nicho: ${niche}
Plan: ${userPlan}

Genera exactamente:
- ${limits.keywordsPrimarias} keywords primarias
- ${limits.keywordsLongTail} keywords long tail
- ${limits.posts} posts (captions max 200 chars cada uno)
- ${limits.articulos} articulos SEO (3 H2 cada uno)
- ${limits.directorios} directorios
- ${limits.acciones} acciones inmediatas`;

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 16000,
        stream: true,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errData = await anthropicRes.json();
      console.error("Anthropic API error:", errData);
      return res.status(500).json({ error: "Error en la API de Anthropic", detail: errData });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const reader = anthropicRes.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);

          if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
            const text = parsed.delta.text;
            fullText += text;
            res.write(`data: ${JSON.stringify({ type: "chunk", text })}\n\n`);
          }

          if (parsed.type === "message_stop") {
            try {
              // FIX: limpiar, extraer y reparar JSON
              const clean = fullText.replace(/```json|```/g, "").trim();
              const jsonMatch = clean.match(/\{[\s\S]*\}/);
              if (!jsonMatch) throw new Error("No se encontró JSON válido en la respuesta");

              // Sanitizar caracteres problemáticos dentro de strings JSON
              // Elimina caracteres de control que rompen el parser
              const sanitized = jsonMatch[0]
                .replace(/[\u0000-\u001F\u007F]/g, (c) => {
                  // Preservar saltos de línea y tabs escapados correctamente
                  if (c === "\n") return "\\n";
                  if (c === "\r") return "\\r";
                  if (c === "\t") return "\\t";
                  return ""; // eliminar otros caracteres de control
                });

              const planData = JSON.parse(sanitized);
              planData._plan = userPlan;
              planData._limits = limits;

              if (userId) {
                await supabase.from("analyses").insert({
                  user_id: userId,
                  site_url: url,
                  plan_data: planData,
                });
                await supabase.rpc("increment_analyses_used", { user_id: userId });

                const newUsed = (user?.analyses_used || 0) + 1;
                const usagePct = (newUsed / (user?.analyses_limit || 1)) * 100;
                if (usagePct >= 80 && usagePct < 100) {
                  const { data: userData } = await supabase
                    .from("users")
                    .select("email")
                    .eq("id", userId)
                    .single();
                  if (userData?.email) {
                    fetch("https://www.caevik.com/api/send-email", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        type: "limit_warning",
                        to: userData.email,
                        plan: userPlan,
                        used: newUsed,
                        limit: user?.analyses_limit,
                      }),
                    }).catch(e => console.error("Warning email error:", e));
                  }
                }
              }

              res.write(`data: ${JSON.stringify({ type: "done", plan: planData })}\n\n`);
            } catch (parseErr) {
              console.error("Error parseando JSON:", parseErr.message);
              console.error("Primeros 500 chars del texto:", fullText.substring(0, 500));
              console.error("Ultimos 500 chars del texto:", fullText.substring(fullText.length - 500));
              res.write(`data: ${JSON.stringify({ type: "error", message: "Error al procesar el plan generado" })}\n\n`);
            }
            res.end();
            return;
          }
        } catch {
          // Ignorar líneas no parseables
        }
      }
    }

    res.end();
  } catch (err) {
    console.error("Error generando plan:", err);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Error generando el plan", detail: err.message });
    }
    res.write(`data: ${JSON.stringify({ type: "error", message: err.message })}\n\n`);
    res.end();
  }
}

export const config = {
  api: {
    responseLimit: false,
    bodyParser: true,
  },
};
