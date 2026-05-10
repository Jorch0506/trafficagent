// pages/api/export-pdf.js
// PDF premium usando api2pdf.com — Headless Chrome real, zero config en servidor

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No autorizado" });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: "No autorizado" });

  const { planData, siteUrl } = req.body;
  if (!planData) return res.status(400).json({ error: "Datos requeridos" });

  const { data: userData } = await supabase
    .from("users").select("plan, email").eq("id", user.id).single();

  const plan      = userData?.plan  || "free";
  const userEmail = userData?.email || user.email;

  if (plan === "free") {
    return res.status(403).json({ error: "PDF premium requiere plan Starter o superior", upgrade: true });
  }

  const API2PDF_KEY = process.env.API2PDF_API_KEY;
  if (!API2PDF_KEY) {
    return res.status(500).json({ error: "API key no configurada" });
  }

  try {
    const html = generatePremiumHTML(planData, siteUrl, userEmail, plan);

    // Llamar a api2pdf con Headless Chrome
    const apiRes = await fetch("https://v2.api2pdf.com/chrome/html", {
      method: "POST",
      headers: {
        "Authorization": API2PDF_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html,
        inlinePdf: true,
        fileName: `CAEVIK-plan.pdf`,
        options: {
          printBackground: true,
          format: "A4",
          marginTop: "0",
          marginBottom: "0",
          marginLeft: "0",
          marginRight: "0",
        },
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      throw new Error(`api2pdf error ${apiRes.status}: ${errText}`);
    }

    const result = await apiRes.json();

    if (!result.FileUrl) {
      throw new Error("No se recibió URL del PDF: " + JSON.stringify(result));
    }

    // Descargar el PDF generado y reenviarlo al cliente
    const pdfRes  = await fetch(result.FileUrl);
    const pdfBuf  = await pdfRes.arrayBuffer();
    const pdfBuffer = Buffer.from(pdfBuf);

    const domain   = siteUrl ? siteUrl.replace(/https?:\/\//, "").replace(/\//g, "") : "plan";
    const fecha    = new Date().toISOString().split("T")[0];
    const filename = `CAEVIK-${domain}-${fecha}.pdf`;

    res.setHeader("Content-Type",        "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length",      pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error generando PDF:", error.message);
    res.status(500).json({ error: "Error al generar el PDF: " + error.message });
  }
}

// ─── Template HTML premium ────────────────────────────────────────────────────

function generatePremiumHTML(planData, siteUrl, userEmail, plan) {
  const fecha = new Date().toLocaleDateString("es-MX", { year:"numeric", month:"long", day:"numeric" });

  let data = planData;
  if (typeof planData === "string") {
    try { data = JSON.parse(planData); } catch { data = { raw: planData }; }
  }

  const planLabel   = { free:"Free", starter:"Starter", growth:"Growth", agency:"Agency" }[plan] || plan;
  const isRaw       = !!data.raw && typeof data.raw === "string" && !data.posts && !data.keywordsPrimarias;
  const keywords    = data.keywordsPrimarias  || data.keywords   || [];
  const posts       = data.posts              || [];
  const articulos   = data.articulosSEO       || data.articulos  || [];
  const directorios = data.directorios        || [];
  const estrategia  = data.competencia?.oportunidad || data.estrategia || "";
  const seoScore    = data.scoreSEO ? `${data.scoreSEO}/100` : "—";
  const trafico     = data.traficoEstimado
    ? `${Math.round((data.traficoEstimado.min||0)/1000)}K–${Math.round((data.traficoEstimado.max||0)/1000)}K`
    : "—";

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Plan CAEVIK</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#0a0a0f;color:#f8fafc;font-family:'Inter',sans-serif;font-size:10pt;line-height:1.6;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{size:A4;margin:0}
.page{width:210mm;background:#0a0a0f}

.cover{padding:48px 48px 40px;border-bottom:1px solid rgba(255,255,255,0.08)}
.cover-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px}
.logo{display:flex;align-items:center;gap:10px}
.logo-icon{width:36px;height:36px;background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:white}
.logo-text{font-size:20px;font-weight:700;color:#a78bfa}
.badge{padding:6px 14px;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);border-radius:100px;font-size:11px;font-weight:600;color:#a78bfa;text-transform:uppercase}
h1{font-size:26px;font-weight:700;color:#f8fafc;margin-bottom:6px}
.sub{font-size:13px;color:#94a3b8}
.meta{display:flex;gap:24px;margin-top:24px;flex-wrap:wrap}
.ml{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#475569;display:block;margin-bottom:2px}
.mv{font-size:12px;color:#94a3b8}
.mv.url{color:#a78bfa}

.content{padding:36px 48px}
.section{margin-bottom:32px}
.sh{display:flex;align-items:center;gap:10px;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.08)}
.si{width:28px;height:28px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.15);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px}
.st{font-size:13px;font-weight:600;color:#f8fafc}
.sc{margin-left:auto;font-size:11px;color:#475569;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);padding:2px 8px;border-radius:100px}

.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:28px}
.stat{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px 16px;text-align:center}
.sv{font-size:20px;font-weight:700;color:#a78bfa;line-height:1;margin-bottom:4px}
.sl{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;color:#475569}

.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px 16px}
.cn{font-size:10px;font-weight:600;color:#a78bfa;margin-bottom:6px;opacity:0.8}
.ct{font-size:11px;font-weight:600;color:#f8fafc;margin-bottom:4px;line-height:1.4}
.cd{font-size:10px;color:#94a3b8;line-height:1.5}
.tag{display:inline-flex;align-items:center;margin-top:8px;padding:2px 8px;border-radius:100px;font-size:9px;font-weight:600}
.tg{background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.2)}
.tb{background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.2)}
.ta{background:rgba(245,158,11,0.15);color:#fbbf24;border:1px solid rgba(245,158,11,0.2)}

.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{padding:6px 14px;background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.25);border-radius:100px;font-size:11px;font-weight:500;color:#a78bfa}
.chip.s{background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.08);color:#94a3b8}

.ebox{background:linear-gradient(135deg,rgba(124,58,237,0.08),rgba(59,130,246,0.05));border:1px solid rgba(124,58,237,0.2);border-radius:10px;padding:18px 20px;font-size:11px;line-height:1.7;color:#94a3b8}
.div{height:1px;background:rgba(255,255,255,0.08);margin:4px 0 24px}

.footer{padding:20px 48px;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center}
.fl,.fr{font-size:9px;color:#475569}
.fr{text-align:right}
.br{font-weight:600;color:#a78bfa}
</style>
</head>
<body>
<div class="page">

<div class="cover">
  <div class="cover-top">
    <div class="logo">
      <div class="logo-icon">C</div>
      <span class="logo-text">CAEVIK</span>
    </div>
    <span class="badge">Plan ${planLabel}</span>
  </div>
  <h1>Plan de Tráfico Orgánico</h1>
  <p class="sub">Estrategia personalizada generada con inteligencia artificial</p>
  <div class="meta">
    ${siteUrl ? `<div><span class="ml">Sitio web</span><span class="mv url">${esc(siteUrl)}</span></div>` : ""}
    <div><span class="ml">Generado por</span><span class="mv">${esc(userEmail)}</span></div>
    <div><span class="ml">Fecha</span><span class="mv">${fecha}</span></div>
    <div><span class="ml">Powered by</span><span class="mv">Claude AI · caevik.com</span></div>
  </div>
</div>

<div class="content">
  ${isRaw ? renderRaw(data.raw) : renderContent(keywords, posts, articulos, directorios, estrategia, seoScore, trafico)}
</div>

<div class="footer">
  <div class="fl">Generado por <span class="br">CAEVIK</span> · caevik.com<br>Exclusivo para: ${esc(userEmail)}</div>
  <div class="fr">${fecha}<br><span class="br">Plan ${planLabel}</span></div>
</div>

</div>
</body>
</html>`;
}

function renderRaw(raw) {
  return `<div class="section">
    <div class="sh"><div class="si">📋</div><span class="st">Plan de Tráfico Orgánico</span></div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:24px;white-space:pre-wrap;font-size:10pt;line-height:1.7;color:#94a3b8">${esc(String(raw))}</div>
  </div>`;
}

function renderContent(keywords, posts, articulos, directorios, estrategia, seoScore, trafico) {
  const s = [];

  s.push(`<div class="stats">
    <div class="stat"><div class="sv">${seoScore}</div><div class="sl">SEO Score</div></div>
    <div class="stat"><div class="sv">${trafico}</div><div class="sl">Tráfico/mes</div></div>
    <div class="stat"><div class="sv">${posts.length||"—"}</div><div class="sl">Posts sociales</div></div>
    <div class="stat"><div class="sv">${articulos.length||"—"}</div><div class="sl">Artículos SEO</div></div>
  </div>`);

  if (estrategia) s.push(`<div class="section">
    <div class="sh"><div class="si">🎯</div><span class="st">Oportunidad de Mercado</span></div>
    <div class="ebox">${esc(estrategia)}</div>
  </div><div class="div"></div>`);

  if (keywords.length) s.push(`<div class="section">
    <div class="sh"><div class="si">🔑</div><span class="st">Keywords Principales</span><span class="sc">${keywords.length} términos</span></div>
    <div class="chips">${keywords.map((kw,i)=>`<span class="chip ${i>4?"s":""}">${esc(typeof kw==="string"?kw:kw.keyword||String(kw))}</span>`).join("")}</div>
  </div><div class="div"></div>`);

  if (posts.length) s.push(`<div class="section">
    <div class="sh"><div class="si">📱</div><span class="st">Posts para Redes Sociales</span><span class="sc">${posts.length} posts</span></div>
    <div class="grid">${posts.map((p,i)=>{
      const t=typeof p==="string"?p:p.titulo||`Post ${i+1}`;
      const d=typeof p==="object"?(p.caption||p.descripcion||""):"";
      const r=typeof p==="object"?(p.red||""):"";
      return `<div class="card"><div class="cn">Post #${String(i+1).padStart(2,"0")}</div><div class="ct">${esc(String(t).substring(0,80))}</div>${d?`<div class="cd">${esc(String(d).substring(0,120))}</div>`:""}${r?`<span class="tag tb">${esc(r)}</span>`:""}</div>`;
    }).join("")}</div>
  </div><div class="div"></div>`);

  if (articulos.length) s.push(`<div class="section">
    <div class="sh"><div class="si">✍️</div><span class="st">Artículos de Blog SEO</span><span class="sc">${articulos.length} artículos</span></div>
    <div class="grid">${articulos.map((a,i)=>{
      const t=typeof a==="string"?a:a.titulo||`Artículo ${i+1}`;
      const d=typeof a==="object"?(a.metaDescription||a.descripcion||""):"";
      return `<div class="card"><div class="cn">Artículo #${String(i+1).padStart(2,"0")}</div><div class="ct">${esc(String(t).substring(0,90))}</div>${d?`<div class="cd">${esc(String(d).substring(0,130))}</div>`:""}<span class="tag tg">Blog SEO</span></div>`;
    }).join("")}</div>
  </div><div class="div"></div>`);

  if (directorios.length) s.push(`<div class="section">
    <div class="sh"><div class="si">📍</div><span class="st">Directorios Locales</span><span class="sc">${directorios.length} directorios</span></div>
    <div class="grid">${directorios.map((d,i)=>{
      const n=typeof d==="string"?d:d.nombre||`Directorio ${i+1}`;
      const u=typeof d==="object"?(d.url||""):"";
      const p=typeof d==="object"?(d.prioridad||""):"";
      return `<div class="card"><div class="cn">Directorio #${String(i+1).padStart(2,"0")}</div><div class="ct">${esc(String(n))}</div>${u?`<div class="cd">${esc(u)}</div>`:""}${p?`<span class="tag ta">${esc(p)}</span>`:""}</div>`;
    }).join("")}</div>
  </div>`);

  return s.join("");
}

function esc(str){
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" }, responseLimit: "20mb" },
};
