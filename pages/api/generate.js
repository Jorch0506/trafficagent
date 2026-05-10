// pages/api/generate.js
// Output diferenciado por plan: free / starter / growth / agency

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

// Mapa de tipo de negocio seleccionado → nicho
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
      console.error("Usuario no encontrado para id:", userId);
      return res.status(403).json({ error: "Usuario no encontrado" });
    }

    console.log("Usuario encontrado:", user.plan, user.analyses_used, user.analyses_limit);

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

  // Detección de nicho — el tipo de negocio seleccionado tiene prioridad
  // Si el usuario eligió algo específico, usarlo directamente
  let niche = BUSINESS_TYPE_TO_NICHE[businessType] || "general";

  // Solo usar detección automática si el tipo es "general"
  if (niche === "general") {
    const NICHES = {
      health:    ["health", "salud", "bienestar", "clinic", "medical", "wellness", "preventiva", "doctor", "farmacia", "nutricion", "psicolog"],
      saas:      ["app", "software", "platform", "dashboard", "api", "tool", "service", "tech", "digital", "cloud", "sistema"],
      ecommerce: ["merch", "shop", "store", "tienda", "buy", "beer", "clothing", "apparel", "moda", "zapatos", "productos"],
      local:     ["restaurant", "cafe", "salon", "gym", "clinic", "dental", "hotel", "spa", "taller", "plomero"],
      agency:    ["agency", "marketing", "design", "consulting", "studio", "agencia", "publicidad"],
    };

    const lower = (url + " " + (description || "")).toLowerCase();
    for (const [n, keywords] of Object.entries(NICHES)) {
      if (keywords.some((k) => lower.includes(k))) {
        niche = n;
        break;
      }
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

El JSON debe tener EXACTAMENTE esta estructura con estos conteos:
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

Para los posts usa exactamente este formato por objeto:
{"red": "Instagram" o "Facebook", "tipo": "string", "titulo": "string", "caption": "string", "hashtags": ["#h1","#h2","#h3"]}

Para articulosSEO:
{"titulo": "string", "slug": "string", "metaDescription": "string", "palabrasClave": ["kw1","kw2"], "estructura": ["H2: string", "H2: string", "H2: string"]}

Para directorios:
{"nombre": "string", "url": "string", "prioridad": "Alta" o "Media" o "Baja"}`;

  const prompt = `Analiza este negocio y genera su plan de trafico organico completo:

URL: ${url}
Instagram: ${instagram || "No tiene"}
Facebook: ${facebook || "No tiene"}
Tipo de negocio: ${businessType || "general"}
Descripcion: ${description || "Sin descripcion adicional"}
Nicho detectado: ${niche}
Plan del usuario: ${userPlan}

IMPORTANTE: El plan debe ser completamente especifico para el nicho "${niche}".
Si el nicho es "health", enfocate en salud, bienestar y prevencion.
Si el nicho es "saas", enfocate en software, tecnologia y soluciones digitales.
Si el nicho es "local", enfocate en busquedas locales y Google My Business.
Si el nicho es "agency", enfocate en servicios B2B y generacion de leads.
Si el nicho es "ecommerce", enfocate en productos, compras y conversion.

Genera:
- ${limits.keywordsPrimarias} keywords primarias REALES para este nicho especifico
- ${limits.keywordsLongTail} keywords long tail especificas para este nicho
- ${limits.posts} posts con captions REALES listos para publicar (mezcla Instagram y Facebook)
- ${limits.articulos} articulos SEO con estructura real y meta descriptions
- ${limits.directorios} directorios donde REALMENTE debe aparecer este tipo de negocio
- ${limits.acciones} acciones inmediatas prioritarias para este nicho`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 16000,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic API error:", data);
      return res.status(500).json({ error: "Error en la API de Anthropic", detail: data });
    }

    const raw = data.content?.[0]?.text || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    parsed._plan = userPlan;
    parsed._limits = limits;

    if (userId) {
      const { error: insertError } = await supabase
        .from("analyses")
        .insert({
          user_id: userId,
          site_url: url,
          plan_data: parsed,
        });

      if (insertError) {
        console.error("Error guardando análisis:", insertError);
      }

      const { error: rpcError } = await supabase
        .rpc("increment_analyses_used", { user_id: userId });

      if (rpcError) {
        console.error("Error incrementando contador:", rpcError);
      }
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Error generando plan:", err);
    return res.status(500).json({ error: "Error generando el plan", detail: err.message });
  }
}

export const config = {
  api: { responseLimit: false },
};
