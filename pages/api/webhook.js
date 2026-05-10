// pages/api/webhook.js
// Recibe eventos de Stripe y actualiza el plan del usuario en Supabase

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PLAN_CONFIG = {
  starter: { analyses_limit: 20,  sites_limit: 1  },
  growth:  { analyses_limit: 60,  sites_limit: 3  },
  agency:  { analyses_limit: 100, sites_limit: 10 },
};

// ── Price IDs actualizados — MXN (activos) + USD (legacy, por si acaso) ──────
const PRICE_TO_PLAN = {
  // MXN — precios activos
  "price_1TVcxnJK0PaCWmjfm8RbZtsE": "starter",
  "price_1TVcypJK0PaCWmjfgzYwv67U": "growth",
  "price_1TVd03JK0PaCWmjfRF4Ws6WZ": "agency",
  // USD — legacy, por si hay suscripciones antiguas
  "price_1TSH9gJK0PaCWmjf2j4Hq5DC": "starter",
  "price_1TSHAWJK0PaCWmjfHRUHo0eF": "growth",
  "price_1TSHBMJK0PaCWmjf0PMaLQiw": "agency",
};

const PLAN_FEATURES = {
  starter: ["20 análisis / mes", "10 posts listos", "5 artículos SEO", "5 directorios", "Soporte email"],
  growth:  ["60 análisis / mes", "25 posts listos", "12 artículos SEO", "3 sitios web", "Soporte prioritario"],
  agency:  ["100 análisis / mes", "10 sitios web", "20 directorios", "Manager dedicado", "API próximamente"],
};

async function sendEmail(type, to, data = {}) {
  try {
    const res = await fetch("https://www.caevik.com/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, to, ...data }),
    });
    if (!res.ok) console.error("Email error:", await res.json());
  } catch (err) {
    console.error("sendEmail error:", err);
  }
}

// ── Obtiene el priceId de una sesión expandiendo line_items via API ───────────
async function getPriceIdFromSession(sessionId) {
  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}?expand[]=line_items`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        },
      }
    );
    const session = await res.json();
    return session.line_items?.data?.[0]?.price?.id || null;
  } catch (err) {
    console.error("Error obteniendo line_items:", err);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let event;
  try {
    event = req.body;
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {
        const session = event.data.object;
        const customerEmail = session.customer_details?.email;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        // FIX: expandir line_items via API para obtener el priceId real
        const priceId = await getPriceIdFromSession(session.id);
        console.log(`checkout.session.completed — email: ${customerEmail}, priceId: ${priceId}`);

        const plan = PRICE_TO_PLAN[priceId] || "starter";
        const config = PLAN_CONFIG[plan];

        if (customerEmail && config) {
          const { error } = await supabase
            .from("users")
            .update({
              plan,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              analyses_limit: config.analyses_limit,
              sites_limit: config.sites_limit,
              analyses_used: 0,
              subscription_status: "active",
            })
            .eq("email", customerEmail);

          if (error) {
            console.error("Error actualizando usuario:", error);
          } else {
            console.log(`Plan actualizado: ${customerEmail} -> ${plan}`);
            await sendEmail("plan_activated", customerEmail, {
              plan,
              features: PLAN_FEATURES[plan],
            });
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const priceId = subscription.items?.data?.[0]?.price?.id;
        const plan = PRICE_TO_PLAN[priceId];
        const config = PLAN_CONFIG[plan];

        if (plan && config) {
          await supabase
            .from("users")
            .update({
              plan,
              analyses_limit: config.analyses_limit,
              sites_limit: config.sites_limit,
              subscription_status: subscription.status === "active" ? "active" : "inactive",
            })
            .eq("stripe_customer_id", customerId);

          console.log(`Plan actualizado por cambio: ${customerId} -> ${plan}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        await supabase
          .from("users")
          .update({
            plan: "free",
            analyses_limit: 1,
            sites_limit: 1,
            subscription_status: "cancelled",
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", customerId);

        console.log(`Suscripcion cancelada: ${customerId}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        await supabase
          .from("users")
          .update({ subscription_status: "inactive" })
          .eq("stripe_customer_id", customerId);

        console.log(`Pago fallido: ${customerId}`);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        if (invoice.billing_reason === "subscription_cycle") {
          await supabase
            .from("users")
            .update({
              analyses_used: 0,
              subscription_status: "active",
            })
            .eq("stripe_customer_id", customerId);

          console.log(`Contador reseteado para nuevo ciclo: ${customerId}`);
        }
        break;
      }

      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Error procesando webhook:", err);
    return res.status(500).json({ error: err.message });
  }
}

export const config = {
  api: { bodyParser: true },
};
