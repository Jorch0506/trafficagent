// components/LandingScreen.jsx
// Pantalla principal de la landing — hero, métricas y planes de pricing

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

        <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-12)", marginTop: "var(--space-20)", flexWrap: "wrap" }}>
          {[["10K+", "Sitios analizados"], ["3.2M", "Visitas generadas"], ["89%", "Mejora en SEO"], ["$0", "Para empezar"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, background: "var(--gradient-accent)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{num}</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

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
