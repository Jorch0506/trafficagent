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

  // Determinar plan del usuario
  let userPlan = "free";

  if (userId) {
    const { data: user, error } = await supabase
      .from("users")
      .select("plan, analyses_used, analyses_limit, subscription_status")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Supabase error:", JSON.stringify(error));
      return res.status(403).json({ error: "Error consultando usuario", detail: error.message });
    }

    if (!user) {
      return res.status(403).json({ error: "Usuario no encontrado" });
    }

    if (user.analyses_used >= user.analyses_limit) {
      return res.status(403).json({
        error: "limite_alcanzado",
        plan: user.plan,
        used: user.analyses_used,
        limit: user.analyses_limit,
      });
    }

    userPlan = user.plan || "free";
  }

  const limits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;

  // Detección de nicho — tipo seleccionado tiene prioridad
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

  const systemPrompt = `Eres un experto en marketing digital, SEO, y generacion de trafico organico para negocios latinoamericanos.
Genera un plan de trafico REAL y ESPECIFICO basado en la informacion del negocio.
Responde UNICAMENTE en JSON valido, sin markdown, sin backticks, sin texto extra.

IMPORTANTE:
- potencialCrecimiento: maximo 4 palabras
- competencia.nivel: maximo 2 palabras  
- competencia.oportunidad: maximo 8 palabras
- Genera EXACTAMENTE el numero de items indicado en cada array
- El plan debe ser 100% especifico para el tipo de negocio y nicho indicado

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

Para posts: {"red": "Instagram" o "Facebook", "tipo": "string", "titulo": "string", "caption": "string", "hashtags": ["#h1","#h2","#h3"]}
Para articulosSEO: {"titulo": "string", "slug": "string", "metaDescription": "string", "palabrasClave": ["kw1","kw2"], "estructura": ["H2: string", "H2: string"]}
Para directorios: {"nombre": "string", "url": "string", "prioridad": "Alta" o "Media" o "Baja"}`;

  const prompt = `Analiza este negocio y genera su plan de trafico organico completo:

URL: ${url}
Instagram: ${instagram || "No tiene"}
Facebook: ${facebook || "No tiene"}
Tipo de negocio: ${businessType || "general"}
Descripcion: ${description || "Sin descripcion adicional"}
Nicho detectado: ${niche}
Plan del usuario: ${userPlan}

IMPORTANTE: El plan debe ser completamente especifico para el nicho "${niche}".

Genera:
- ${limits.keywordsPrimarias} keywords primarias REALES para este nicho
- ${limits.keywordsLongTail} keywords long tail especificas
- ${limits.posts} posts con captions REALES listos para publicar
- ${limits.articulos} articulos SEO con estructura real
- ${limits.directorios} directorios donde REALMENTE debe aparecer este negocio
- ${limits.acciones} acciones inmediatas prioritarias`;

  try {
    // Llamada a Anthropic con streaming activado
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

    // Configurar headers para streaming SSE
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

          // Extraer texto del delta
          if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
            const text = parsed.delta.text;
            fullText += text;
            // Enviar cada chunk al frontend
            res.write(`data: ${JSON.stringify({ type: "chunk", text })}\n\n`);
          }

          // Señal de fin de stream
          if (parsed.type === "message_stop") {
            try {
              const clean = fullText.replace(/```json|```/g, "").trim();
              const planData = JSON.parse(clean);

              planData._plan = userPlan;
              planData._limits = limits;

              // Guardar en historial e incrementar contador
              if (userId) {
                await supabase.from("analyses").insert({
                  user_id: userId,
                  site_url: url,
                  plan_data: planData,
                });
                await supabase.rpc("increment_analyses_used", { user_id: userId });

                // Enviar warning al llegar al 80% del límite
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

              // Enviar el plan completo al final
              res.write(`data: ${JSON.stringify({ type: "done", plan: planData })}\n\n`);
            } catch (parseErr) {
              console.error("Error parseando JSON:", parseErr);
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
