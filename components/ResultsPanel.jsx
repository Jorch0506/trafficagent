// components/ResultsPanel.jsx
// Panel de resultados con exportación a PDF — diseño premium sin emojis

import { useState } from "react";
import { LogoSVG } from "./LogoSVG";

function Tag({ children, color = "#38bdf8" }) {
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: "var(--radius-sm)", padding: "2px 10px", fontSize: "var(--text-xs)", fontWeight: 600, fontFamily: "var(--font-mono)", letterSpacing: 1, display: "inline-block" }}>
      {children}
    </span>
  );
}

function ScoreRing({ score }) {
  const r = 42, circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score < 40 ? "#f87171" : score < 70 ? "#f59e0b" : "#4ade80";
  return (
    <div style={{ position: "relative", width: 110, height: 110, margin: "0 auto 12px" }}>
      <svg width={110} height={110} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={55} cy={55} r={r} fill="none" stroke="#ffffff11" strokeWidth={8} />
        <circle cx={55} cy={55} r={r} fill="none" stroke={color} strokeWidth={8} strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 26, fontWeight: 800, color, fontFamily: "var(--font-mono)" }}>{score}</span>
        <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 1 }}>SEO SCORE</span>
      </div>
    </div>
  );
}

function loadJsPDF() {
  return new Promise((resolve, reject) => {
    if (window.jspdf) { resolve(window.jspdf.jsPDF); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => resolve(window.jspdf.jsPDF);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Elimina emojis y caracteres no ASCII que jsPDF no puede renderizar
function clean(str) {
  if (!str) return "";
  return String(str)
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")   // emojis Unicode altos
    .replace(/[\u2600-\u27BF]/g, "")           // símbolos misc
    .replace(/[\uD800-\uDFFF]/g, "")           // surrogates
    .replace(/[^\x00-\xFF]/g, "")              // todo fuera de Latin-1
    .replace(/\s+/g, " ")
    .trim();
}

async function exportToPDF(data, url) {
  const jsPDF = await loadJsPDF();
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210, H = 297;
  const ml = 20, mr = 20;
  const cw = W - ml - mr;
  let y = 0;

  const C = {
    bg:      [8,   15,  30],
    surface: [15,  25,  50],
    card:    [20,  35,  65],
    border:  [40,  60,  100],
    brand:   [56,  189, 248],
    success: [74,  222, 128],
    warning: [245, 158, 11],
    accent:  [178, 120, 255],
    white:   [240, 245, 255],
    muted:   [140, 160, 195],
    dim:     [80,  100, 140],
  };

  const newPage = () => {
    doc.addPage();
    // fondo en cada página nueva
    doc.setFillColor(...C.bg);
    doc.rect(0, 0, W, H, "F");
    y = 22;
  };

  const guard = (need = 20) => { if (y + need > H - 18) newPage(); };

  const hline = (color = C.border, lw = 0.2) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(lw);
    doc.line(ml, y, W - mr, y);
    y += 4;
  };

  const section = (title, color = C.brand) => {
    guard(14);
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...color);
    doc.text(title.toUpperCase(), ml, y);
    y += 2;
    doc.setDrawColor(...color);
    doc.setLineWidth(0.4);
    doc.line(ml, y, ml + 30, y);
    y += 7;
  };

  const bodyText = (text, indent = 0, size = 9, color = C.white) => {
    guard(12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(clean(text), cw - indent);
    doc.text(lines, ml + indent, y);
    y += lines.length * (size * 0.42) + 3;
  };

  const label = (text, size = 7.5, color = C.muted) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(clean(text).toUpperCase(), ml, y);
    y += 4;
  };

  // ── PORTADA ──────────────────────────────────────────────────────────
  doc.setFillColor(...C.bg);
  doc.rect(0, 0, W, H, "F");

  // Banda superior de color
  doc.setFillColor(...C.brand);
  doc.rect(0, 0, W, 3, "F");

  // Banda lateral izquierda decorativa
  doc.setFillColor(...C.card);
  doc.rect(0, 0, 6, H, "F");

  // Logo y nombre
  y = 36;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(...C.white);
  doc.text("CAEVIK", ml + 8, y);

  doc.setFontSize(10);
  doc.setTextColor(...C.brand);
  doc.text("AI Traffic Agent", ml + 8, y + 8);

  // Separador
  y += 20;
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.line(ml + 8, y, W - mr, y);
  y += 12;

  // Título del reporte
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...C.white);
  doc.text("Plan de Trafico Organico", ml + 8, y);
  y += 10;

  // URL
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...C.brand);
  doc.text(clean(url || "—"), ml + 8, y);
  y += 8;

  // Fecha
  doc.setFontSize(9);
  doc.setTextColor(...C.muted);
  const fecha = new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
  doc.text(`Generado el ${fecha}`, ml + 8, y);
  y += 22;

  // Tarjetas de métricas 2x2
  const metrics = [
    { l: "SEO Score",     v: String(data.scoreSEO || "—"),              c: C.brand   },
    { l: "Trafico Est.",  v: data.traficoEstimado
        ? `${(data.traficoEstimado.min/1000).toFixed(1)}K - ${(data.traficoEstimado.max/1000).toFixed(1)}K/mes`
        : "—",                                                           c: C.success },
    { l: "Potencial",     v: clean(data.potencialCrecimiento || "—"),   c: C.warning },
    { l: "Posts",         v: String(data.posts?.length || "—"),         c: C.accent  },
  ];

  const cardW = (cw - 6) / 2;
  const cardH = 22;
  metrics.forEach((m, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = ml + 8 + col * (cardW + 6);
    const cy = y + row * (cardH + 5);
    // fondo tarjeta
    doc.setFillColor(...C.card);
    doc.roundedRect(cx, cy, cardW, cardH, 2, 2, "F");
    // borde izquierdo de color
    doc.setFillColor(...m.c);
    doc.rect(cx, cy, 2, cardH, "F");
    // valor
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...m.c);
    doc.text(m.v, cx + 7, cy + 10);
    // label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.muted);
    doc.text(m.l.toUpperCase(), cx + 7, cy + 17);
  });

  y += 2 * (cardH + 5) + 16;

  // Competencia
  doc.setFillColor(...C.surface);
  doc.roundedRect(ml + 8, y, cw - 8, 22, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...C.muted);
  doc.text("COMPETENCIA", ml + 14, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...C.white);
  doc.text(clean(data.competencia?.nivel || "—"), ml + 14, y + 16);

  const opoX = ml + 8 + (cw - 8) / 2 + 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...C.muted);
  doc.text("OPORTUNIDAD", opoX, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.success);
  const opoLines = doc.splitTextToSize(clean(data.competencia?.oportunidad || "—"), (cw - 8) / 2 - 10);
  doc.text(opoLines, opoX, y + 16);
  y += 30;

  // Footer portada
  doc.setFontSize(7.5);
  doc.setTextColor(...C.dim);
  doc.text("Generado por CAEVIK  |  caevik.com", ml + 8, H - 12);

  // ── PÁGINA 2: KEYWORDS + ACCIONES ───────────────────────────────────
  newPage();

  section("Keywords Primarias", C.brand);
  if (data.keywordsPrimarias?.length) {
    let kx = ml;
    const startY = y;
    data.keywordsPrimarias.forEach(kw => {
      const t = clean(kw);
      doc.setFontSize(8.5);
      const tw = doc.getTextWidth(t);
      const pw = tw + 10;
      if (kx + pw > W - mr) { kx = ml; y += 9; guard(9); }
      doc.setFillColor(15, 40, 70);
      doc.roundedRect(kx, y - 5, pw, 7, 1.5, 1.5, "F");
      doc.setTextColor(...C.brand);
      doc.text(t, kx + 5, y);
      kx += pw + 4;
    });
    y += 12;
  }

  section("Keywords Long Tail", C.accent);
  if (data.keywordsLongTail?.length) {
    data.keywordsLongTail.forEach(kw => {
      guard(8);
      doc.setFontSize(8.5);
      doc.setTextColor(...C.muted);
      doc.text("—", ml, y);
      doc.setTextColor(...C.white);
      doc.text(clean(kw), ml + 5, y);
      y += 7;
    });
    y += 4;
  }

  section("Acciones Inmediatas", C.success);
  data.accionesInmediatas?.forEach((a, i) => {
    guard(16);
    // número
    doc.setFillColor(...C.success);
    doc.circle(ml + 3, y - 1, 2.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...C.bg);
    doc.text(String(i + 1), ml + 3 - (i < 9 ? 1 : 1.8), y);
    // texto
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...C.white);
    const lines = doc.splitTextToSize(clean(a), cw - 12);
    doc.text(lines, ml + 9, y);
    y += lines.length * 5 + 4;
  });

  // ── PÁGINAS DE POSTS ─────────────────────────────────────────────────
  if (data.posts?.length) {
    newPage();
    section("Posts para Redes Sociales", C.accent);

    data.posts.forEach((post, i) => {
      guard(38);

      const redColor = post.red === "Instagram" ? C.accent : C.brand;

      // Cabecera del post
      doc.setFillColor(...C.card);
      doc.roundedRect(ml, y - 2, cw, 10, 1.5, 1.5, "F");
      doc.setFillColor(...redColor);
      doc.roundedRect(ml, y - 2, cw, 10, 1.5, 1.5, "F");
      // texto cabecera
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...C.bg);
      doc.text(`${clean(post.red)}  |  ${clean(post.tipo)}`, ml + 4, y + 4);
      doc.text(`POST ${String(i + 1).padStart(2, "0")}`, W - mr - doc.getTextWidth(`POST ${String(i + 1).padStart(2, "0")}`) - 4, y + 4);
      y += 13;

      // Título del post
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...C.white);
      const titleLines = doc.splitTextToSize(clean(post.titulo), cw);
      doc.text(titleLines, ml, y);
      y += titleLines.length * 5 + 3;

      // Caption
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...C.muted);
      const captionLines = doc.splitTextToSize(clean(post.caption), cw);
      doc.text(captionLines, ml, y);
      y += captionLines.length * 4.2 + 3;

      // Hashtags (solo texto, sin emojis)
      if (post.hashtags?.length) {
        doc.setFontSize(8);
        doc.setTextColor(...C.brand);
        const hashText = post.hashtags.map(h => clean(h)).filter(Boolean).slice(0, 6).join("  ");
        const hashLines = doc.splitTextToSize(hashText, cw);
        doc.text(hashLines, ml, y);
        y += hashLines.length * 4 + 3;
      }

      // Separador entre posts
      doc.setDrawColor(...C.border);
      doc.setLineWidth(0.15);
      doc.line(ml, y, W - mr, y);
      y += 6;
    });
  }

  // ── ARTÍCULOS SEO ─────────────────────────────────────────────────────
  if (data.articulosSEO?.length) {
    newPage();
    section("Articulos SEO", C.success);

    data.articulosSEO.forEach((art, i) => {
      guard(35);

      // Número de artículo
      label(`Articulo ${i + 1}  /  /${clean(art.slug)}`, 7.5, C.dim);

      // Título
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...C.success);
      const artTitle = doc.splitTextToSize(clean(art.titulo), cw);
      doc.text(artTitle, ml, y);
      y += artTitle.length * 5 + 2;

      // Meta description
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(...C.muted);
      const meta = doc.splitTextToSize(clean(art.metaDescription), cw);
      doc.text(meta, ml, y);
      y += meta.length * 4.2 + 3;

      // Palabras clave
      if (art.palabrasClave?.length) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...C.brand);
        doc.text(art.palabrasClave.map(k => clean(k)).join("  |  "), ml, y);
        y += 5;
      }

      // Estructura
      if (art.estructura?.length) {
        art.estructura.forEach(h => {
          guard(6);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(...C.dim);
          doc.text(`  ${clean(h)}`, ml, y);
          y += 5;
        });
      }

      doc.setDrawColor(...C.border);
      doc.setLineWidth(0.15);
      doc.line(ml, y + 2, W - mr, y + 2);
      y += 8;
    });
  }

  // ── DIRECTORIOS ───────────────────────────────────────────────────────
  if (data.directorios?.length) {
    newPage();
    section("Directorios Relevantes", C.warning);

    data.directorios.forEach((dir, i) => {
      guard(14);
      const prioColor = dir.prioridad === "Alta" ? C.success : dir.prioridad === "Media" ? C.warning : C.dim;

      doc.setFillColor(...C.card);
      doc.roundedRect(ml, y - 4, cw, 12, 1.5, 1.5, "F");

      // Indicador de prioridad (barra lateral)
      doc.setFillColor(...prioColor);
      doc.rect(ml, y - 4, 2, 12, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...C.white);
      doc.text(clean(dir.nombre), ml + 7, y + 1);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...C.muted);
      doc.text(clean(dir.url), ml + 7, y + 6);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...prioColor);
      const prioText = clean(dir.prioridad || "—");
      doc.text(prioText, W - mr - doc.getTextWidth(prioText) - 4, y + 3);

      y += 15;
    });
  }

  // Footer en todas las páginas
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    // línea footer
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.2);
    doc.line(ml, H - 10, W - mr, H - 10);
    doc.setFontSize(7);
    doc.setTextColor(...C.dim);
    doc.text("CAEVIK  |  caevik.com", ml, H - 6);
    doc.text(`Pagina ${p} de ${totalPages}`, W - mr - doc.getTextWidth(`Pagina ${p} de ${totalPages}`), H - 6);
  }

  const filename = `caevik-${clean(url || "plan").replace(/https?:\/\//, "").replace(/[^a-zA-Z0-9]/g, "-").slice(0, 30)}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

export function ResultsPanel({ data, url, onReset, user, userPlan, onShowAuth }) {
  const [tab, setTab] = useState("overview");
  const [exporting, setExporting] = useState(false);
  const tabs = [["overview", "📊 Overview"], ["posts", "📱 Posts"], ["seo", "✍️ SEO"], ["directorios", "📂 Directorios"]];

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportToPDF(data, url);
    } catch (err) {
      console.error("Error exportando PDF:", err);
      alert("Error al exportar. Intenta de nuevo.");
    } finally {
      setExporting(false);
    }
  };

  const handleUpgrade = async (planId) => {
    if (!user) { onShowAuth(); return; }
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: planId }) });
      const d = await res.json();
      if (d.url) window.location.href = d.url;
    } catch { alert("Error de conexión."); }
  };

  const getUpgradeCTA = () => {
    if (!user) return <button onClick={onShowAuth} style={ctaStyle("var(--gradient-brand)")}>Guardar plan gratis →</button>;
    if (!userPlan || userPlan === "free") return <button onClick={() => handleUpgrade("starter")} style={ctaStyle("var(--gradient-brand)")}>Activar Starter $29 →</button>;
    if (userPlan === "starter") return <button onClick={() => handleUpgrade("growth")} style={ctaStyle("var(--gradient-warm)")}>Activar Growth $99 →</button>;
    if (userPlan === "growth") return <button onClick={() => handleUpgrade("agency")} style={ctaStyle("var(--gradient-agency)")}>Activar Agency $299 →</button>;
    return null;
  };

  const ctaStyle = (bg) => ({ padding: "10px 20px", background: bg, border: "none", borderRadius: "var(--radius-sm)", color: "#fff", cursor: "pointer", fontSize: "var(--text-sm)", fontWeight: 700, fontFamily: "var(--font-sans)" });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
      <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--bg-border)", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-3)" }}>
        <div>
          <LogoSVG id="results-logo" width={200} height={52} />
          <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
            Plan generado para: <span style={{ color: "var(--brand-primary)" }}>{url}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
          {user && <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", background: "var(--bg-elevated)", padding: "4px 12px", borderRadius: "var(--radius-full)", border: "1px solid var(--bg-border)" }}>Plan: {userPlan || "free"}</span>}
          <button onClick={handleExportPDF} disabled={exporting} style={{ padding: "10px 16px", background: "transparent", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-sm)", color: exporting ? "var(--text-disabled)" : "var(--text-secondary)", cursor: exporting ? "not-allowed" : "pointer", fontSize: "var(--text-sm)", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            {exporting ? "Exportando..." : "⬇ Exportar PDF"}
          </button>
          <button onClick={onReset} style={{ padding: "10px 20px", background: "transparent", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)", cursor: "pointer", fontSize: "var(--text-sm)", fontFamily: "var(--font-sans)" }}>← Nuevo análisis</button>
          {getUpgradeCTA()}
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", gap: "var(--space-1)", marginBottom: "var(--space-8)", background: "var(--bg-elevated)", borderRadius: "var(--radius-lg)", padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: "10px 18px", borderRadius: "var(--radius-sm)", border: "none", fontSize: "var(--text-sm)", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", background: tab === id ? "var(--gradient-brand)" : "transparent", color: tab === id ? "#fff" : "var(--text-muted)" }}>{label}</button>
          ))}
        </div>

        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
              {[
                { label: "Tráfico estimado", value: `${data.traficoEstimado?.min?.toLocaleString()}-${data.traficoEstimado?.max?.toLocaleString()}`, sub: data.traficoEstimado?.periodo, color: "var(--brand-primary)" },
                { label: "Nivel competencia", value: data.competencia?.nivel, sub: "en tu nicho", color: "var(--brand-warning)" },
                { label: "Potencial", value: data.potencialCrecimiento, sub: "de crecimiento", color: "var(--brand-success)" },
                { label: "Posts generados", value: data.posts?.length, sub: "listos para publicar", color: "var(--brand-accent)" },
              ].map(({ label, value, sub, color }) => (
                <div key={label} style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)" }}>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", letterSpacing: 0.5, marginBottom: "var(--space-2)" }}>{label.toUpperCase()}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: typeof value === "string" && value.length > 20 ? "var(--text-sm)" : "var(--text-xl)", color, marginBottom: "var(--space-1)", lineHeight: 1.4 }}>{value}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-disabled)" }}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)", marginBottom: "var(--space-6)" }}>
              <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
                <ScoreRing score={data.scoreSEO} />
                <div style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Oportunidad: <span style={{ color: "var(--brand-success)" }}>{data.competencia?.oportunidad}</span></div>
              </div>
              <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>ACCIONES INMEDIATAS</div>
                {data.accionesInmediatas?.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-2)", alignItems: "flex-start" }}>
                    <span style={{ color: "var(--brand-primary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", marginTop: 2, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.5 }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>KEYWORDS PRIMARIAS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>{data.keywordsPrimarias?.map(kw => <Tag key={kw} color="#38bdf8">{kw}</Tag>)}</div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "var(--space-3)" }}>LONG TAIL</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>{data.keywordsLongTail?.map(kw => <Tag key={kw} color="#818cf8">{kw}</Tag>)}</div>
            </div>
            {!user && (
              <div style={{ background: "linear-gradient(135deg, #38bdf811, #818cf811)", border: "1px solid #38bdf833", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", textAlign: "center", marginTop: "var(--space-6)" }}>
                <div style={{ fontSize: 28, marginBottom: "var(--space-3)" }}>💾</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>Guarda este plan gratis</div>
                <div style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-5)" }}>Crea tu cuenta para guardar resultados y generar más análisis cada mes.</div>
                <button onClick={onShowAuth} style={{ padding: "14px 32px", background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-md)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "var(--text-base)", fontFamily: "var(--font-sans)" }}>Crear cuenta gratis →</button>
              </div>
            )}
          </div>
        )}

        {tab === "posts" && (
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            {data.posts?.map((post, i) => (
              <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                  <div style={{ display: "flex", gap: "var(--space-2)" }}><Tag color={post.red === "Instagram" ? "#e879f9" : "#38bdf8"}>{post.red}</Tag><Tag color="#64748b">{post.tipo}</Tag></div>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-disabled)", fontFamily: "var(--font-mono)" }}>POST {String(i + 1).padStart(2, "0")}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: "var(--text-md)", marginBottom: "var(--space-2)" }}>{post.titulo}</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "var(--space-4)", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", padding: "var(--space-4)" }}>{post.caption}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}>{post.hashtags?.map(h => <span key={h} style={{ fontSize: "var(--text-xs)", color: "var(--brand-primary)" }}>{h}</span>)}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "seo" && (
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            {data.articulosSEO?.map((art, i) => (
              <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: "var(--space-2)" }}>ARTÍCULO {i + 1} · /{art.slug}</div>
                <div style={{ fontWeight: 700, fontSize: "var(--text-lg)", marginBottom: "var(--space-2)", color: "var(--brand-primary)" }}>{art.titulo}</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-4)", fontStyle: "italic" }}>{art.metaDescription}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)", marginBottom: "var(--space-4)" }}>{art.palabrasClave?.map(kw => <Tag key={kw} color="#4ade80">{kw}</Tag>)}</div>
                <div style={{ borderTop: "1px solid var(--bg-border)", paddingTop: "var(--space-4)" }}>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-disabled)", marginBottom: "var(--space-2)" }}>ESTRUCTURA</div>
                  {art.estructura?.map((h, j) => <div key={j} style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", padding: "5px 0" }}>{h}</div>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "directorios" && (
          <div>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", marginBottom: "var(--space-4)" }}>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-5)" }}>Directorios donde tu negocio debe aparecer para generar tráfico orgánico:</div>
              <div style={{ display: "grid", gap: "var(--space-3)" }}>
                {data.directorios?.map((dir, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--bg-border)" }}>
                    <div><div style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>{dir.nombre}</div><div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{dir.url}</div></div>
                    <Tag color={dir.prioridad === "Alta" ? "#4ade80" : "#f59e0b"}>{dir.prioridad}</Tag>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", textAlign: "center" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-disabled)", fontFamily: "var(--font-mono)", letterSpacing: 1, marginBottom: "var(--space-2)" }}>PRÓXIMAMENTE EN AGENCY</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-lg)", marginBottom: "var(--space-2)", color: "var(--text-muted)" }}>Registro automático en directorios</div>
              <div style={{ color: "var(--text-disabled)", fontSize: "var(--text-sm)" }}>Estamos construyendo la automatización de registro. Disponible pronto en el plan Agency.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
