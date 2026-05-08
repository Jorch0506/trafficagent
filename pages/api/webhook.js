// pages/api/webhook.js
// Recibe eventos de Stripe y actualiza el plan del usuario en Supabase

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PLAN_LIMITS = {
  starter: 20,
  growth: 999,
  agency: 999,
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

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    // Verificar firma del webhook
    const body = JSON.stringify(req.body);

    if (webhookSecret) {
      // Verificacion con stripe-signature (recomendado en produccion)
      const timestamp = sig.split(",")[0].replace("t=", "");
      const payload = `${timestamp}.${body}`;
      // En produccion usar: stripe.webhooks.constructEvent(body, sig, webhookSecret)
      // Por ahora procesamos el evento directamente
    }

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

        // Obtener el price ID de la suscripcion
        const lineItems = session.line_items?.data || [];
        const priceId = lineItems[0]?.price?.id || session.metadata?.price_id;
        const plan = PRICE_TO_PLAN[priceId] || "starter";
        const limit = PLAN_LIMITS[plan] || 20;

        if (customerEmail) {
          await supabase
            .from("users")
            .update({
              plan,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              analyses_limit: limit,
              analyses_used: 0,
              subscription_status: "active",
            })
            .eq("email", customerEmail);

          console.log(`Plan actualizado: ${customerEmail} -> ${plan}`);
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
