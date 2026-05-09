// components/ResultsPanel.jsx
// Panel de resultados con tabs: overview, posts, SEO y directorios

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

export function ResultsPanel({ data, url, onReset, user, userPlan, onShowAuth }) {
  const [tab, setTab] = useState("overview");
  const tabs = [["overview", "📊 Overview"], ["posts", "📱 Posts"], ["seo", "✍️ SEO"], ["directorios", "📂 Directorios"]];

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
    return <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", padding: "10px 20px", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-sm)" }}>Gestionar plan →</span>;
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
