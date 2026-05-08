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

const PRICE_TO_PLAN = {
  "price_1TSH9gJK0PaCWmjf2j4Hq5DC": "starter",
  "price_1TSHAWJK0PaCWmjfHRUHo0eF": "growth",
  "price_1TSHBMJK0PaCWmjf0PMaLQiw": "agency",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let event;
  try {
    event = req.body;
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {
        const session = event.data.object;
        const customerEmail = session.customer_details?.email;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        // Obtener price ID de los line items
        let priceId = null;
        if (session.line_items?.data?.length > 0) {
          priceId = session.line_items.data[0]?.price?.id;
        }

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

          if (error) console.error("Error actualizando usuario:", error);
          else console.log(`Plan actualizado: ${customerEmail} -> ${plan}`);
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

        // Resetear contador de analisis al inicio de cada ciclo de facturacion
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
