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
    console.log("api2pdf response:", JSON.stringify(result).substring(0, 300));

    // api2pdf v2: Result.Url; v1: FileUrl
    const pdfUrl = result?.Result?.Url || result?.FileUrl || result?.url || result?.pdf;
    if (!pdfUrl) {
      throw new Error("No se recibió URL del PDF: " + JSON.stringify(result));
    }

    // Descargar el PDF generado y reenviarlo al cliente
    const pdfRes  = await fetch(pdfUrl);
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
.section{margin-bottom:32px;page-break-inside:avoid;break-inside:avoid}
.sh{display:flex;align-items:center;gap:10px;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.08)}
.si{width:28px;height:28px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.15);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px}
.st{font-size:13px;font-weight:600;color:#f8fafc}
.sc{margin-left:auto;font-size:11px;color:#475569;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);padding:2px 8px;border-radius:100px}

.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:28px}
.stat{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px 16px;text-align:center}
.sv{font-size:20px;font-weight:700;color:#a78bfa;line-height:1;margin-bottom:4px}
.sl{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;color:#475569}

.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;page-break-inside:avoid;break-inside:avoid}
.card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px 16px;page-break-inside:avoid;break-inside:avoid}
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
      <img src="data:image/png;base64,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bwMnxmYVroKO126nt1vp46akp4xHFEwYa1o6BUm91v8Ay7DRwHpH6jwHDrP2VwsqlxHxHablkoiLlqnUREREREREREREREREREREREREREREREREREREXHuO3D11ex+p7DRGWsBBrqeLYztAx7Ro/GMD4j1AXYUW5QV0tDMJojmPEcCtStooq2EwyjEHw5qD04aBkbjsVgyld+4z8K5pKmbUGlqMymZxdWULNjzHrJGOmfLe/Ub9eB1ETmuc3kdlpLSMHII6g+D6LslkWrBaMIfGc943hcxqbKms+bYeMRuPFYZOZAvW0lpy5aq1DTWW0x808xy+RwyyFg6yO9B47nZU6c0/dNQ3qK1WeifVVb9yzm5QxvTmefutHn8slS04V6Dt+hrJ9XiLai4z4dWVXLgyO/CPDR0A/mtS8N4Y7Ni2IzjIdBw5n8zVisez3VBD3fSPFenoTS1t0fp2CzWxpLWe9LK77c0h6vd6n9BgL3kRcdllfK8vecScyVdmtDRgNEREXhfUREREREREREREREREREREREREREREREREREREREREWuX7Qmjr5VOqrrp231FQ/wC3L7Lle/8AvFuC755WxoskU0kTtqNxB5HBeXsa8YOGK82wWCyWCmNNZLTQ22Fxy5tNA2MOPk4G5+K9JEXlz3PO044lfQABgEREXlfURERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERF/9k=" style="width:36px;height:36px;object-fit:contain" alt="CAEVIK">
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
