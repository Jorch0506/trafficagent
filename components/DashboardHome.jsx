// components/DashboardHome.jsx
// Pantalla de bienvenida para usuarios logueados
// Muestra plan activo, uso del mes y acceso directo al generador

import { useState, useEffect } from "react";
import { supabase } from "../hooks/useAuth";
import { LogoSVG } from "./LogoSVG";

function GlowOrb({ x, y, color = "#38bdf8", size = 300, opacity = 0.12 }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, opacity, filter: `blur(${size * 0.4}px)`, pointerEvents: "none", zIndex: 0 }} />
  );
}

const PLAN_COLORS = {
  free:    "#4ade80",
  starter: "#38bdf8",
  growth:  "#f59e0b",
  agency:  "#e879f9",
};

const PLAN_LIMITS = {
  free:    1,
  starter: 20,
  growth:  60,
  agency:  100,
};

export function DashboardHome({ user, userPlan, onStart, onLogout, onShowAuth }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      const { data } = await supabase
        .from("users")
        .select("plan, analyses_used, analyses_limit, subscription_status, email")
        .eq("id", user.id)
        .single();
      setUserData(data);
      setLoading(false);
    };
    fetchData();
  }, [user?.id]);

  const plan = userData?.plan || userPlan || "free";
  const planColor = PLAN_COLORS[plan] || "#38bdf8";
  const used = userData?.analyses_used || 0;
  const limit = userData?.analyses_limit || PLAN_LIMITS[plan] || 1;
  const usagePercent = Math.min((used / limit) * 100, 100);
  const isNearLimit = usagePercent >= 80;
  const isAtLimit = used >= limit;

  const firstName = user?.email?.split("@")[0] || "ahí";

  const getNextPlan = () => {
    if (plan === "free") return { id: "starter", name: "Starter", price: "$29" };
    if (plan === "starter") return { id: "growth", name: "Growth", price: "$99" };
    if (plan === "growth") return { id: "agency", name: "Agency", price: "$299" };
    return null;
  };

  const nextPlan = getNextPlan();

  const handleUpgrade = async (planId) => {
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
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", fontFamily: "var(--font-sans)", position: "relative", overflow: "hidden" }}>
      <GlowOrb x="-100px" y="-100px" color={planColor} size={500} opacity={0.06} />
      <GlowOrb x="70%" y="60%" color="var(--brand-secondary)" size={400} opacity={0.04} />

      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 48px", borderBottom: "1px solid #ffffff08", position: "relative", zIndex: 10, flexWrap: "wrap", gap: "var(--space-3)" }}>
        <LogoSVG id="dash-logo" width={200} height={52} />
        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{user?.email}</span>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: planColor, background: planColor + "18", padding: "4px 12px", borderRadius: "var(--radius-full)", border: `1px solid ${planColor}33`, textTransform: "uppercase", letterSpacing: 1 }}>
            {plan}
          </span>
          <button
            onClick={onLogout}
            style={{ background: "transparent", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", fontSize: "var(--text-sm)", padding: "8px 16px", cursor: "pointer", fontFamily: "var(--font-sans)" }}
          >
            Salir
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 48px", position: "relative", zIndex: 10 }}>

        {/* Saludo */}
        <div style={{ marginBottom: "var(--space-10)" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-3xl)", letterSpacing: -1, marginBottom: "var(--space-2)" }}>
            Hola, {firstName} 👋
          </h1>
          <p style={{ fontSize: "var(--text-base)", color: "var(--text-muted)" }}>
            Bienvenido a tu panel de CAEVIK. Genera un plan de tráfico para tu negocio.
          </p>
        </div>

        {/* Cards de estado */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>

          {/* Card de uso */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-6)" }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: "var(--space-4)" }}>
              Uso este mes
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-1)", marginBottom: "var(--space-3)" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-3xl)", color: isAtLimit ? "var(--brand-danger)" : isNearLimit ? "var(--brand-warning)" : planColor }}>
                {loading ? "—" : used}
              </span>
              <span style={{ fontSize: "var(--text-base)", color: "var(--text-muted)" }}>/ {limit} análisis</span>
            </div>
            {/* Barra de progreso */}
            <div style={{ height: 6, background: "var(--bg-border)", borderRadius: "var(--radius-full)", overflow: "hidden", marginBottom: "var(--space-2)" }}>
              <div style={{ height: "100%", width: `${usagePercent}%`, borderRadius: "var(--radius-full)", background: isAtLimit ? "var(--brand-danger)" : isNearLimit ? "var(--brand-warning)" : planColor, transition: "width var(--transition-slow)" }} />
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-disabled)" }}>
              {isAtLimit
                ? "Límite alcanzado — haz upgrade para continuar"
                : isNearLimit
                ? `Solo te quedan ${limit - used} análisis este mes`
                : `${limit - used} análisis disponibles`}
            </div>
          </div>

          {/* Card de plan */}
          <div style={{ background: `linear-gradient(135deg, ${planColor}12, var(--bg-surface))`, border: `1px solid ${planColor}30`, borderRadius: "var(--radius-xl)", padding: "var(--space-6)" }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: "var(--space-4)" }}>
              Tu plan actual
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", color: planColor, marginBottom: "var(--space-2)", textTransform: "capitalize" }}>
              {plan}
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
              {plan === "free" && "1 análisis al mes · 2 posts · 1 directorio"}
              {plan === "starter" && "20 análisis · 10 posts · 5 directorios"}
              {plan === "growth" && "60 análisis · 25 posts · 3 sitios web"}
              {plan === "agency" && "100 análisis · 10 sitios web · Manager dedicado"}
            </div>
            {nextPlan && (
              <button
                onClick={() => handleUpgrade(nextPlan.id)}
                style={{ width: "100%", padding: "10px", background: "transparent", border: `1px solid ${planColor}`, borderRadius: "var(--radius-sm)", color: planColor, fontWeight: 700, fontSize: "var(--text-sm)", cursor: "pointer", fontFamily: "var(--font-sans)" }}
              >
                Activar {nextPlan.name} {nextPlan.price}/mes →
              </button>
            )}
            {!nextPlan && (
              <div style={{ fontSize: "var(--text-sm)", color: planColor, fontWeight: 600 }}>
                ✓ Plan máximo activado
              </div>
            )}
          </div>

        </div>

        {/* CTA principal */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-8)", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: "var(--space-4)" }}>⚡</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", marginBottom: "var(--space-2)", letterSpacing: -1 }}>
            {isAtLimit ? "Límite del mes alcanzado" : "¿Listo para generar tu plan?"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-base)", marginBottom: "var(--space-6)", maxWidth: 480, margin: "0 auto var(--space-6)" }}>
            {isAtLimit
              ? `Has usado tus ${limit} análisis de este mes. Haz upgrade para continuar generando planes.`
              : "Ingresa la URL de tu negocio y nuestra IA genera tu plan de tráfico completo en 60 segundos."}
          </p>
          {isAtLimit && nextPlan ? (
            <button
              onClick={() => handleUpgrade(nextPlan.id)}
              style={{ padding: "16px 48px", background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-lg)", color: "#fff", fontWeight: 700, fontSize: "var(--text-lg)", cursor: "pointer", fontFamily: "var(--font-sans)" }}
            >
              Activar {nextPlan.name} {nextPlan.price}/mes →
            </button>
          ) : (
            <button
              onClick={onStart}
              disabled={isAtLimit}
              style={{ padding: "16px 48px", background: isAtLimit ? "var(--bg-border)" : "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-lg)", color: isAtLimit ? "var(--text-disabled)" : "#fff", fontWeight: 700, fontSize: "var(--text-lg)", cursor: isAtLimit ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)", boxShadow: isAtLimit ? "none" : "0 0 40px #38bdf844" }}
            >
              Nuevo análisis →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
