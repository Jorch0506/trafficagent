// components/LandingScreen.jsx
// Rediseño Fase 3 — luxury-tech dark, nivel Silicon Valley premium

import { useState, useEffect, useRef } from "react";
import { Header } from "./Header";

// ── Utilidades visuales ───────────────────────────────────────────────────────

function NoiseTexture() {
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", opacity: 0.025, pointerEvents: "none", zIndex: 0 }} xmlns="http://www.w3.org/2000/svg">
      <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
      <rect width="100%" height="100%" filter="url(#noise)"/>
    </svg>
  );
}

function GridLines() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden", opacity: 0.03 }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
    </div>
  );
}

function GradientMesh() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)", top: -200, left: -150, filter: "blur(40px)" }} />
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)", top: "30%", right: -100, filter: "blur(40px)" }} />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,121,249,0.05) 0%, transparent 70%)", bottom: -100, left: "30%", filter: "blur(40px)" }} />
    </div>
  );
}

// ── Componentes UI ────────────────────────────────────────────────────────────

function GlassCard({ children, style = {}, accent = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 16,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "all 0.3s ease",
        boxShadow: hovered
          ? "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function MetricPill({ value, label, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        fontSize: 38,
        letterSpacing: -2,
        background: `linear-gradient(135deg, ${color}, ${color}99)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        lineHeight: 1,
      }}>
        {value}
      </span>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
}

const PLANS = [
  {
    id: "free", name: "Free", price: "$0", period: "",
    color: "#4ade80", gradient: "linear-gradient(135deg, #4ade80, #22d3ee)",
    label: "Empieza aquí",
    features: ["1 análisis / mes", "2 posts listos", "1 directorio", "3 keywords primarias"],
    cta: "Empezar gratis",
  },
  {
    id: "starter", name: "Starter", price: "$29", period: "/mes",
    color: "#38bdf8", gradient: "linear-gradient(135deg, #38bdf8, #818cf8)",
    label: "Para emprendedores",
    features: ["20 análisis / mes", "10 posts listos", "5 artículos SEO", "5 directorios", "Soporte email"],
    cta: "Activar Starter",
  },
  {
    id: "growth", name: "Growth", price: "$99", period: "/mes",
    color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    label: "Para negocios", popular: true,
    features: ["60 análisis / mes", "25 posts listos", "12 artículos SEO", "3 sitios web", "10 keywords primarias"],
    cta: "Activar Growth",
  },
  {
    id: "agency", name: "Agency", price: "$299", period: "/mes",
    color: "#e879f9", gradient: "linear-gradient(135deg, #e879f9, #818cf8)",
    label: "Para agencias",
    features: ["100 análisis / mes", "10 sitios web", "20 directorios", "Manager dedicado", "API próximamente"],
    cta: "Activar Agency",
  },
];

const DELIVERABLES = [
  { n: "25", label: "Posts", sub: "Instagram & Facebook", color: "#38bdf8", icon: "◈" },
  { n: "12", label: "Artículos SEO", sub: "con estructura H2", color: "#4ade80", icon: "◎" },
  { n: "20", label: "Directorios", sub: "relevantes para tu nicho", color: "#f59e0b", icon: "◉" },
  { n: "10", label: "Keywords", sub: "primarias + long tail", color: "#e879f9", icon: "◇" },
];

const NICHES = ["E-commerce", "SaaS", "Health Tech", "Agencias", "Negocios locales", "Consultoría", "Educación", "Fintech"];

// ── Componente principal ──────────────────────────────────────────────────────

export function LandingScreen({ onStart, user, userPlan, onLogout, onShowAuth }) {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [activeNiche, setActiveNiche] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNiche(n => (n + 1) % NICHES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePlanClick = async (planId) => {
    if (planId === "free") { onStart(); return; }
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#03060f", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", position: "relative", overflowX: "hidden" }}>
      <NoiseTexture />
      <GridLines />
      <GradientMesh />

      <Header user={user} userPlan={userPlan} onLogout={onLogout} onStart={onStart} onShowAuth={onShowAuth} />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 48px 80px", position: "relative", zIndex: 10 }}>

        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 999, padding: "6px 16px", marginBottom: 40 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 8px #4ade80" }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: "#94a3b8", textTransform: "uppercase" }}>Beta privada activa</span>
        </div>

        {/* Headline asimétrico */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 60, alignItems: "start" }}>
          <div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(42px, 5.5vw, 76px)",
              lineHeight: 1,
              letterSpacing: -3,
              marginBottom: 28,
            }}>
              <span style={{ display: "block", color: "#f1f5f9" }}>Tu negocio</span>
              <span style={{ display: "block", color: "#f1f5f9" }}>merece</span>
              <span style={{
                display: "block",
                background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #e879f9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                ser encontrado.
              </span>
            </h1>

            <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.8, maxWidth: 500, marginBottom: 44 }}>
              Ingresa tu URL. La IA analiza tu nicho y genera un plan completo de keywords, posts y artículos SEO en 60 segundos.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <button
                onClick={onStart}
                style={{
                  padding: "14px 36px",
                  background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                  border: "none",
                  borderRadius: 10,
                  color: "#03060f",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: 0.3,
                  boxShadow: "0 0 32px rgba(56,189,248,0.3), 0 4px 16px rgba(0,0,0,0.4)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                Generar mi plan →
              </button>
              <span style={{ fontSize: 13, color: "#334155" }}>Gratis · Sin tarjeta · 60 segundos</span>
            </div>
          </div>

          {/* Panel derecho — nicho rotatorio */}
          <GlassCard style={{ padding: 28, marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: "#38bdf8", textTransform: "uppercase", marginBottom: 20 }}>
              Generando plan para
            </div>
            <div style={{ height: 36, overflow: "hidden", position: "relative", marginBottom: 20 }}>
              {NICHES.map((n, i) => (
                <div key={n} style={{
                  position: "absolute",
                  top: 0, left: 0,
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  color: i === activeNiche ? "#f1f5f9" : "transparent",
                  transform: `translateY(${(i - activeNiche) * 36}px)`,
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  pointerEvents: "none",
                }}>
                  {n}
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {DELIVERABLES.slice(0, 4).map(d => (
                <div key={d.label}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: d.color, lineHeight: 1 }}>{d.n}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{d.label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── WHAT YOU GET ──────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 100px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {DELIVERABLES.map((d, i) => (
            <GlassCard key={d.label} style={{ padding: "28px 24px" }}>
              <div style={{ fontSize: 28, marginBottom: 16, color: d.color, fontFamily: "monospace" }}>{d.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, color: d.color, lineHeight: 1, marginBottom: 8 }}>{d.n}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>{d.label}</div>
              <div style={{ fontSize: 11, color: "#334155" }}>{d.sub}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── BETA SOCIAL PROOF ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 100px", position: "relative", zIndex: 10 }}>
        <GlassCard style={{ padding: "56px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 999, padding: "5px 14px", marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: "#4ade80", textTransform: "uppercase" }}>Beta privada activa</span>
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, letterSpacing: -1, marginBottom: 16, lineHeight: 1.2 }}>
              Siendo validado en negocios reales
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.8, marginBottom: 32 }}>
              Actualmente validamos CAEVIK con negocios propios. Los primeros resultados determinarán los casos de éxito que publicaremos aquí.
            </p>
            <button
              onClick={onStart}
              style={{ padding: "12px 28px", background: "transparent", border: "1px solid rgba(56,189,248,0.4)", borderRadius: 8, color: "#38bdf8", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(56,189,248,0.08)"; e.currentTarget.style.borderColor = "rgba(56,189,248,0.7)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(56,189,248,0.4)"; }}
            >
              Unirme a la beta gratis →
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {["E-commerce", "SaaS", "Health Tech", "Negocios locales", "Agencias", "Consultoría"].map((n, i) => (
              <div key={n} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 16px", fontSize: 13, color: "#64748b", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: ["#38bdf8","#4ade80","#f59e0b","#e879f9","#818cf8","#38bdf8"][i], display: "inline-block", flexShrink: 0 }} />
                {n}
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 120px", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 42, letterSpacing: -2, marginBottom: 12 }}>
            Planes que escalan contigo
          </h2>
          <p style={{ fontSize: 15, color: "#475569" }}>Empieza gratis. Escala cuando estés listo.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {PLANS.map(plan => (
            <div
              key={plan.id}
              style={{
                position: "relative",
                background: plan.popular
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(255,255,255,0.02)",
                border: plan.popular
                  ? `1px solid ${plan.color}44`
                  : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "32px 24px",
                backdropFilter: "blur(12px)",
                boxShadow: plan.popular ? `0 0 40px ${plan.color}18` : "none",
                transition: "all 0.3s ease",
              }}
            >
              {plan.popular && (
                <div style={{
                  position: "absolute",
                  top: -1, left: -1, right: -1,
                  height: 3,
                  background: plan.gradient,
                  borderRadius: "16px 16px 0 0",
                }} />
              )}
              {plan.popular && (
                <div style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: plan.gradient,
                  color: "#03060f",
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "3px 12px",
                  borderRadius: 999,
                  letterSpacing: 1.5,
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                }}>
                  Más popular
                </div>
              )}

              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: plan.color, textTransform: "uppercase", marginBottom: 8 }}>{plan.label}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 16 }}>{plan.name}</div>

              <div style={{ marginBottom: 24, display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, background: plan.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{plan.price}</span>
                <span style={{ fontSize: 13, color: "#334155" }}>{plan.period}</span>
              </div>

              <div style={{ marginBottom: 28 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, fontSize: 13, color: "#64748b" }}>
                    <span style={{ color: plan.color, flexShrink: 0, marginTop: 1, fontSize: 11 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePlanClick(plan.id)}
                disabled={loadingPlan === plan.id}
                style={{
                  width: "100%",
                  padding: "11px",
                  background: plan.popular ? plan.gradient : "transparent",
                  border: `1px solid ${plan.popular ? "transparent" : plan.color + "44"}`,
                  borderRadius: 8,
                  color: plan.popular ? "#03060f" : plan.color,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: loadingPlan === plan.id ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  opacity: loadingPlan === plan.id ? 0.7 : 1,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => { if (!plan.popular) e.currentTarget.style.background = plan.color + "10"; }}
                onMouseLeave={e => { if (!plan.popular) e.currentTarget.style.background = "transparent"; }}
              >
                {loadingPlan === plan.id ? "Procesando..." : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 10, flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: -0.5, background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          CAEVIK
        </div>
        <div style={{ fontSize: 12, color: "#1e293b" }}>
          © 2026 CAEVIK · AI Traffic Agent
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacidad", "Términos", "hola@caevik.com"].map(l => (
            <span key={l} style={{ fontSize: 12, color: "#1e293b", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 8px #4ade80} 50%{opacity:0.6;box-shadow:0 0 4px #4ade80} }
      `}</style>
    </div>
  );
}
