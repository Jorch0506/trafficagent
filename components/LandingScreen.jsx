// components/LandingScreen.jsx
// Optimizado para conversión — lanzamiento

import { useState, useEffect } from "react";
import { Header } from "./Header";

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

function GlassCard({ children, style = {}, className = "" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 16,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "all 0.3s ease",
        boxShadow: hovered ? "0 8px 40px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.2)",
        ...style,
      }}
    >
      {children}
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
    id: "starter", name: "Starter", price: "$699", period: "MXN/mes",
    color: "#38bdf8", gradient: "linear-gradient(135deg, #38bdf8, #818cf8)",
    label: "Para emprendedores",
    features: ["20 análisis / mes", "8 posts listos", "4 artículos SEO", "5 directorios", "Soporte email"],
    cta: "Activar Starter",
  },
  {
    id: "growth", name: "Growth", price: "$1,999", period: "MXN/mes",
    color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    label: "Para negocios", popular: true,
    features: ["60 análisis / mes", "12 posts listos", "6 artículos SEO", "10 directorios", "8 keywords primarias"],
    cta: "Activar Growth",
  },
  {
    id: "agency", name: "Agency", price: "$5,999", period: "MXN/mes",
    color: "#e879f9", gradient: "linear-gradient(135deg, #e879f9, #818cf8)",
    label: "Para agencias",
    features: ["100 análisis / mes", "15 posts listos", "8 artículos SEO", "12 directorios", "Manager dedicado"],
    cta: "Activar Agency",
  },
];

const NICHES = ["E-commerce", "SaaS", "Health Tech", "Agencias", "Negocios locales", "Consultoría", "Educación", "Fintech"];

const STEPS = [
  { n: "01", title: "Ingresa tu URL", desc: "Solo pega la dirección de tu sitio web. Nada más." },
  { n: "02", title: "La IA analiza tu nicho", desc: "Claude analiza tu industria, competencia y oportunidades de tráfico." },
  { n: "03", title: "Descarga tu plan completo", desc: "Keywords, posts listos para publicar, artículos SEO y directorios en 60 segundos." },
];

const FAQ = [
  {
    q: "¿Necesito conocimientos de SEO para usar CAEVIK?",
    a: "No. CAEVIK está diseñado para fundadores, emprendedores y dueños de negocio que no tienen tiempo de aprender SEO. La IA hace todo el trabajo técnico y te entrega el plan listo para ejecutar.",
  },
  {
    q: "¿Qué tan rápido veo resultados?",
    a: "El plan se genera en 60 segundos. Los resultados en tráfico orgánico dependen de qué tan rápido implementes el plan — usuarios que publican el contenido generado en la primera semana reportan mejoras visibles en 30-60 días.",
  },
  {
    q: "¿El contenido está personalizado para mi negocio?",
    a: "Sí. La IA analiza tu sitio web, tu nicho y tu competencia antes de generar el plan. No es contenido genérico — es una estrategia específica para tu negocio.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí. No hay contratos ni permanencia. Cancelas cuando quieras desde tu panel de usuario en menos de 30 segundos.",
  },
  {
    q: "¿En qué idioma se genera el contenido?",
    a: "El plan se genera en español por defecto, optimizado para el mercado hispanohablante. Ideal para negocios en México, España, Colombia, Argentina y toda Latinoamérica.",
  },
];

export function LandingScreen({ onStart, user, userPlan, onLogout, onShowAuth }) {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [activeNiche, setActiveNiche] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setActiveNiche(n => (n + 1) % NICHES.length), 2000);
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

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hero-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 48px 80px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 999, padding: "6px 16px", marginBottom: 40 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 8px #4ade80", animation: "pulse 2s infinite", flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: "#94a3b8", textTransform: "uppercase" }}>Beta privada activa — acceso gratuito hoy</span>
        </div>

        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 60, alignItems: "start" }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(34px, 7vw, 72px)", lineHeight: 1.08, letterSpacing: "clamp(-1px, -0.04em, -3px)", marginBottom: 28, wordBreak: "break-word", overflowWrap: "break-word" }}>
              <span style={{ display: "block", color: "#f1f5f9" }}>Tráfico orgánico</span>
              <span style={{ display: "block", color: "#f1f5f9" }}>para tu negocio</span>
              <span style={{ display: "block", background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #e879f9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>en 60 segundos.</span>
            </h1>
            <p style={{ fontSize: "clamp(14px, 2.5vw, 17px)", color: "#64748b", lineHeight: 1.8, maxWidth: 520, marginBottom: 16 }}>
              Ingresa la URL de tu negocio y nuestra IA genera un plan completo de <strong style={{ color: "#94a3b8" }}>keywords, posts para redes sociales y artículos SEO</strong> listos para publicar.
            </p>
            <div style={{ display: "flex", gap: 20, marginBottom: 40, flexWrap: "wrap" }}>
              {["✓ Sin conocimientos técnicos", "✓ En español", "✓ Listo para publicar"].map(t => (
                <span key={t} style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={onStart} style={{ padding: "16px 40px", background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", borderRadius: 10, color: "#03060f", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3, boxShadow: "0 0 32px rgba(56,189,248,0.3), 0 4px 16px rgba(0,0,0,0.4)", transition: "all 0.2s ease", whiteSpace: "nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 48px rgba(56,189,248,0.4), 0 8px 24px rgba(0,0,0,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 32px rgba(56,189,248,0.3), 0 4px 16px rgba(0,0,0,0.4)"; }}>
                Generar mi plan gratis →
              </button>
              <span style={{ fontSize: 13, color: "#334155" }}>Sin tarjeta · 60 segundos</span>
            </div>
          </div>

          {/* Panel hero — números actualizados */}
          <GlassCard className="hero-panel" style={{ padding: 28, marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: "#38bdf8", textTransform: "uppercase", marginBottom: 20 }}>Generando plan para</div>
            <div style={{ height: 36, overflow: "hidden", position: "relative", marginBottom: 20 }}>
              {NICHES.map((n, i) => (
                <div key={n} style={{ position: "absolute", top: 0, left: 0, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: i === activeNiche ? "#f1f5f9" : "transparent", transform: `translateY(${(i - activeNiche) * 36}px)`, transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", pointerEvents: "none" }}>{n}</div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { n: "15", label: "Posts sociales", color: "#38bdf8" },
                { n: "8",  label: "Artículos SEO",  color: "#4ade80" },
                { n: "12", label: "Directorios",    color: "#f59e0b" },
                { n: "10", label: "Keywords",       color: "#e879f9" },
              ].map(d => (
                <div key={d.label}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: d.color, lineHeight: 1 }}>{d.n}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>{d.label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 100px", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 className="section-h2" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 5vw, 38px)", letterSpacing: "clamp(-0.5px, -0.03em, -1.5px)", marginBottom: 12, wordBreak: "break-word" }}>Así de simple</h2>
          <p style={{ fontSize: 15, color: "#475569" }}>Sin configuración. Sin curva de aprendizaje.</p>
        </div>
        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {STEPS.map((s, i) => (
            <GlassCard key={s.n} style={{ padding: "36px 28px", position: "relative" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 48, color: "rgba(56,189,248,0.12)", lineHeight: 1, marginBottom: 20, letterSpacing: -2 }}>{s.n}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 10, color: "#f1f5f9" }}>{s.title}</div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{s.desc}</div>
              {i < 2 && <div className="steps-arrow" style={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", color: "#1e293b", fontSize: 20, zIndex: 2 }}>→</div>}
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── QUÉ INCLUYE EL PLAN ───────────────────────────────────────────── */}
      <section className="section-pad" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 100px", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 className="section-h2" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(22px, 4.5vw, 38px)", letterSpacing: "clamp(-0.5px, -0.03em, -1.5px)", marginBottom: 12, wordBreak: "break-word", overflowWrap: "break-word" }}>Un plan completo, listo para publicar</h2>
          <p style={{ fontSize: 15, color: "#475569" }}>No es solo información — es contenido listo para copiar y publicar hoy.</p>
        </div>
        <div className="includes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {[
            { icon: "📱", title: "Posts para Instagram y Facebook", desc: "Hasta 15 posts con caption completo, hashtags optimizados y tipo de contenido (educativo, testimonial, viral). Solo copia y publica.", color: "#38bdf8" },
            { icon: "✍️", title: "Artículos de blog SEO", desc: "Hasta 8 artículos con título, meta descripción, estructura H2 y palabras clave integradas. Diseñados para posicionar en Google.", color: "#4ade80" },
            { icon: "🔑", title: "Keywords primarias y long tail", desc: "Las palabras clave exactas que buscan tus clientes. Primarias para autoridad, long tail para tráfico rápido.", color: "#e879f9" },
            { icon: "📍", title: "Directorios donde registrarte", desc: "Hasta 12 directorios relevantes para tu nicho con prioridad alta, media o baja. Backlinks gratis para tu sitio.", color: "#f59e0b" },
          ].map(item => (
            <GlassCard key={item.title} style={{ padding: "32px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ fontSize: 32, flexShrink: 0, lineHeight: 1 }}>{item.icon}</div>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(13px, 2vw, 16px)", marginBottom: 8, color: item.color }}>{item.title}</div>
                <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── PARA QUIÉN ES ────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 100px", position: "relative", zIndex: 10 }}>
        <GlassCard style={{ padding: "56px 64px" }} className="glass-who">
          <div className="who-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(24px, 4vw, 34px)", letterSpacing: "clamp(-0.5px, -0.02em, -1px)", marginBottom: 20, lineHeight: 1.2, wordBreak: "break-word" }}>
                ¿Para quién es CAEVIK?
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: "🏪", text: "Dueños de negocio que quieren más clientes sin depender de publicidad pagada" },
                  { icon: "🚀", text: "Fundadores de startups que necesitan visibilidad orgánica desde el día 1" },
                  { icon: "📱", text: "Emprendedores que no saben qué publicar en redes sociales" },
                  { icon: "🏢", text: "Agencias que manejan múltiples clientes y necesitan escalar" },
                ].map(item => (
                  <div key={item.text} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#475569", marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" }}>Funciona para cualquier nicho</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {NICHES.map((n) => (
                  <span key={n} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#64748b", fontWeight: 500 }}>{n}</span>
                ))}
              </div>
              <div style={{ marginTop: 24 }}>
                <button onClick={onStart} style={{ padding: "13px 28px", background: "transparent", border: "1px solid rgba(56,189,248,0.4)", borderRadius: 8, color: "#38bdf8", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(56,189,248,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  Probar con mi negocio gratis →
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="section-pad" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 100px", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 className="section-h2" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 5vw, 38px)", letterSpacing: "clamp(-0.5px, -0.03em, -1.5px)", marginBottom: 12, wordBreak: "break-word" }}>Planes que escalan contigo</h2>
          <p style={{ fontSize: 15, color: "#475569" }}>Empieza gratis. Escala cuando estés listo. Cancela cuando quieras.</p>
        </div>
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{ position: "relative", background: plan.popular ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)", border: plan.popular ? `1px solid ${plan.color}44` : "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "32px 24px", backdropFilter: "blur(12px)", boxShadow: plan.popular ? `0 0 40px ${plan.color}18` : "none" }}>
              {plan.popular && (
                <>
                  <div style={{ position: "absolute", top: -1, left: -1, right: -1, height: 3, background: plan.gradient, borderRadius: "16px 16px 0 0" }} />
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: plan.gradient, color: "#03060f", fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 999, letterSpacing: 1.5, whiteSpace: "nowrap", textTransform: "uppercase" }}>Más popular</div>
                </>
              )}
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: plan.color, textTransform: "uppercase", marginBottom: 8 }}>{plan.label}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 16 }}>{plan.name}</div>
              <div style={{ marginBottom: 24, display: "flex", alignItems: "baseline", gap: 4, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, background: plan.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{plan.price}</span>
                <span style={{ fontSize: 12, color: "#334155", lineHeight: 1.3 }}>{plan.period}</span>
              </div>
              <div style={{ marginBottom: 28 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, fontSize: 13, color: "#64748b" }}>
                    <span style={{ color: plan.color, flexShrink: 0, marginTop: 1, fontSize: 11 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <button onClick={() => handlePlanClick(plan.id)} disabled={loadingPlan === plan.id}
                style={{ width: "100%", padding: "11px", background: plan.popular ? plan.gradient : "transparent", border: `1px solid ${plan.popular ? "transparent" : plan.color + "44"}`, borderRadius: 8, color: plan.popular ? "#03060f" : plan.color, fontWeight: 700, fontSize: 13, cursor: loadingPlan === plan.id ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: loadingPlan === plan.id ? 0.7 : 1, transition: "all 0.2s ease" }}
                onMouseEnter={e => { if (!plan.popular) e.currentTarget.style.background = plan.color + "10"; }}
                onMouseLeave={e => { if (!plan.popular) e.currentTarget.style.background = "transparent"; }}>
                {loadingPlan === plan.id ? "Procesando..." : plan.cta}
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <span style={{ fontSize: 13, color: "#334155" }}>🔒 Sin contratos · Cancela en cualquier momento · Pago seguro con Stripe</span>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ maxWidth: 720, margin: "0 auto", padding: "0 48px 100px", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="section-h2" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 5vw, 38px)", letterSpacing: "clamp(-0.5px, -0.03em, -1.5px)", marginBottom: 12, wordBreak: "break-word" }}>Preguntas frecuentes</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQ.map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden", transition: "all 0.2s ease" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "20px 24px", background: "transparent", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
                <span style={{ fontSize: "clamp(13px, 2vw, 15px)", fontWeight: 600, color: "#e2e8f0" }}>{item.q}</span>
                <span style={{ color: "#38bdf8", fontSize: 20, flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s ease" }}>+</span>
              </button>
              {openFaq === i && <div style={{ padding: "0 24px 20px", fontSize: 14, color: "#64748b", lineHeight: 1.8 }}>{item.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 120px", position: "relative", zIndex: 10 }}>
        <div className="cta-section" style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.06), rgba(129,140,248,0.06))", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 24, padding: "80px 64px", textAlign: "center", overflow: "hidden" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 5.5vw, 44px)", letterSpacing: "clamp(-0.5px, -0.03em, -2px)", marginBottom: 16, lineHeight: 1.1, wordBreak: "break-word", overflowWrap: "break-word" }}>
            Tu competencia ya<br />está generando tráfico.
          </h2>
          <p style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "#64748b", marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
            Genera tu primer plan de tráfico orgánico ahora mismo. Gratis. Sin tarjeta. En 60 segundos.
          </p>
          <button onClick={onStart} style={{ padding: "18px 48px", background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", borderRadius: 12, color: "#03060f", fontWeight: 800, fontSize: "clamp(14px, 2.5vw, 17px)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 0 48px rgba(56,189,248,0.3)", transition: "all 0.2s ease" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 64px rgba(56,189,248,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 48px rgba(56,189,248,0.3)"; }}>
            Generar mi plan gratis →
          </button>
          <div style={{ marginTop: 20, fontSize: 13, color: "#334155" }}>Sin tarjeta · 60 segundos · Cancela cuando quieras</div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 10, flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: -0.5, background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CAEVIK</div>
        <div style={{ fontSize: 12, color: "#1e293b" }}>© 2026 CAEVIK · AI Traffic Agent</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacidad", "Términos", "hola@caevik.com"].map(l => (
            <span key={l} style={{ fontSize: 12, color: "#1e293b", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 8px #4ade80} 50%{opacity:0.6;box-shadow:0 0 4px #4ade80} }
        *, *::before, *::after { box-sizing: border-box; }
        @media (max-width: 768px) {
          .hero-section { padding-top: 60px !important; padding-bottom: 48px !important; padding-left: 20px !important; padding-right: 20px !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hero-panel { display: none !important; }
          .section-pad { padding-left: 20px !important; padding-right: 20px !important; }
          nav { padding: 16px 20px !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .steps-arrow { display: none !important; }
          .includes-grid { grid-template-columns: 1fr !important; }
          .who-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .glass-who { padding: 28px 20px !important; }
          .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .cta-section { padding: 40px 24px !important; border-radius: 16px !important; }
          footer { padding: 24px 20px !important; flex-direction: column !important; text-align: center !important; gap: 12px !important; }
        }
        @media (max-width: 420px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
