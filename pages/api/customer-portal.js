// pages/api/customer-portal.js
// Crea una sesión del portal de clientes de Stripe
// El usuario puede gestionar su suscripción, cambiar plan, cancelar y ver facturas

import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId requerido" });
  }

  try {
    // Obtener el stripe_customer_id del usuario
    const { data: user, error } = await supabase
      .from("users")
      .select("stripe_customer_id, email, plan")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!user.stripe_customer_id) {
      return res.status(400).json({ error: "no_customer", message: "Este usuario no tiene suscripción activa en Stripe." });
    }

    // Crear sesión del portal
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: "https://www.caevik.com",
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Error creando sesión del portal:", err);
    return res.status(500).json({ error: err.message });
  }
}
