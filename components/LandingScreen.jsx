// components/LandingScreen.jsx
// Pantalla principal de la landing — hero, beta social proof y planes de pricing

import { useState } from "react";
import { LogoSVG } from "./LogoSVG";
import { Header } from "./Header";

function GlowOrb({ x, y, color = "#38bdf8", size = 300, opacity = 0.12 }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, opacity, filter: `blur(${size * 0.4}px)`, pointerEvents: "none", zIndex: 0 }} />
  );
}

function Tag({ children, color = "#38bdf8" }) {
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: "var(--radius-sm)", padding: "2px 10px", fontSize: "var(--text-xs)", fontWeight: 600, fontFamily: "var(--font-mono)", letterSpacing: 1, display: "inline-block" }}>
      {children}
    </span>
  );
}

const PLANS = [
  { id: "free", name: "Free", price: "$0", period: " USD", color: "#4ade80",
    features: ["1 análisis/mes", "2 posts listos", "1 directorio", "3 keywords primarias", "1 keyword long tail"],
    cta: "Empezar gratis", limit: "Starter pack" },
  { id: "starter", name: "Starter", price: "$29", period: " USD/mes", color: "#38bdf8",
    features: ["20 análisis/mes", "10 posts listos", "5 directorios", "5 keywords primarias", "3 keywords long tail", "Soporte email"],
    cta: "Activar Starter", limit: "Para emprendedores" },
  { id: "growth", name: "Growth", price: "$99", period: " USD/mes", color: "#f59e0b",
    features: ["60 análisis/mes", "25 posts listos", "15 directorios", "3 sitios web", "10 keywords primarias", "Soporte prioritario"],
    cta: "Activar Growth", limit: "Para negocios", popular: true },
  { id: "agency", name: "Agency", price: "$299", period: " USD/mes", color: "#e879f9",
    features: ["100 análisis/mes", "25 posts listos", "20 directorios", "10 sitios web", "Manager dedicado", "API access — próximamente"],
    cta: "Activar Agency", limit: "Para agencias" },
];

// Tipos de negocio que ya están siendo validados
const BUSINESS_TYPES = [
  { icon: "🛒", label: "E-commerce" },
  { icon: "💻", label: "SaaS" },
  { icon: "🏥", label: "Health Tech" },
  { icon: "🏪", label: "Negocios locales" },
  { icon: "📣", label: "Agencias" },
  { icon: "🎯", label: "Consultoría" },
];

// Qué genera el plan en números concretos
const WHAT_YOU_GET = [
  { color: "#38bdf8", num: "25",  label: "Posts listos",        sub: "para Instagram y Facebook" },
  { color: "#4ade80", num: "12",  label: "Artículos SEO",       sub: "con estructura completa"   },
  { color: "#f59e0b", num: "20",  label: "Directorios",         sub: "donde debes aparecer"      },
  { color: "#e879f9", num: "10",  label: "Keywords primarias",  sub: "reales para tu nicho"      },
];

export function LandingScreen({ onStart, user, userPlan, onLogout, onShowAuth }) {
  const [loadingPlan, setLoadingPlan] = useState(null);

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
      else alert("Error al procesar el pago. Intenta de nuevo.");
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", fontFamily: "var(--font-sans)", overflow: "hidden", position: "relative" }}>
      <GlowOrb x="-100px" y="-100px" color="var(--brand-primary)" size={500} opacity={0.08} />
      <GlowOrb x="60%" y="20%" color="var(--brand-accent)" size={400} opacity={0.06} />
      <GlowOrb x="20%" y="70%" color="var(--brand-success)" size={300} opacity={0.07} />

      <Header
        user={user}
        userPlan={userPlan}
        onLogout={onLogout}
        onStart={onStart}
        onShowAuth={onShowAuth}
      />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 48px 60px", textAlign: "center", position: "relative", zIndex: 10 }}>
        <div style={{ display: "inline-flex", gap: "var(--space-2)", marginBottom: "var(--space-6)", flexWrap: "wrap", justifyContent: "center" }}>
          <Tag color="#4ade80">IA-Powered</Tag>
          <Tag color="#38bdf8">SEO Automático</Tag>
          <Tag color="#e879f9">100% Orgánico</Tag>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1.05, letterSpacing: -2, marginBottom: "var(--space-6)", background: "linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Tu negocio merece<br />
          <span style={{ background: "linear-gradient(135deg, #38bdf8, #e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ser encontrado.</span>
        </h1>
        <p style={{ fontSize: "var(--text-lg)", color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
          Ingresa tu sitio web. Nuestra IA analiza tu nicho, genera contenido SEO, crea posts para redes sociales y te posiciona donde está tu cliente.
        </p>
        <button
          onClick={onStart}
          style={{ background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-lg)", color: "#fff", fontWeight: 700, fontSize: "var(--text-lg)", padding: "18px 48px", cursor: "pointer", boxShadow: "0 0 40px #38bdf844", fontFamily: "var(--font-sans)" }}
        >
          Generar mi plan de tráfico →
        </button>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--text-disabled)", marginTop: "var(--space-4)" }}>
          Gratis. Sin tarjeta. En 60 segundos.
        </p>
      </div>

      {/* ── QUÉ GENERA EL PLAN ───────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 48px 80px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)" }}>
          {WHAT_YOU_GET.map(({ color, num, label, sub }) => (
            <div key={label} style={{ background: "var(--bg-surface)", border: `1px solid ${color}22`, borderRadius: "var(--radius-lg)", padding: "var(--space-5)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, color, lineHeight: 1, marginBottom: "var(--space-2)" }}>{num}</div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BETA SOCIAL PROOF ────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 48px 80px", position: "relative", zIndex: 10 }}>
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-8)", textAlign: "center" }}>

          {/* Badge beta */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: "var(--radius-full)", padding: "6px 16px", marginBottom: "var(--space-5)" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--brand-primary)", letterSpacing: 1, textTransform: "uppercase" }}>Beta privada activa</span>
          </div>

          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", marginBottom: "var(--space-3)", letterSpacing: -0.5 }}>
            Siendo validado en negocios reales
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-base)", marginBottom: "var(--space-8)", maxWidth: 480, margin: "0 auto var(--space-8)" }}>
            Actualmente validamos CAEVIK con negocios propios antes de abrir al público. Los primeros resultados determinarán los casos de éxito que publicaremos aquí.
          </p>

          {/* Tipos de negocio */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "var(--space-3)", marginBottom: "var(--space-8)" }}>
            {BUSINESS_TYPES.map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-full)", padding: "8px 16px", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ borderTop: "1px solid var(--bg-border)", paddingTop: "var(--space-6)" }}>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
              Sé de los primeros en usar CAEVIK. El plan Free es permanentemente gratuito.
            </p>
            <button
              onClick={onStart}
              style={{ padding: "12px 32px", background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-md)", color: "#fff", fontWeight: 700, fontSize: "var(--text-base)", cursor: "pointer", fontFamily: "var(--font-sans)" }}
            >
              Unirme a la beta gratis →
            </button>
          </div>

        </div>
      </div>

      {/* ── PLANES ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 80px", position: "relative", zIndex: 10 }}>
        <h2 style={{ textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-3xl)", marginBottom: "var(--space-12)", letterSpacing: -1 }}>
          Planes que escalan contigo
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-4)" }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{ background: plan.popular ? `linear-gradient(135deg, ${plan.color}15, var(--bg-elevated))` : "var(--bg-elevated)", border: `1px solid ${plan.popular ? plan.color + "55" : "#ffffff10"}`, borderRadius: "var(--radius-lg)", padding: "28px 24px", position: "relative", boxShadow: plan.popular ? `0 0 30px ${plan.color}22` : "none" }}>
              {plan.popular && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: plan.color, color: "#000", fontSize: "var(--text-xs)", fontWeight: 800, padding: "4px 14px", borderRadius: "var(--radius-full)", letterSpacing: 1, whiteSpace: "nowrap" }}>
                  MÁS POPULAR
                </div>
              )}
              <div style={{ fontSize: "var(--text-sm)", color: plan.color, fontWeight: 600, marginBottom: "var(--space-2)" }}>{plan.limit}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-xl)", marginBottom: "var(--space-1)" }}>{plan.name}</div>
              <div style={{ marginBottom: "var(--space-5)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 700, color: plan.color }}>{plan.price}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>{plan.period}</span>
              </div>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", marginBottom: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                  <span style={{ color: plan.color }}>✓</span> {f}
                </div>
              ))}
              <button
                onClick={() => handlePlanClick(plan.id)}
                disabled={loadingPlan === plan.id}
                style={{ marginTop: "var(--space-5)", width: "100%", padding: "12px", background: plan.popular ? plan.color : "transparent", border: `1px solid ${plan.color}`, borderRadius: "var(--radius-sm)", color: plan.popular ? "#000" : plan.color, fontWeight: 700, fontSize: "var(--text-sm)", cursor: "pointer", fontFamily: "var(--font-sans)", opacity: loadingPlan === plan.id ? 0.7 : 1 }}
              >
                {loadingPlan === plan.id ? "Procesando..." : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
