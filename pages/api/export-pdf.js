// pages/api/export-pdf.js
// PDF premium con Playwright — renderiza HTML real con diseño dark/glassmorphism
// Instalar: npm install playwright-core @sparticuz/chromium

import chromium from "@sparticuz/chromium";
import playwright from "playwright-core";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Autenticación
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No autorizado" });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: "No autorizado" });

  const { analysisId, planData, siteUrl } = req.body;
  if (!planData) return res.status(400).json({ error: "Datos requeridos" });

  // Obtener plan del usuario
  const { data: userData } = await supabase
    .from("users")
    .select("plan, email")
    .eq("id", user.id)
    .single();

  const plan = userData?.plan || "free";
  const userEmail = userData?.email || user.email;

  // Solo planes pagados pueden exportar PDF premium
  // (free puede exportar versión básica con jsPDF — este endpoint es premium)
  if (plan === "free") {
    return res.status(403).json({
      error: "PDF premium requiere plan Starter o superior",
      upgrade: true,
    });
  }

  try {
    const html = generatePremiumHTML(planData, siteUrl, userEmail, plan);

    // Lanzar Chromium headless
    const executablePath = await chromium.executablePath();

    const browser = await playwright.chromium.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Cargar el HTML directamente (más rápido que navegar a URL)
    await page.setContent(html, { waitUntil: "networkidle" });

    // Esperar a que las fuentes de Google carguen
    await page.waitForTimeout(1500);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // CRÍTICO para fondo oscuro
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      preferCSSPageSize: true,
    });

    await browser.close();

    // Nombre del archivo
    const domain = siteUrl
      ? siteUrl.replace(/https?:\/\//, "").replace(/\//g, "")
      : "plan";
    const fecha = new Date().toISOString().split("T")[0];
    const filename = `CAEVIK-${domain}-${fecha}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generando PDF:", error);
    res.status(500).json({ error: "Error al generar el PDF. Intenta de nuevo." });
  }
}

// ─── Template HTML premium ────────────────────────────────────────────────────

function generatePremiumHTML(planData, siteUrl, userEmail, plan) {
  const fecha = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Parsear el plan (puede llegar como string JSON o ya como objeto)
  let data = planData;
  if (typeof planData === "string") {
    try {
      data = JSON.parse(planData);
    } catch {
      // Si no es JSON, es texto plano del streaming — lo mostramos como contenido
      data = { raw: planData };
    }
  }

  const planLabel = {
    free: "Free",
    starter: "Starter",
    growth: "Growth",
    agency: "Agency",
  }[plan] || plan;

  const planColor = {
    free: "#6b7280",
    starter: "#3b82f6",
    growth: "#8b5cf6",
    agency: "#f59e0b",
  }[plan] || "#8b5cf6";

  // Si el plan es texto crudo del streaming de Claude
  const isRaw = !!data.raw;
  const rawContent = isRaw ? data.raw : null;

  // Secciones estructuradas (si el JSON tiene estructura)
  const keywords = data.keywords || data.keywordsPrimarias || [];
  const posts = data.posts || data.postsRedesSociales || [];
  const articulos = data.articulos || data.articulosBlog || [];
  const directorios = data.directorios || data.directoriosLocales || [];
  const estrategia = data.estrategia || data.resumen || "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plan de Tráfico Orgánico — CAEVIK</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* ── Reset & base ─────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg-primary: #0a0a0f;
      --bg-secondary: #111118;
      --bg-card: rgba(255,255,255,0.04);
      --border: rgba(255,255,255,0.08);
      --border-bright: rgba(255,255,255,0.15);
      --accent: #7c3aed;
      --accent-light: #a78bfa;
      --accent-glow: rgba(124,58,237,0.3);
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #475569;
      --green: #10b981;
      --blue: #3b82f6;
      --amber: #f59e0b;
      --red: #ef4444;
    }

    html, body {
      background: var(--bg-primary);
      color: var(--text-primary);
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 10pt;
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Page layout ─────────────────────────────────── */
    @page {
      size: A4;
      margin: 0;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      background: var(--bg-primary);
      position: relative;
      overflow: hidden;
    }

    /* ── Gradient background glow ─────────────────────── */
    .bg-glow-1 {
      position: fixed;
      top: -100px;
      left: -100px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    .bg-glow-2 {
      position: fixed;
      bottom: 100px;
      right: -50px;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    /* ── Cover / Header ──────────────────────────────── */
    .cover {
      padding: 48px 48px 40px;
      border-bottom: 1px solid var(--border);
      position: relative;
    }

    .cover-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--accent), #4f46e5);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      color: white;
      box-shadow: 0 0 20px var(--accent-glow);
    }

    .logo-text {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #f8fafc 0%, var(--accent-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .plan-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(124,58,237,0.15);
      border: 1px solid rgba(124,58,237,0.3);
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
      color: var(--accent-light);
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .cover-title {
      margin-bottom: 8px;
    }

    .cover-title h1 {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -1px;
      line-height: 1.2;
      background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 6px;
    }

    .cover-subtitle {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .cover-meta {
      display: flex;
      gap: 24px;
      margin-top: 24px;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .meta-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text-muted);
    }

    .meta-value {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .meta-value.url {
      color: var(--accent-light);
    }

    /* ── Section layout ──────────────────────────────── */
    .content {
      padding: 36px 48px;
    }

    .section {
      margin-bottom: 32px;
      page-break-inside: avoid;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
    }

    .section-icon {
      width: 28px;
      height: 28px;
      background: var(--bg-card);
      border: 1px solid var(--border-bright);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      flex-shrink: 0;
    }

    .section-title {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: -0.2px;
      color: var(--text-primary);
    }

    .section-count {
      margin-left: auto;
      font-size: 11px;
      color: var(--text-muted);
      background: var(--bg-card);
      border: 1px solid var(--border);
      padding: 2px 8px;
      border-radius: 100px;
    }

    /* ── Cards grid ──────────────────────────────────── */
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .cards-grid.single {
      grid-template-columns: 1fr;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px 16px;
      position: relative;
      overflow: hidden;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border-bright), transparent);
    }

    .card-number {
      font-size: 10px;
      font-weight: 600;
      color: var(--accent-light);
      margin-bottom: 6px;
      opacity: 0.8;
    }

    .card-title {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 4px;
      line-height: 1.4;
    }

    .card-desc {
      font-size: 10px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .card-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 8px;
      padding: 2px 8px;
      border-radius: 100px;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .tag-green { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.2); }
    .tag-blue  { background: rgba(59,130,246,0.15);  color: #60a5fa; border: 1px solid rgba(59,130,246,0.2);  }
    .tag-amber { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.2); }
    .tag-purple{ background: rgba(124,58,237,0.15); color: #a78bfa; border: 1px solid rgba(124,58,237,0.2); }

    /* ── Keywords chips ──────────────────────────────── */
    .keywords-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .keyword-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(124,58,237,0.1);
      border: 1px solid rgba(124,58,237,0.25);
      border-radius: 100px;
      font-size: 11px;
      font-weight: 500;
      color: var(--accent-light);
    }

    .keyword-chip.secondary {
      background: rgba(255,255,255,0.04);
      border-color: var(--border);
      color: var(--text-secondary);
    }

    /* ── Raw content (texto plano del streaming) ────── */
    .raw-content {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 24px;
      white-space: pre-wrap;
      font-size: 10.5pt;
      line-height: 1.7;
      color: var(--text-secondary);
    }

    .raw-content h1, .raw-content h2, .raw-content h3 {
      color: var(--text-primary);
      font-weight: 600;
      margin: 16px 0 8px;
    }

    .raw-content h1 { font-size: 14pt; }
    .raw-content h2 { font-size: 12pt; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
    .raw-content h3 { font-size: 11pt; color: var(--accent-light); }

    /* ── Estrategia box ──────────────────────────────── */
    .estrategia-box {
      background: linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(59,130,246,0.05) 100%);
      border: 1px solid rgba(124,58,237,0.2);
      border-radius: 10px;
      padding: 18px 20px;
      font-size: 11px;
      line-height: 1.7;
      color: var(--text-secondary);
    }

    /* ── Stats row ───────────────────────────────────── */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 28px;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px 16px;
      text-align: center;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -1px;
      background: linear-gradient(135deg, var(--text-primary), var(--accent-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--text-muted);
    }

    /* ── Footer ──────────────────────────────────────── */
    .footer {
      padding: 20px 48px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-left {
      font-size: 9px;
      color: var(--text-muted);
    }

    .footer-right {
      font-size: 9px;
      color: var(--text-muted);
      text-align: right;
    }

    .footer-brand {
      font-weight: 600;
      color: var(--accent-light);
    }

    /* ── Divider ─────────────────────────────────────── */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border-bright), transparent);
      margin: 4px 0 24px;
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Background glows -->
  <div class="bg-glow-1"></div>
  <div class="bg-glow-2"></div>

  <!-- ── COVER ─────────────────────────────────────────── -->
  <div class="cover">
    <div class="cover-top">
      <div class="logo">
        <div class="logo-icon">C</div>
        <span class="logo-text">CAEVIK</span>
      </div>
      <span class="plan-badge">&#9679; Plan ${planLabel}</span>
    </div>

    <div class="cover-title">
      <h1>Plan de Tráfico Orgánico</h1>
      <p class="cover-subtitle">Estrategia personalizada generada con inteligencia artificial</p>
    </div>

    <div class="cover-meta">
      ${siteUrl ? `<div class="meta-item">
        <span class="meta-label">Sitio web</span>
        <span class="meta-value url">${siteUrl}</span>
      </div>` : ""}
      <div class="meta-item">
        <span class="meta-label">Generado por</span>
        <span class="meta-value">${userEmail}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Fecha</span>
        <span class="meta-value">${fecha}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Powered by</span>
        <span class="meta-value">Claude AI · caevik.com</span>
      </div>
    </div>
  </div>

  <!-- ── CONTENT ────────────────────────────────────────── -->
  <div class="content">

    ${isRaw
      ? renderRawContent(rawContent)
      : renderStructuredContent(data, keywords, posts, articulos, directorios, estrategia, planLabel)
    }

  </div>

  <!-- ── FOOTER ─────────────────────────────────────────── -->
  <div class="footer">
    <div class="footer-left">
      Generado automáticamente por <span class="footer-brand">CAEVIK</span> · caevik.com<br>
      Este plan es exclusivo para: ${userEmail}
    </div>
    <div class="footer-right">
      ${fecha}<br>
      <span class="footer-brand">Plan ${planLabel}</span>
    </div>
  </div>

</div>
</body>
</html>`;
}

// ─── Renderizar contenido en texto plano (streaming raw) ─────────────────────

function renderRawContent(raw) {
  // Convertir markdown básico a HTML
  const html = raw
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f8fafc">$1</strong>')
    // Listas
    .replace(/^[\-\*] (.+)$/gm, '<li style="margin-bottom:4px">$1</li>')
    // Saltos de línea dobles → párrafos
    .replace(/\n\n/g, '</p><p style="margin-bottom:12px">')

  return `
    <div class="section">
      <div class="section-header">
        <div class="section-icon">📋</div>
        <span class="section-title">Plan de Tráfico Orgánico</span>
      </div>
      <div class="raw-content">${html}</div>
    </div>
  `;
}

// ─── Renderizar contenido estructurado ───────────────────────────────────────

function renderStructuredContent(data, keywords, posts, articulos, directorios, estrategia, planLabel) {
  const sections = [];

  // Stats row
  const statsHtml = `
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">${keywords.length || "—"}</div>
        <div class="stat-label">Keywords</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${posts.length || "—"}</div>
        <div class="stat-label">Posts sociales</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${articulos.length || "—"}</div>
        <div class="stat-label">Artículos blog</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${directorios.length || "—"}</div>
        <div class="stat-label">Directorios</div>
      </div>
    </div>
  `;
  sections.push(statsHtml);

  // Estrategia
  if (estrategia) {
    sections.push(`
      <div class="section">
        <div class="section-header">
          <div class="section-icon">🎯</div>
          <span class="section-title">Resumen Estratégico</span>
        </div>
        <div class="estrategia-box">${estrategia}</div>
      </div>
    `);
  }

  // Keywords
  if (keywords.length > 0) {
    const chips = keywords.map((kw, i) => {
      const term = typeof kw === "string" ? kw : kw.keyword || kw.term || JSON.stringify(kw);
      return `<span class="keyword-chip ${i > 4 ? 'secondary' : ''}">${term}</span>`;
    }).join("");

    sections.push(`
      <div class="section">
        <div class="section-header">
          <div class="section-icon">🔑</div>
          <span class="section-title">Keywords Principales</span>
          <span class="section-count">${keywords.length} términos</span>
        </div>
        <div class="keywords-wrap">${chips}</div>
      </div>
    `);
  }

  // Posts redes sociales
  if (posts.length > 0) {
    const cards = posts.map((post, i) => {
      const title = typeof post === "string"
        ? post.substring(0, 80) + (post.length > 80 ? "..." : "")
        : post.titulo || post.title || post.contenido?.substring(0, 80) || "Post " + (i + 1);
      const desc = typeof post === "object"
        ? (post.descripcion || post.description || post.contenido || post.hashtags || "")
        : "";
      const red = typeof post === "object" ? (post.red || post.platform || "") : "";

      return `
        <div class="card">
          <div class="card-number">Post #${String(i + 1).padStart(2, "0")}</div>
          <div class="card-title">${escapeHtml(title)}</div>
          ${desc ? `<div class="card-desc">${escapeHtml(String(desc).substring(0, 120))}</div>` : ""}
          ${red ? `<span class="card-tag tag-blue">${escapeHtml(red)}</span>` : ""}
        </div>
      `;
    }).join("");

    sections.push(`
      <div class="section">
        <div class="section-header">
          <div class="section-icon">📱</div>
          <span class="section-title">Posts para Redes Sociales</span>
          <span class="section-count">${posts.length} posts</span>
        </div>
        <div class="cards-grid">${cards}</div>
      </div>
    `);
  }

  // Artículos blog
  if (articulos.length > 0) {
    const cards = articulos.map((art, i) => {
      const title = typeof art === "string" ? art
        : art.titulo || art.title || "Artículo " + (i + 1);
      const desc = typeof art === "object"
        ? (art.descripcion || art.description || art.intro || art.extracto || "")
        : "";
      const palabras = typeof art === "object" ? (art.palabras_clave || art.keywords || "") : "";

      return `
        <div class="card">
          <div class="card-number">Artículo #${String(i + 1).padStart(2, "0")}</div>
          <div class="card-title">${escapeHtml(String(title).substring(0, 90))}</div>
          ${desc ? `<div class="card-desc">${escapeHtml(String(desc).substring(0, 130))}</div>` : ""}
          <span class="card-tag tag-green">Blog SEO</span>
        </div>
      `;
    }).join("");

    sections.push(`
      <div class="section">
        <div class="section-header">
          <div class="section-icon">✍️</div>
          <span class="section-title">Artículos de Blog</span>
          <span class="section-count">${articulos.length} artículos</span>
        </div>
        <div class="cards-grid">${cards}</div>
      </div>
    `);
  }

  // Directorios
  if (directorios.length > 0) {
    const cards = directorios.map((dir, i) => {
      const name = typeof dir === "string" ? dir
        : dir.nombre || dir.name || dir.directorio || "Directorio " + (i + 1);
      const url = typeof dir === "object" ? (dir.url || dir.link || "") : "";
      const cat = typeof dir === "object" ? (dir.categoria || dir.category || "") : "";

      return `
        <div class="card">
          <div class="card-number">Directorio #${String(i + 1).padStart(2, "0")}</div>
          <div class="card-title">${escapeHtml(String(name))}</div>
          ${url ? `<div class="card-desc">${escapeHtml(url)}</div>` : ""}
          ${cat ? `<span class="card-tag tag-amber">${escapeHtml(cat)}</span>` : ""}
        </div>
      `;
    }).join("");

    sections.push(`
      <div class="section">
        <div class="section-header">
          <div class="section-icon">📍</div>
          <span class="section-title">Directorios Locales</span>
          <span class="section-count">${directorios.length} directorios</span>
        </div>
        <div class="cards-grid">${cards}</div>
      </div>
    `);
  }

  return sections.join('<div class="divider"></div>');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
    responseLimit: "20mb",
  },
};
