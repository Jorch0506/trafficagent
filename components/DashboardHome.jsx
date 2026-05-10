// components/DashboardHome.jsx
// Rediseño Fase 3 — dashboard premium consistente con la landing

import { useState, useEffect } from "react";
import { supabase } from "../hooks/useAuth";
import { SitesManager } from "./SitesManager";

function GlassCard({ children, style = {}, accent, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${accent ? `${accent}33` : hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 16,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "all 0.25s ease",
        boxShadow: hovered
          ? `0 8px 40px rgba(0,0,0,0.4)${accent ? `, 0 0 30px ${accent}15` : ""}`
          : "0 4px 20px rgba(0,0,0,0.2)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function GradientMesh() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)", top: -200, left: -100, filter: "blur(40px)" }} />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)", bottom: 0, right: 0, filter: "blur(40px)" }} />
    </div>
  );
}

const PLAN_COLORS = { free: "#4ade80", starter: "#38bdf8", growth: "#f59e0b", agency: "#e879f9" };
const PLAN_GRADIENTS = {
  free:    "linear-gradient(135deg, #4ade80, #22d3ee)",
  starter: "linear-gradient(135deg, #38bdf8, #818cf8)",
  growth:  "linear-gradient(135deg, #f59e0b, #ef4444)",
  agency:  "linear-gradient(135deg, #e879f9, #818cf8)",
};
const PLAN_FEATURES = {
  free:    "1 análisis · 2 posts · 1 directorio",
  starter: "20 análisis · 10 posts · 5 directorios",
  growth:  "60 análisis · 25 posts · 3 sitios web",
  agency:  "100 análisis · 10 sitios · Manager dedicado",
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "hace un momento";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

function getFavicon(url) {
  try {
    const domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch { return null; }
}

export function DashboardHome({ user, userData, onStart, onLogout, onViewPlan, onAnalyzeSite }) {
  const [analyses, setAnalyses] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const plan = userData?.plan || "free";
  const planColor = PLAN_COLORS[plan] || "#38bdf8";
  const planGradient = PLAN_GRADIENTS[plan] || PLAN_GRADIENTS.free;
  const used = userData?.analyses_used ?? 0;
  const limit = userData?.analyses_limit ?? 1;
  const usagePct = Math.min((used / limit) * 100, 100);
  const isNear = usagePct >= 80;
  const isAt = used >= limit;
  const firstName = user?.email?.split("@")[0] || "ahí";

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("analyses")
      .select("id, site_url, created_at, plan_data")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => { setAnalyses(data || []); setLoadingHistory(false); });
  }, [user?.id]);

  const getNextPlan = () => {
    if (plan === "free")    return { id: "starter", name: "Starter", price: "$29" };
    if (plan === "starter") return { id: "growth",  name: "Growth",  price: "$99" };
    if (plan === "growth")  return { id: "agency",  name: "Agency",  price: "$299" };
    return null;
  };
  const nextPlan = getNextPlan();

  const handleUpgrade = async (planId) => {
    const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: planId }) });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  if (!userData) {
    return (
      <div style={{ minHeight: "100vh", background: "#03060f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 13, color: "#334155", letterSpacing: 1 }}>Cargando tu panel...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#03060f", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
      <GradientMesh />

      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.04)", position: "relative", zIndex: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: -0.5, background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          CAEVIK
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#334155" }}>{user?.email}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
            color: planColor,
            background: `${planColor}12`,
            border: `1px solid ${planColor}30`,
            padding: "4px 12px", borderRadius: 999,
            textTransform: "uppercase",
          }}>
            {plan}
          </span>
          <button
            onClick={onLogout}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, color: "#334155", fontSize: 12, padding: "7px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#64748b"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#334155"; }}
          >
            Salir
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "52px 48px 80px", position: "relative", zIndex: 10 }}>

        {/* Saludo */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, letterSpacing: -1.5, marginBottom: 6 }}>
            Hola, {firstName} 👋
          </h1>
          <p style={{ fontSize: 14, color: "#334155" }}>Bienvenido a tu panel de CAEVIK.</p>
        </div>

        {/* Cards de estado + CTA en grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>

          {/* Uso */}
          <GlassCard accent={isAt ? "#f87171" : isNear ? "#f59e0b" : planColor} style={{ padding: "28px 24px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#334155", textTransform: "uppercase", marginBottom: 20 }}>Uso este mes</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 16 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 42, letterSpacing: -2, color: isAt ? "#f87171" : isNear ? "#f59e0b" : planColor, lineHeight: 1 }}>{used}</span>
              <span style={{ fontSize: 14, color: "#334155" }}>/ {limit}</span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ height: "100%", width: `${usagePct}%`, background: isAt ? "#f87171" : isNear ? "#f59e0b" : planGradient, borderRadius: 999, transition: "width 0.6s ease" }} />
            </div>
            <div style={{ fontSize: 11, color: "#334155" }}>
              {isAt ? "Límite alcanzado" : `${limit - used} análisis disponibles`}
            </div>
          </GlassCard>

          {/* Plan */}
          <GlassCard accent={planColor} style={{ padding: "28px 24px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#334155", textTransform: "uppercase", marginBottom: 20 }}>Tu plan</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, background: planGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8, textTransform: "capitalize" }}>{plan}</div>
            <div style={{ fontSize: 11, color: "#334155", marginBottom: 20, lineHeight: 1.6 }}>{PLAN_FEATURES[plan]}</div>
            {nextPlan ? (
              <button
                onClick={() => handleUpgrade(nextPlan.id)}
                style={{ fontSize: 11, fontWeight: 700, color: planColor, background: `${planColor}10`, border: `1px solid ${planColor}30`, borderRadius: 6, padding: "7px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = `${planColor}18`}
                onMouseLeave={e => e.currentTarget.style.background = `${planColor}10`}
              >
                → {nextPlan.name} {nextPlan.price}/mes
              </button>
            ) : (
              <div style={{ fontSize: 11, color: planColor, fontWeight: 600 }}>✓ Plan máximo</div>
            )}
          </GlassCard>

          {/* CTA */}
          <GlassCard style={{ padding: "28px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#334155", textTransform: "uppercase", marginBottom: 20 }}>Nuevo análisis</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 8, lineHeight: 1.2, color: "#94a3b8" }}>
                {isAt ? "Límite alcanzado" : "¿Listo para generar?"}
              </div>
              <div style={{ fontSize: 12, color: "#334155", marginBottom: 24 }}>
                {isAt ? "Haz upgrade para continuar." : "Plan completo en 60 segundos."}
              </div>
            </div>
            <button
              onClick={isAt && nextPlan ? () => handleUpgrade(nextPlan.id) : onStart}
              disabled={isAt && !nextPlan}
              style={{
                padding: "11px",
                background: isAt && nextPlan ? planGradient : !isAt ? "linear-gradient(135deg, #38bdf8, #818cf8)" : "rgba(255,255,255,0.04)",
                border: "none",
                borderRadius: 8,
                color: (isAt && nextPlan) || !isAt ? "#03060f" : "#334155",
                fontWeight: 800,
                fontSize: 13,
                cursor: isAt && !nextPlan ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
                boxShadow: !isAt ? "0 0 24px rgba(56,189,248,0.2)" : "none",
              }}
            >
              {isAt && nextPlan ? `Activar ${nextPlan.name} →` : isAt ? "Sin análisis disponibles" : "Nuevo análisis →"}
            </button>
          </GlassCard>

        </div>

        {/* Gestión de sitios */}
        <div style={{ marginBottom: 16 }}>
          <SitesManager user={user} userPlan={plan} onAnalyzeSite={onAnalyzeSite} />
        </div>

        {/* Historial */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>Análisis recientes</h3>
            {analyses.length > 0 && <span style={{ fontSize: 11, color: "#334155" }}>{analyses.length} análisis</span>}
          </div>

          {loadingHistory ? (
            <GlassCard style={{ padding: 40, textAlign: "center" }}>
              <span style={{ fontSize: 12, color: "#334155" }}>Cargando historial...</span>
            </GlassCard>
          ) : analyses.length === 0 ? (
            <GlassCard style={{ padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📂</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#64748b" }}>Sin análisis aún</div>
              <div style={{ fontSize: 12, color: "#334155" }}>Los planes que generes aparecerán aquí</div>
            </GlassCard>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {analyses.map(a => {
                const ap = a.plan_data?._plan || "free";
                const ac = PLAN_COLORS[ap] || "#38bdf8";
                const favicon = getFavicon(a.site_url);
                return (
                  <GlassCard key={a.id} style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                      {favicon && <img src={favicon} alt="" width={16} height={16} style={{ borderRadius: 4, flexShrink: 0 }} onError={e => e.target.style.display = "none"} />}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#94a3b8" }}>{a.site_url}</div>
                        <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>{timeAgo(a.created_at)}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: ac, background: `${ac}12`, border: `1px solid ${ac}25`, padding: "3px 10px", borderRadius: 999, letterSpacing: 1, textTransform: "uppercase" }}>{ap}</span>
                      <button
                        onClick={() => onViewPlan(a.id, a.plan_data)}
                        style={{ padding: "6px 14px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#475569", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#94a3b8"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#475569"; }}
                      >
                        Ver plan →
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
      `}</style>
    </div>
  );
}
