// pages/api/send-email.js
// Emails transaccionales con Resend
// Tipos: welcome, plan_activated, limit_warning

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "CAEVIK <hola@caevik.com>";

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
          <tr>
            <td style="padding:0 0 32px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td><span style="font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#38bdf8;">CAEVIK</span></td>
                  <td align="right"><span style="font-size:11px;color:#334155;letter-spacing:1px;text-transform:uppercase;">AI Traffic Agent</span></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:48px 40px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:32px 0 0 0;text-align:center;">
              <p style="font-size:12px;color:#1e293b;margin:0 0 8px 0;">© 2026 CAEVIK · AI Traffic Agent</p>
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

function nameFromEmail(email) {
  return (email || "").split("@")[0] || "usuario";
}

// Email 1 — Bienvenida al registrarse
function welcomeEmail(name) {
  return baseTemplate(`
    <div style="height:3px;background:linear-gradient(135deg,#38bdf8,#818cf8,#e879f9);border-radius:999px;margin-bottom:40px;"></div>

    <div style="text-align:center;margin-bottom:36px;">
      <div style="font-size:52px;margin-bottom:20px;">🚀</div>
      <h1 style="font-size:28px;font-weight:800;color:#f1f5f9;letter-spacing:-1px;margin:0 0 16px 0;line-height:1.25;">
        Bienvenido a CAEVIK,<br/>${name}
      </h1>
      <p style="font-size:16px;color:#64748b;line-height:1.8;margin:0 auto;max-width:420px;">
        Estás a un paso de transformar cómo tu negocio crece en internet. Sin agencias. Sin presupuestos enormes. Solo estrategia inteligente con IA.
      </p>
    </div>

    <div style="border-top:1px solid rgba(255,255,255,0.06);margin:32px 0;"></div>

    <div style="margin-bottom:36px;">
      <p style="font-size:15px;color:#94a3b8;line-height:1.9;margin:0 0 20px 0;">
        CAEVIK existe para que <strong style="color:#e2e8f0;">dueños de negocio como tú</strong> puedan competir con grandes marcas en Google, redes sociales y directorios — sin necesitar un equipo de marketing.
      </p>
      <p style="font-size:15px;color:#94a3b8;line-height:1.9;margin:0;">
        En menos de 60 segundos, nuestra IA analiza tu negocio y te entrega un plan completo de keywords, posts listos para publicar y artículos SEO personalizados para tu industria.
      </p>
    </div>

    <div style="background:rgba(56,189,248,0.05);border-left:3px solid #38bdf8;border-radius:0 12px 12px 0;padding:20px 24px;margin-bottom:36px;">
      <p style="font-size:15px;color:#94a3b8;line-height:1.8;margin:0;font-style:italic;">
        "El tráfico orgánico no es suerte — es el resultado de publicar el contenido correcto, en el momento correcto, para las personas correctas."
      </p>
      <p style="font-size:12px;color:#475569;margin:10px 0 0 0;">— Equipo CAEVIK</p>
    </div>

    <div style="text-align:center;margin-bottom:20px;">
      <a href="https://caevik.com" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#38bdf8,#818cf8);border-radius:10px;color:#03060f;font-weight:800;font-size:16px;text-decoration:none;letter-spacing:0.3px;">
        Generar mi primer plan →
      </a>
    </div>

    <p style="font-size:13px;color:#334155;text-align:center;margin:0 0 32px 0;">
      Es gratis. No necesitas tarjeta. Solo tu URL y 60 segundos.
    </p>

    <div style="border-top:1px solid rgba(255,255,255,0.06);margin:0 0 24px 0;"></div>

    <p style="font-size:13px;color:#475569;text-align:center;margin:0;line-height:1.7;">
      ¿Tienes alguna pregunta? Respondemos personalmente a cada mensaje.<br/>
      <a href="mailto:hola@caevik.com" style="color:#38bdf8;text-decoration:none;">hola@caevik.com</a>
    </p>
  `);
}

// Email 2 — Plan activado después del pago
function planActivatedEmail(name, plan, features) {
  const planColors = { starter: "#38bdf8", growth: "#f59e0b", agency: "#e879f9" };
  const color = planColors[plan] || "#38bdf8";
  const planName = plan.charAt(0).toUpperCase() + plan.slice(1);

  return baseTemplate(`
    <div style="height:3px;background:linear-gradient(135deg,${color},#818cf8);border-radius:999px;margin-bottom:40px;"></div>

    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:52px;margin-bottom:20px;">🎉</div>
      <h1 style="font-size:28px;font-weight:800;color:#f1f5f9;letter-spacing:-1px;margin:0 0 16px 0;line-height:1.25;">
        ¡Tu plan está activo, ${name}!
      </h1>
      <p style="font-size:15px;color:#64748b;line-height:1.8;margin:0;">
        Gracias por confiar en CAEVIK. A partir de ahora tienes todo lo que necesitas para dominar el tráfico orgánico de tu negocio.
      </p>
    </div>

    <div style="background:rgba(255,255,255,0.02);border:1px solid ${color}30;border-radius:12px;padding:28px;margin-bottom:32px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:${color};text-transform:uppercase;margin-bottom:8px;text-align:center;">Plan activo</div>
      <div style="font-size:36px;font-weight:800;color:${color};text-align:center;margin-bottom:20px;">${planName}</div>
      ${(features || []).map(f => `
        <div style="font-size:14px;color:#64748b;margin-bottom:10px;padding-left:4px;">
          <span style="color:${color};">✓</span> &nbsp;${f}
        </div>
      `).join("")}
    </div>

    <div style="text-align:center;margin-bottom:20px;">
      <a href="https://caevik.com" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,${color},#818cf8);border-radius:10px;color:#03060f;font-weight:800;font-size:16px;text-decoration:none;">
        Ir a mi panel →
      </a>
    </div>

    <div style="border-top:1px solid rgba(255,255,255,0.06);margin:28px 0;"></div>

    <p style="font-size:13px;color:#475569;text-align:center;margin:0;line-height:1.7;">
      ¿Dudas o necesitas ayuda? Escríbenos cuando quieras.<br/>
      <a href="mailto:hola@caevik.com" style="color:#38bdf8;text-decoration:none;">hola@caevik.com</a>
    </p>
  `);
}

// Email 3 — Advertencia de límite al 80%
function limitWarningEmail(name, plan, used, limit) {
  const remaining = limit - used;
  const pct = Math.round((used / limit) * 100);
  return baseTemplate(`
    <div style="height:3px;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:999px;margin-bottom:40px;"></div>

    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:52px;margin-bottom:20px;">⚠️</div>
      <h1 style="font-size:26px;font-weight:800;color:#f1f5f9;letter-spacing:-1px;margin:0 0 16px 0;line-height:1.25;">
        Te quedan ${remaining} análisis este mes
      </h1>
      <p style="font-size:15px;color:#64748b;line-height:1.8;margin:0;">
        Has usado ${used} de ${limit} análisis de tu plan ${plan}.
      </p>
    </div>

    <div style="margin-bottom:32px;">
      <div style="background:rgba(255,255,255,0.06);border-radius:999px;height:8px;overflow:hidden;margin-bottom:10px;">
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
      <p style="font-size:14px;color:#94a3b8;margin:0 0 16px 0;line-height:1.8;">
        No pierdas el momentum justo cuando tu estrategia está tomando forma. Haz upgrade para seguir generando planes sin interrupciones.
      </p>
      <div style="font-size:13px;color:#64748b;">
        <div style="margin-bottom:8px;">✓ &nbsp;Más análisis mensuales</div>
        <div style="margin-bottom:8px;">✓ &nbsp;Más posts y artículos SEO</div>
        <div>✓ &nbsp;Más sitios web simultáneos</div>
      </div>
    </div>

    <div style="text-align:center;margin-bottom:20px;">
      <a href="https://caevik.com" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:10px;color:#03060f;font-weight:800;font-size:16px;text-decoration:none;">
        Ver planes de upgrade →
      </a>
    </div>

    <div style="border-top:1px solid rgba(255,255,255,0.06);margin:28px 0;"></div>

    <p style="font-size:13px;color:#475569;text-align:center;margin:0;line-height:1.7;">
      ¿Preguntas? Estamos aquí para ayudarte.<br/>
      <a href="mailto:hola@caevik.com" style="color:#38bdf8;text-decoration:none;">hola@caevik.com</a>
    </p>
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
      body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
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
