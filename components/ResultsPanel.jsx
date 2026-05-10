// components/ResultsPanel.jsx
// Panel de resultados con exportación a PDF via jsPDF

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

// Carga jsPDF desde CDN de forma lazy
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

async function exportToPDF(data, url) {
  const jsPDF = await loadJsPDF();
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = 210;
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = 20;

  const colors = {
    brand:   [56,  189, 248],
    success: [74,  222, 128],
    warning: [245, 158, 11],
    accent:  [232, 121, 249],
    dark:    [15,  23,  42],
    gray:    [100, 116, 139],
    light:   [226, 232, 240],
    white:   [255, 255, 255],
  };

  const addPage = () => {
    doc.addPage();
    y = 20;
  };

  const checkY = (needed = 20) => {
    if (y + needed > 270) addPage();
  };

  const drawRect = (x, ry, w, h, r, fillColor) => {
    doc.setFillColor(...fillColor);
    doc.roundedRect(x, ry, w, h, r, r, "F");
  };

  // ── PORTADA ──────────────────────────────────────────────────────────
  // Fondo oscuro
  doc.setFillColor(...colors.dark);
  doc.rect(0, 0, 210, 297, "F");

  // Gradiente simulado con rectángulos de color
  doc.setFillColor(38, 100, 180);
  doc.rect(0, 0, 210, 4, "F");

  // Logo texto
  doc.setTextColor(...colors.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("CAEVIK", margin, 40);

  doc.setFontSize(11);
  doc.setTextColor(...colors.gray);
  doc.text("AI Traffic Agent", margin, 48);

  // Línea decorativa
  doc.setDrawColor(...colors.brand);
  doc.setLineWidth(0.5);
  doc.line(margin, 54, margin + 40, 54);

  // Título del reporte
  doc.setTextColor(...colors.white);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Plan de Tráfico Orgánico", margin, 80);

  // URL analizada
  doc.setFontSize(13);
  doc.setTextColor(...colors.brand);
  doc.text(url || "—", margin, 92);

  // Fecha
  doc.setFontSize(10);
  doc.setTextColor(...colors.gray);
  const fecha = new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
  doc.text(`Generado el ${fecha}`, margin, 102);

  // Métricas resumen en portada
  const metrics = [
    { label: "SEO Score", value: String(data.scoreSEO || "—"), color: colors.brand },
    { label: "Tráfico est.", value: data.traficoEstimado ? `${(data.traficoEstimado.min/1000).toFixed(1)}K-${(data.traficoEstimado.max/1000).toFixed(1)}K/mes` : "—", color: colors.success },
    { label: "Potencial", value: data.potencialCrecimiento || "—", color: colors.warning },
    { label: "Posts", value: String(data.posts?.length || "—"), color: colors.accent },
  ];

  const cardW = (contentW - 9) / 2;
  metrics.forEach((m, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = margin + col * (cardW + 6);
    const cy = 125 + row * 28;
    drawRect(cx, cy, cardW, 22, 3, [20, 30, 50]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...m.color);
    doc.text(m.value, cx + 6, cy + 10);
    doc.setFontSize(8);
    doc.setTextColor(...colors.gray);
    doc.text(m.label.toUpperCase(), cx + 6, cy + 17);
  });

  // Separador
  doc.setDrawColor(...colors.brand);
  doc.setLineWidth(0.3);
  doc.line(margin, 195, pageW - margin, 195);

  // Competencia y oportunidad
  doc.setFontSize(10);
  doc.setTextColor(...colors.gray);
  doc.text("COMPETENCIA:", margin, 205);
  doc.setTextColor(...colors.light);
  doc.text(data.competencia?.nivel || "—", margin + 35, 205);
  doc.setTextColor(...colors.gray);
  doc.text("OPORTUNIDAD:", margin, 214);
  doc.setTextColor(...colors.light);
  const opText = doc.splitTextToSize(data.competencia?.oportunidad || "—", contentW - 40);
  doc.text(opText, margin + 35, 214);

  // Footer portada
  doc.setFontSize(8);
  doc.setTextColor(...colors.gray);
  doc.text("Generado por CAEVIK · caevik.com", margin, 285);

  // ── PÁGINA 2: KEYWORDS ───────────────────────────────────────────────
  addPage();
  doc.setFillColor(...colors.dark);
  doc.rect(0, 0, 210, 297, "F");

  const sectionTitle = (title, color = colors.brand) => {
    checkY(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...color);
    doc.text(title, margin, y);
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 2, margin + doc.getTextWidth(title), y + 2);
    y += 10;
  };

  const pill = (text, x, py, bg, textColor) => {
    const tw = doc.getTextWidth(text);
    drawRect(x, py - 4, tw + 8, 7, 2, bg);
    doc.setTextColor(...textColor);
    doc.setFontSize(8);
    doc.text(text, x + 4, py);
    return tw + 12;
  };

  sectionTitle("Keywords Primarias");
  if (data.keywordsPrimarias?.length) {
    let kx = margin;
    data.keywordsPrimarias.forEach(kw => {
      const tw = doc.getTextWidth(kw) + 8;
      if (kx + tw > pageW - margin) { kx = margin; y += 9; checkY(9); }
      kx += pill(kw, kx, y, [10, 40, 70], colors.brand);
    });
    y += 12;
  }

  sectionTitle("Keywords Long Tail", colors.accent);
  if (data.keywordsLongTail?.length) {
    let kx = margin;
    data.keywordsLongTail.forEach(kw => {
      const tw = doc.getTextWidth(kw) + 8;
      if (kx + tw > pageW - margin) { kx = margin; y += 9; checkY(9); }
      kx += pill(kw, kx, y, [50, 20, 70], colors.accent);
    });
    y += 12;
  }

  // ── ACCIONES INMEDIATAS ───────────────────────────────────────────────
  checkY(20);
  sectionTitle("Acciones Inmediatas", colors.success);
  data.accionesInmediatas?.forEach((accion, i) => {
    checkY(16);
    drawRect(margin, y - 4, 6, 6, 1, colors.success);
    doc.setFontSize(8);
    doc.setTextColor(...colors.gray);
    doc.text(String(i + 1).padStart(2, "0"), margin + 1.5, y);
    doc.setTextColor(...colors.light);
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(accion, contentW - 12);
    doc.text(lines, margin + 10, y);
    y += lines.length * 5 + 4;
  });

  // ── PÁGINA 3+: POSTS ─────────────────────────────────────────────────
  if (data.posts?.length) {
    addPage();
    doc.setFillColor(...colors.dark);
    doc.rect(0, 0, 210, 297, "F");
    sectionTitle("Posts para Redes Sociales", colors.accent);

    data.posts.forEach((post, i) => {
      checkY(40);
      const redColor = post.red === "Instagram" ? colors.accent : colors.brand;
      drawRect(margin, y - 2, contentW, 2, 0, redColor);
      y += 4;

      doc.setFontSize(8);
      doc.setTextColor(...redColor);
      doc.text(`${post.red?.toUpperCase()} · ${post.tipo || ""}`, margin, y);
      doc.setFontSize(8);
      doc.setTextColor(...colors.gray);
      doc.text(`POST ${String(i + 1).padStart(2, "0")}`, pageW - margin - doc.getTextWidth(`POST ${String(i + 1).padStart(2, "0")}`), y);
      y += 6;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.white);
      const titleLines = doc.splitTextToSize(post.titulo || "", contentW);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 5 + 3;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...colors.gray);
      const captionLines = doc.splitTextToSize(post.caption || "", contentW);
      doc.text(captionLines, margin, y);
      y += captionLines.length * 4 + 3;

      if (post.hashtags?.length) {
        doc.setFontSize(7.5);
        doc.setTextColor(56, 189, 248);
        const hashText = post.hashtags.slice(0, 5).join("  ");
        doc.text(hashText, margin, y);
        y += 8;
      }
      y += 3;
    });
  }

  // ── ARTÍCULOS SEO ─────────────────────────────────────────────────────
  if (data.articulosSEO?.length) {
    addPage();
    doc.setFillColor(...colors.dark);
    doc.rect(0, 0, 210, 297, "F");
    sectionTitle("Artículos SEO", colors.success);

    data.articulosSEO.forEach((art, i) => {
      checkY(35);
      doc.setFontSize(8);
      doc.setTextColor(...colors.gray);
      doc.text(`ARTÍCULO ${i + 1} · /${art.slug || ""}`, margin, y);
      y += 5;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.success);
      const artTitle = doc.splitTextToSize(art.titulo || "", contentW);
      doc.text(artTitle, margin, y);
      y += artTitle.length * 5 + 2;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(...colors.gray);
      const meta = doc.splitTextToSize(art.metaDescription || "", contentW);
      doc.text(meta, margin, y);
      y += meta.length * 4 + 3;

      if (art.estructura?.length) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colors.light);
        art.estructura.forEach(h => {
          checkY(6);
          doc.text(`  ${h}`, margin, y);
          y += 5;
        });
      }
      y += 5;
    });
  }

  // ── DIRECTORIOS ───────────────────────────────────────────────────────
  if (data.directorios?.length) {
    addPage();
    doc.setFillColor(...colors.dark);
    doc.rect(0, 0, 210, 297, "F");
    sectionTitle("Directorios Relevantes", colors.warning);

    data.directorios.forEach((dir, i) => {
      checkY(16);
      const prioColor = dir.prioridad === "Alta" ? colors.success : dir.prioridad === "Media" ? colors.warning : colors.gray;
      drawRect(margin, y - 4, contentW, 12, 2, [20, 30, 50]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...colors.white);
      doc.text(dir.nombre || "", margin + 4, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...colors.gray);
      doc.text(dir.url || "", margin + 4, y + 5);
      const prioText = dir.prioridad || "—";
      doc.setFontSize(7.5);
      doc.setTextColor(...prioColor);
      doc.text(prioText, pageW - margin - doc.getTextWidth(prioText) - 4, y + 2);
      y += 16;
    });
  }

  // Footer en todas las páginas
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setTextColor(...colors.gray);
    doc.text(`CAEVIK · caevik.com · Página ${p} de ${totalPages}`, margin, 291);
  }

  // Guardar
  const filename = `caevik-plan-${(url || "sitio").replace(/https?:\/\//, "").replace(/\//g, "")}-${new Date().toISOString().slice(0, 10)}.pdf`;
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
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const d = await res.json();
      if (d.url) window.location.href = d.url;
      else alert("Error al procesar el pago.");
    } catch {
      alert("Error de conexión.");
    }
  };

  const getUpgradeCTA = () => {
    if (!user) {
      return <button onClick={onShowAuth} style={ctaStyle("var(--gradient-brand)")}>Guardar plan gratis →</button>;
    }
    if (!userPlan || userPlan === "free") {
      return <button onClick={() => handleUpgrade("starter")} style={ctaStyle("var(--gradient-brand)")}>Activar Starter $29 →</button>;
    }
    if (userPlan === "starter") {
      return <button onClick={() => handleUpgrade("growth")} style={ctaStyle("var(--gradient-warm)")}>Activar Growth $99 →</button>;
    }
    if (userPlan === "growth") {
      return <button onClick={() => handleUpgrade("agency")} style={ctaStyle("var(--gradient-agency)")}>Activar Agency $299 →</button>;
    }
    return null;
  };

  const ctaStyle = (bg) => ({
    padding: "10px 20px",
    background: bg,
    border: "none",
    borderRadius: "var(--radius-sm)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "var(--text-sm)",
    fontWeight: 700,
    fontFamily: "var(--font-sans)",
  });

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
          {user && (
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", background: "var(--bg-elevated)", padding: "4px 12px", borderRadius: "var(--radius-full)", border: "1px solid var(--bg-border)" }}>
              Plan: {userPlan || "free"}
            </span>
          )}
          {/* Botón exportar PDF */}
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            style={{ padding: "10px 16px", background: "transparent", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-sm)", color: exporting ? "var(--text-disabled)" : "var(--text-secondary)", cursor: exporting ? "not-allowed" : "pointer", fontSize: "var(--text-sm)", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}
          >
            {exporting ? "Exportando..." : "⬇ Exportar PDF"}
          </button>
          <button
            onClick={onReset}
            style={{ padding: "10px 20px", background: "transparent", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)", cursor: "pointer", fontSize: "var(--text-sm)", fontFamily: "var(--font-sans)" }}
          >
            ← Nuevo análisis
          </button>
          {getUpgradeCTA()}
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", gap: "var(--space-1)", marginBottom: "var(--space-8)", background: "var(--bg-elevated)", borderRadius: "var(--radius-lg)", padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: "10px 18px", borderRadius: "var(--radius-sm)", border: "none", fontSize: "var(--text-sm)", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", background: tab === id ? "var(--gradient-brand)" : "transparent", color: tab === id ? "#fff" : "var(--text-muted)" }}>
              {label}
            </button>
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
                <div style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                  Oportunidad: <span style={{ color: "var(--brand-success)" }}>{data.competencia?.oportunidad}</span>
                </div>
              </div>
              <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>⚡ ACCIONES INMEDIATAS</div>
                {data.accionesInmediatas?.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-2)", alignItems: "flex-start" }}>
                    <span style={{ color: "var(--brand-primary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", marginTop: 2, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.5 }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>🔑 KEYWORDS PRIMARIAS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
                {data.keywordsPrimarias?.map(kw => <Tag key={kw} color="#38bdf8">{kw}</Tag>)}
              </div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "var(--space-3)" }}>🎯 LONG TAIL</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                {data.keywordsLongTail?.map(kw => <Tag key={kw} color="#818cf8">{kw}</Tag>)}
              </div>
            </div>

            {!user && (
              <div style={{ background: "linear-gradient(135deg, #38bdf811, #818cf811)", border: "1px solid #38bdf833", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", textAlign: "center", marginTop: "var(--space-6)" }}>
                <div style={{ fontSize: 28, marginBottom: "var(--space-3)" }}>💾</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>Guarda este plan gratis</div>
                <div style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-5)" }}>Crea tu cuenta para guardar resultados y generar más análisis cada mes.</div>
                <button onClick={onShowAuth} style={{ padding: "14px 32px", background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-md)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "var(--text-base)", fontFamily: "var(--font-sans)" }}>
                  Crear cuenta gratis →
                </button>
              </div>
            )}
          </div>
        )}

        {tab === "posts" && (
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            {data.posts?.map((post, i) => (
              <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                  <div style={{ display: "flex", gap: "var(--space-2)" }}>
                    <Tag color={post.red === "Instagram" ? "#e879f9" : "#38bdf8"}>{post.red}</Tag>
                    <Tag color="#64748b">{post.tipo}</Tag>
                  </div>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-disabled)", fontFamily: "var(--font-mono)" }}>POST {String(i + 1).padStart(2, "0")}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: "var(--text-md)", marginBottom: "var(--space-2)" }}>{post.titulo}</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "var(--space-4)", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", padding: "var(--space-4)" }}>{post.caption}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}>
                  {post.hashtags?.map(h => <span key={h} style={{ fontSize: "var(--text-xs)", color: "var(--brand-primary)" }}>{h}</span>)}
                </div>
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
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)", marginBottom: "var(--space-4)" }}>
                  {art.palabrasClave?.map(kw => <Tag key={kw} color="#4ade80">{kw}</Tag>)}
                </div>
                <div style={{ borderTop: "1px solid var(--bg-border)", paddingTop: "var(--space-4)" }}>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-disabled)", marginBottom: "var(--space-2)" }}>ESTRUCTURA DEL ARTÍCULO</div>
                  {art.estructura?.map((h, j) => <div key={j} style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", padding: "5px 0" }}>{h}</div>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "directorios" && (
          <div>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", marginBottom: "var(--space-4)" }}>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-5)" }}>
                Directorios donde tu negocio debe aparecer para generar tráfico orgánico:
              </div>
              <div style={{ display: "grid", gap: "var(--space-3)" }}>
                {data.directorios?.map((dir, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--bg-border)" }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>{dir.nombre}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{dir.url}</div>
                    </div>
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
