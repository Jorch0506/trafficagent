// lib/email.js
// Helper para enviar emails transaccionales desde cualquier API route

const PLAN_FEATURES = {
  starter: ["20 análisis / mes", "10 posts listos", "5 artículos SEO", "5 directorios", "Soporte email"],
  growth:  ["60 análisis / mes", "25 posts listos", "12 artículos SEO", "3 sitios web", "Soporte prioritario"],
  agency:  ["100 análisis / mes", "10 sitios web", "20 directorios", "Manager dedicado", "API próximamente"],
};

export async function sendEmail(type, to, data = {}) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.caevik.com";
    const res = await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        to,
        features: data.plan ? PLAN_FEATURES[data.plan] : undefined,
        ...data,
      }),
    });
    const result = await res.json();
    if (!res.ok) console.error("sendEmail error:", result);
    return result;
  } catch (err) {
    console.error("sendEmail exception:", err);
  }
}

export { PLAN_FEATURES };
