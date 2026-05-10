// pages/api/export-pdf.js
// PDF premium — imports DINÁMICOS para evitar errores de webpack en Vercel build

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

  try {
    const html = generatePremiumHTML(planData, siteUrl, userEmail, plan);

    // ── Imports dinámicos (no bundleados por webpack) ──────────────────────────
    const chromium           = (await import("@sparticuz/chromium")).default;
    const { chromium: pw }   = await import("playwright-core");

    const browser = await pw.launch({
      args:           chromium.args,
      executablePath: await chromium.executablePath(),
      headless:       chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    const pdfBuffer = await page.pdf({
      format:          "A4",
      printBackground: true,   // CRÍTICO para fondo oscuro
      margin:          { top: "0", right: "0", bottom: "0", left: "0" },
      preferCSSPageSize: true,
    });

    await browser.close();

    const domain   = siteUrl ? siteUrl.replace(/https?:\/\//, "").replace(/\//g, "") : "plan";
    const fecha    = new Date().toISOString().split("T")[0];
    const filename = `CAEVIK-${domain}-${fecha}.pdf`;

    res.setHeader("Content-Type",        "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length",      pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error generando PDF:", error);
    res.status(500).json({ error: "Error al generar el PDF. Intenta de nuevo." });
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
  const isRaw       = !!data.raw && typeof data.raw === "string" && !data.posts && !data.keywords && !data.keywordsPrimarias;
  const keywords    = data.keywordsPrimarias  || data.keywords    || [];
  const posts       = data.posts || data.postsRedesSociales || [];
  const articulos   = data.articulosSEO || data.articulosBlog || data.articulos || [];
  const directorios = data.directorios || data.directoriosLocales || [];
  const estrategia  = data.competencia?.oportunidad || data.estrategia || data.resumen || "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Plan CAEVIK</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0a0f;--card:rgba(255,255,255,0.04);--border:rgba(255,255,255,0.08);
  --borderB:rgba(255,255,255,0.15);--accent:#7c3aed;--alight:#a78bfa;
  --aglow:rgba(124,58,237,0.3);--t1:#f8fafc;--t2:#94a3b8;--tm:#475569;
}
html,body{background:var(--bg);color:var(--t1);font-family:'Inter',sans-serif;font-size:10pt;line-height:1.6;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{size:A4;margin:0}
.page{width:210mm;min-height:297mm;background:var(--bg)}

/* Cover */
.cover{padding:48px 48px 40px;border-bottom:1px solid var(--border)}
.cover-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px}
.logo{display:flex;align-items:center;gap:10px}
.logo-icon{width:36px;height:36px;background:linear-gradient(135deg,var(--accent),#4f46e5);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:white}
.logo-text{font-size:20px;font-weight:700;background:linear-gradient(135deg,#f8fafc,var(--alight));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.plan-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);border-radius:100px;font-size:11px;font-weight:600;color:var(--alight);text-transform:uppercase}
h1{font-size:28px;font-weight:700;letter-spacing:-1px;line-height:1.2;background:linear-gradient(135deg,#f8fafc,#cbd5e1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:6px}
.cover-subtitle{font-size:13px;color:var(--t2)}
.cover-meta{display:flex;gap:24px;margin-top:24px;flex-wrap:wrap}
.meta-item{display:flex;flex-direction:column;gap:3px}
.meta-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:var(--tm)}
.meta-value{font-size:12px;font-weight:500;color:var(--t2)}
.meta-value.url{color:var(--alight)}

/* Content */
.content{padding:36px 48px}
.section{margin-bottom:32px;page-break-inside:avoid}
.section-header{display:flex;align-items:center;gap:10px;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--border)}
.section-icon{width:28px;height:28px;background:var(--card);border:1px solid var(--borderB);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
.section-title{font-size:13px;font-weight:600;color:var(--t1)}
.section-count{margin-left:auto;font-size:11px;color:var(--tm);background:var(--card);border:1px solid var(--border);padding:2px 8px;border-radius:100px}

/* Stats */
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:28px}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 16px;text-align:center}
.stat-value{font-size:22px;font-weight:700;letter-spacing:-1px;background:linear-gradient(135deg,var(--t1),var(--alight));-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1;margin-bottom:4px}
.stat-label{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;color:var(--tm)}

/* Cards */
.cards-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 16px;position:relative;overflow:hidden}
.card-number{font-size:10px;font-weight:600;color:var(--alight);margin-bottom:6px;opacity:0.8}
.card-title{font-size:11px;font-weight:600;color:var(--t1);margin-bottom:4px;line-height:1.4}
.card-desc{font-size:10px;color:var(--t2);line-height:1.5}
.card-tag{display:inline-flex;align-items:center;margin-top:8px;padding:2px 8px;border-radius:100px;font-size:9px;font-weight:600}
.tag-green{background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.2)}
.tag-blue{background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.2)}
.tag-amber{background:rgba(245,158,11,0.15);color:#fbbf24;border:1px solid rgba(245,158,11,0.2)}

/* Keywords */
.keywords-wrap{display:flex;flex-wrap:wrap;gap:8px}
.keyword-chip{display:inline-flex;align-items:center;padding:6px 14px;background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.25);border-radius:100px;font-size:11px;font-weight:500;color:var(--alight)}
.keyword-chip.secondary{background:rgba(255,255,255,0.04);border-color:var(--border);color:var(--t2)}

/* Estrategia */
.estrategia-box{background:linear-gradient(135deg,rgba(124,58,237,0.08),rgba(59,130,246,0.05));border:1px solid rgba(124,58,237,0.2);border-radius:10px;padding:18px 20px;font-size:11px;line-height:1.7;color:var(--t2)}

/* Raw */
.raw-content{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:24px;white-space:pre-wrap;font-size:10.5pt;line-height:1.7;color:var(--t2)}

/* Divider */
.divider{height:1px;background:linear-gradient(90deg,transparent,var(--borderB),transparent);margin:4px 0 24px}

/* Footer */
.footer{padding:20px 48px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.footer-left,.footer-right{font-size:9px;color:var(--tm)}
.footer-right{text-align:right}
.footer-brand{font-weight:600;color:var(--alight)}
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
    <span class="plan-badge">&#9679; Plan ${planLabel}</span>
  </div>
  <h1>Plan de Tráfico Orgánico</h1>
  <p class="cover-subtitle">Estrategia personalizada generada con inteligencia artificial</p>
  <div class="cover-meta">
    ${siteUrl ? `<div class="meta-item"><span class="meta-label">Sitio web</span><span class="meta-value url">${siteUrl}</span></div>` : ""}
    <div class="meta-item"><span class="meta-label">Generado por</span><span class="meta-value">${userEmail}</span></div>
    <div class="meta-item"><span class="meta-label">Fecha</span><span class="meta-value">${fecha}</span></div>
    <div class="meta-item"><span class="meta-label">Powered by</span><span class="meta-value">Claude AI · caevik.com</span></div>
  </div>
</div>

<div class="content">
  ${isRaw ? renderRawContent(data.raw) : renderStructuredContent(keywords, posts, articulos, directorios, estrategia, data)}
</div>

<div class="footer">
  <div class="footer-left">Generado por <span class="footer-brand">CAEVIK</span> · caevik.com<br>Exclusivo para: ${userEmail}</div>
  <div class="footer-right">${fecha}<br><span class="footer-brand">Plan ${planLabel}</span></div>
</div>

</div>
</body>
</html>`;
}

function renderRawContent(raw) {
  const html = String(raw)
    .replace(/^### (.+)$/gm, '<h3 style="color:#a78bfa;font-size:11pt;margin:14px 0 6px">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 style="color:#f8fafc;font-size:12pt;margin:18px 0 8px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 style="font-size:14pt;margin:20px 0 10px">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f8fafc">$1</strong>')
    .replace(/^[\-\*] (.+)$/gm, '<li style="margin-bottom:4px;color:#94a3b8">$1</li>');
  return `<div class="section">
    <div class="section-header"><div class="section-icon">📋</div><span class="section-title">Plan de Tráfico Orgánico</span></div>
    <div class="raw-content">${html}</div>
  </div>`;
}

function renderStructuredContent(keywords, posts, articulos, directorios, estrategia, data) {
  const s = [];

  const trafico = data.traficoEstimado
    ? `${Math.round((data.traficoEstimado.min||0)/1000)}K–${Math.round((data.traficoEstimado.max||0)/1000)}K`
    : "—";
  const seoScore = data.scoreSEO ? `${data.scoreSEO}/100` : "—";

  s.push(`<div class="stats-row">
    <div class="stat-card"><div class="stat-value">${seoScore}</div><div class="stat-label">SEO Score</div></div>
    <div class="stat-card"><div class="stat-value">${trafico}</div><div class="stat-label">Tráfico/mes</div></div>
    <div class="stat-card"><div class="stat-value">${posts.length||"—"}</div><div class="stat-label">Posts sociales</div></div>
    <div class="stat-card"><div class="stat-value">${articulos.length||"—"}</div><div class="stat-label">Artículos SEO</div></div>
  </div>`);

  if (estrategia) s.push(`<div class="section">
    <div class="section-header"><div class="section-icon">🎯</div><span class="section-title">Resumen Estratégico</span></div>
    <div class="estrategia-box">${escapeHtml(estrategia)}</div>
  </div>`);

  if (keywords.length) s.push(`<div class="section">
    <div class="section-header"><div class="section-icon">🔑</div><span class="section-title">Keywords Principales</span><span class="section-count">${keywords.length} términos</span></div>
    <div class="keywords-wrap">${keywords.map((kw,i)=>{
      const t=typeof kw==="string"?kw:kw.keyword||kw.term||String(kw);
      return `<span class="keyword-chip ${i>4?"secondary":""}">${escapeHtml(t)}</span>`;
    }).join("")}</div>
  </div>`);

  if (posts.length) s.push(`<div class="section">
    <div class="section-header"><div class="section-icon">📱</div><span class="section-title">Posts para Redes Sociales</span><span class="section-count">${posts.length} posts</span></div>
    <div class="cards-grid">${posts.map((p,i)=>{
      const title=typeof p==="string"?p.substring(0,80):p.titulo||p.title||`Post ${i+1}`;
      const desc=typeof p==="object"?(p.descripcion||p.contenido||""):"";
      const red=typeof p==="object"?(p.red||p.platform||""):"";
      return `<div class="card"><div class="card-number">Post #${String(i+1).padStart(2,"0")}</div><div class="card-title">${escapeHtml(String(title).substring(0,80))}</div>${desc?`<div class="card-desc">${escapeHtml(String(desc).substring(0,120))}</div>`:""}${red?`<span class="card-tag tag-blue">${escapeHtml(red)}</span>`:""}</div>`;
    }).join("")}</div>
  </div>`);

  if (articulos.length) s.push(`<div class="section">
    <div class="section-header"><div class="section-icon">✍️</div><span class="section-title">Artículos de Blog</span><span class="section-count">${articulos.length} artículos</span></div>
    <div class="cards-grid">${articulos.map((a,i)=>{
      const title=typeof a==="string"?a:a.titulo||a.title||`Artículo ${i+1}`;
      const desc=typeof a==="object"?(a.descripcion||a.intro||""):"";
      return `<div class="card"><div class="card-number">Artículo #${String(i+1).padStart(2,"0")}</div><div class="card-title">${escapeHtml(String(title).substring(0,90))}</div>${desc?`<div class="card-desc">${escapeHtml(String(desc).substring(0,130))}</div>`:""}<span class="card-tag tag-green">Blog SEO</span></div>`;
    }).join("")}</div>
  </div>`);

  if (directorios.length) s.push(`<div class="section">
    <div class="section-header"><div class="section-icon">📍</div><span class="section-title">Directorios Locales</span><span class="section-count">${directorios.length} directorios</span></div>
    <div class="cards-grid">${directorios.map((d,i)=>{
      const name=typeof d==="string"?d:d.nombre||d.name||`Directorio ${i+1}`;
      const url=typeof d==="object"?(d.url||""):"";
      const cat=typeof d==="object"?(d.categoria||""):"";
      return `<div class="card"><div class="card-number">Directorio #${String(i+1).padStart(2,"0")}</div><div class="card-title">${escapeHtml(String(name))}</div>${url?`<div class="card-desc">${escapeHtml(url)}</div>`:""}${cat?`<span class="card-tag tag-amber">${escapeHtml(cat)}</span>`:""}</div>`;
    }).join("")}</div>
  </div>`);

  return s.join('<div class="divider"></div>');
}

function escapeHtml(str){
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" }, responseLimit: "20mb" },
};
