export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url, instagram, facebook, businessType, description } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL requerida" });
  }

  const NICHES = {
    ecommerce: ["merch", "shop", "store", "tienda", "buy", "beer", "clothing", "apparel"],
    saas: ["app", "software", "platform", "dashboard", "api", "vivix", "tool", "service"],
    local: ["restaurant", "cafe", "salon", "gym", "clinic", "dental", "hotel"],
    agency: ["agency", "marketing", "design", "consulting", "studio"],
  };

  const lower = (url + " " + (description || "")).toLowerCase();
  let niche = "general";
  for (const [n, keywords] of Object.entries(NICHES)) {
    if (keywords.some((k) => lower.includes(k))) { niche = n; break; }
  }

  const systemPrompt = `Eres un experto en marketing digital, SEO, y generación de tráfico orgánico.
Responde ÚNICAMENTE en JSON válido, sin markdown, sin backticks, sin texto extra.
El JSON debe tener exactamente esta estructura:
{
  "niche": "string",
  "keywordsPrimarias": ["kw1","kw2","kw3","kw4","kw5"],
  "keywordsLongTail": ["frase1","frase2","frase3"],
  "traficoEstimado": {"min": 1000, "max": 5000, "periodo": "mensual"},
  "competencia": {"nivel": "string", "oportunidad": "string"},
  "posts": [
    {"red": "Instagram", "tipo": "string", "titulo": "string", "caption": "string", "hashtags": ["#h1","#h2","#h3","#h4","#h5"]},
    {"red": "Facebook", "tipo": "string", "titulo": "string", "caption": "string", "hashtags": ["#h1","#h2","#h3"]},
    {"red": "Instagram", "tipo": "string", "titulo": "string", "caption": "string", "hashtags": ["#h1","#h2","#h3","#h4","#h5"]},
    {"red": "Facebook", "tipo": "string", "titulo": "string", "caption": "string", "hashtags": ["#h1","#h2","#h3"]},
    {"red": "Instagram", "tipo": "string", "titulo": "string", "caption": "string", "hashtags": ["#h1","#h2","#h3","#h4","#h5"]}
  ],
  "articulosSEO": [
    {"titulo": "string", "slug": "string", "metaDescription": "string", "palabrasClave": ["kw1","kw2"], "estructura": ["H2: string", "H2: string", "H2: string"]},
    {"titulo": "string", "slug": "string", "metaDescription": "string", "palabrasClave": ["kw1","kw2"], "estructura": ["H2: string", "H2: string", "H2: string"]},
    {"titulo": "string", "slug": "string", "metaDescription": "string", "palabrasClave": ["kw1","kw2"], "estructura": ["H2: string", "H2: string", "H2: string"]}
  ],
  "directorios": [
    {"nombre": "string", "url": "string", "prioridad": "Alta"},
    {"nombre": "string", "url": "string", "prioridad": "Alta"},
    {"nombre": "string", "url": "string", "prioridad": "Media"},
    {"nombre": "string", "url": "string", "prioridad": "Media"},
    {"nombre": "string", "url": "string", "prioridad": "Alta"}
  ],
  "accionesInmediatas": ["accion1","accion2","accion3","accion4","accion5"],
  "scoreSEO": 72,
  "potencialCrecimiento": "string"
}`;

  const prompt = `Analiza este negocio y genera su plan de tráfico orgánico. Sé CONCISO en los captions (máximo 100 palabras cada uno):
URL: ${url}
Instagram: ${instagram || "No tiene"}
Facebook: ${facebook || "No tiene"}
Tipo de negocio: ${businessType || "general"}
Descripción: ${description || "Sin descripción adicional"}
Nicho detectado: ${niche}`;

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
        max_tokens: 4000,
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

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Error generando plan:", err);
    return res.status(500).json({ error: "Error generando el plan", detail: err.message });
  }
}

export const config = {
  api: { responseLimit: false },
};
