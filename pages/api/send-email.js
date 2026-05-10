// pages/api/send-email.js
// Emails transaccionales con Resend
// Tipos: welcome, plan_activated, limit_warning

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "CAEVIK <hola@send.caevik.com>";

// ── Templates HTML ────────────────────────────────────────────────────────────

function baseTemplate(content) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CAEVIK</title>
</head>
<body style="margin:0;padding:0;background:#03060f;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#03060f;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#38bdf8;">CAEVIK</span>
                  </td>
                  <td align="right">
                    <span style="font-size:11px;color:#1e293b;letter-spacing:1px;text-transform:uppercase;">AI Traffic Agent</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card principal -->
          <tr>
            <td style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:48px 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0 0;text-align:center;">
              <p style="font-size:12px;color:#1e293b;margin:0 0 8px 0;">
                © 2026 CAEVIK · AI Traffic Agent
              </p>
              <p style="font-size:12px;color:#1e293b;margin:0;">
                <a href="https://caevik.com" style="color:#334155;text-decoration:none;">caevik.com</a>
                &nbsp;·&nbsp;
                <a href="mailto:hola@caevik.com" style="color:#334155;text-decoration:none;">hola@caevik.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Extrae un nombre legible del email: "jorch22@yahoo.com" → "jorch22"
function nameFromEmail(email) {
  return (email || "").split("@")[0] || "usuario";
}

// Email 1 — Bienvenida al registrarse
function welcomeEmail(name) {
  return baseTemplate(`
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:48px;margin-bottom:16px;">👋</div>
      <h1 style="font-size:28px;font-weight:800;color:#f1f5f9;letter-spacing:-1px;margin:0 0 12px 0;line-height:1.2;">
        Bienvenido a CAEVIK,<br>${name}
      </h1>
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0;">
        Tu agente de tráfico orgánico con IA está listo.<br>
        Genera tu primer plan en menos de 60 segundos.
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td width="48%" style="background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.15);border-radius:12px;padding:20px 16px;vertical-align:top;">
          <div style="font-size:22px;font-weight:800;color:#38bdf8;margin-bottom:4px;">25</div>
          <div style="font-size:12px;color:#64748b;">Posts listos</div>
        </td>
        <td width="4%"></td>
        <td width="48%" style="background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.15);border-radius:12px;padding:20px 16px;vertical-align:top;">
          <div style="font-size:22px;font-weight:800;color:#4ade80;margin-bottom:4px;">12</div>
          <div style="font-size:12px;color:#64748b;">Artículos SEO</div>
        </td>
      </tr>
    </table>

    <div style="margin-bottom:32px;">
      <p style="font-size:14px;color:#475569;line-height:1.8;margin:0 0 8px 0;">✓ &nbsp;Ingresa la URL de tu negocio</p>
      <p style="font-size:14px;color:#475569;line-height:1.8;margin:0 0 8px 0;">✓ &nbsp;Selecciona tu tipo de negocio</p>
      <p style="font-size:14px;color:#475569;line-height:1.8;margin:0;">✓ &nbsp;Recibe tu plan completo en 60 segundos</p>
    </div>

    <div style="text-align:center;">
      <a href="https://caevik.com" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#38bdf8,#818cf8);border-radius:10px;color:#03060f;font-weight:800;font-size:15px;text-decoration:none;letter-spacing:0.3px;">
        Generar mi primer plan →
      </a>
    </div>
  `);
}

// Email 2 — Plan activado después del pago
function planActivatedEmail(name, plan, features) {
  const planColors = {
    starter: "#38bdf8",
    growth:  "#f59e0b",
    agency:  "#e879f9",
  };
  const color = planColors[plan] || "#38bdf8";
  const planName = plan.charAt(0).toUpperCase() + plan.slice(1);

  return baseTemplate(`
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:48px;margin-bottom:16px;">🎉</div>
      <h1 style="font-size:28px;font-weight:800;color:#f1f5f9;letter-spacing:-1px;margin:0 0 12px 0;line-height:1.2;">
        ¡Plan activado, ${name}!
      </h1>
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0;">
        Tu plan está activo. Empieza a generar planes de tráfico ahora mismo.
      </p>
    </div>

    <div style="background:rgba(255,255,255,0.02);border:1px solid ${color}30;border-radius:12px;padding:28px;margin-bottom:32px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:${color};text-transform:uppercase;margin-bottom:8px;text-align:center;">Plan activo</div>
      <div style="font-size:32px;font-weight:800;color:${color};text-align:center;margin-bottom:20px;">${planName}</div>
      ${(features || []).map(f => `
        <div style="font-size:14px;color:#64748b;margin-bottom:8px;">
          <span style="color:${color};">✓</span> &nbsp;${f}
        </div>
      `).join("")}
    </div>

    <div style="text-align:center;">
      <a href="https://caevik.com" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,${color},#818cf8);border-radius:10px;color:#03060f;font-weight:800;font-size:15px;text-decoration:none;">
        Ir a mi panel →
      </a>
    </div>

    <p style="font-size:12px;color:#1e293b;text-align:center;margin-top:24px;">
      ¿Dudas? Escríbenos a <a href="mailto:hola@caevik.com" style="color:#475569;">hola@caevik.com</a>
    </p>
  `);
}

// Email 3 — Advertencia de límite al 80%
function limitWarningEmail(name, plan, used, limit) {
  const remaining = limit - used;
  const pct = Math.round((used / limit) * 100);
  return baseTemplate(`
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
      <h1 style="font-size:26px;font-weight:800;color:#f1f5f9;letter-spacing:-1px;margin:0 0 12px 0;line-height:1.2;">
        Te quedan ${remaining} análisis este mes
      </h1>
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0;">
        Has usado ${used} de ${limit} análisis de tu plan ${plan}.
      </p>
    </div>

    <div style="margin-bottom:32px;">
      <div style="background:rgba(255,255,255,0.06);border-radius:999px;height:8px;overflow:hidden;margin-bottom:8px;">
        <div style="width:${pct}%;height:100%;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:999px;"></div>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:12px;color:#475569;">${used} usados</td>
          <td align="right" style="font-size:12px;color:#475569;">${limit} total</td>
        </tr>
      </table>
    </div>

    <div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:24px;margin-bottom:32px;">
      <p style="font-size:14px;color:#94a3b8;margin:0 0 16px 0;line-height:1.7;">
        Haz upgrade ahora para no quedarte sin análisis a mitad del mes.
      </p>
      <div style="font-size:13px;color:#64748b;">
        <div style="margin-bottom:8px;">✓ &nbsp;Más análisis mensuales</div>
        <div style="margin-bottom:8px;">✓ &nbsp;Más posts y artículos SEO</div>
        <div>✓ &nbsp;Más sitios web simultáneos</div>
      </div>
    </div>

    <div style="text-align:center;">
      <a href="https://caevik.com" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:10px;color:#03060f;font-weight:800;font-size:15px;text-decoration:none;">
        Ver planes de upgrade →
      </a>
    </div>
  `);
}

// ── Handler principal ─────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY no configurada");
    return res.status(500).json({ error: "Email service not configured" });
  }

  const { type, to, firstName, plan, features, used, limit } = req.body;

  if (!type || !to) {
    return res.status(400).json({ error: "type y to son requeridos" });
  }

  // Usa firstName si viene, si no extrae del email
  const name = firstName || nameFromEmail(to);

  let subject, html;

  switch (type) {
    case "welcome":
      subject = "Bienvenido a CAEVIK — Tu primer plan te espera";
      html = welcomeEmail(name);
      break;

    case "plan_activated":
      subject = `Plan ${plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : ""} activado — ¡Empieza a generar tráfico!`;
      html = planActivatedEmail(name, plan, features || []);
      break;

    case "limit_warning":
      subject = `Te quedan ${limit - used} análisis este mes`;
      html = limitWarningEmail(name, plan, used, limit);
      break;

    default:
      return res.status(400).json({ error: `Tipo de email desconocido: ${type}` });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend error:", data);
      return res.status(500).json({ error: "Error enviando email", detail: data });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error("Error en send-email:", err);
    return res.status(500).json({ error: err.message });
  }
}
