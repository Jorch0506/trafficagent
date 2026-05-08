// pages/api/checkout.js
// Crea una sesión de pago en Stripe y redirige al checkout

const PRICE_IDS = {
  starter: "price_1TSH9gJK0PaCWmjf2j4Hq5DC",
  growth: "price_1TSHAWJK0PaCWmjfHRUHo0eF",
  agency: "price_1TSHBMJK0PaCWmjf0PMaLQiw",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { plan } = req.body;

  if (!PRICE_IDS[plan]) {
    return res.status(400).json({ error: "Plan inválido" });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return res.status(500).json({ error: "Stripe no configurado" });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://caevik.com";

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        mode: "subscription",
        "line_items[0][price]": PRICE_IDS[plan],
        "line_items[0][quantity]": "1",
        success_url: `${baseUrl}/success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/?cancelled=true`,
        allow_promotion_codes: "true",
        billing_address_collection: "auto",
      }),
    });

    const session = await response.json();

    if (!response.ok) {
      console.error("Stripe error:", session);
      return res.status(500).json({ error: "Error creando sesión de pago", detail: session });
    }

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ error: "Error de conexión con Stripe", detail: err.message });
  }
}
