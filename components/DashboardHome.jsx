// components/DashboardHome.jsx
// Pantalla de bienvenida para usuarios logueados
// Incluye historial de análisis recientes

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

const PLAN_FEATURES = {
  free:    "1 análisis al mes · 2 posts · 1 directorio",
  starter: "20 análisis · 10 posts · 5 directorios",
  growth:  "60 análisis · 25 posts · 3 sitios web",
  agency:  "100 análisis · 10 sitios web · Manager dedicado",
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "hace un momento";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} hrs`;
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)} días`;
  return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

function getFavicon(url) {
  try {
    const domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
}

export function DashboardHome({ user, userData, onStart, onLogout, onViewPlan }) {
  const [analyses, setAnalyses] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const plan = userData?.plan || "free";
  const planColor = PLAN_COLORS[plan] || "#38bdf8";
  const used = userData?.analyses_used ?? 0;
  const limit = userData?.analyses_limit ?? 1;
  const usagePercent = Math.min((used / limit) * 100, 100);
  const isNearLimit = usagePercent >= 80;
  const isAtLimit = used >= limit;
  const firstName = user?.email?.split("@")[0] || "ahí";

  useEffect(() => {
    if (!user?.id) return;
    const fetchHistory = async () => {
      const { data } = await supabase
        .from("analyses")
        .select("id, site_url, created_at, plan_data")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      setAnalyses(data || []);
      setLoadingHistory(false);
    };
    fetchHistory();
  }, [user?.id]);

  const getNextPlan = () => {
    if (plan === "free")    return { id: "starter", name: "Starter", price: "$29" };
    if (plan === "starter") return { id: "growth",  name: "Growth",  price: "$99" };
    if (plan === "growth")  return { id: "agency",  name: "Agency",  price: "$299" };
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

  if (!userData) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>Cargando tu panel...</div>
      </div>
    );
  }

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
          <button onClick={onLogout} style={{ background: "transparent", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", fontSize: "var(--text-sm)", padding: "8px 16px", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
            Salir
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 48px 80px", position: "relative", zIndex: 10 }}>

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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>

          {/* Card uso */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-6)" }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: "var(--space-4)" }}>
              Uso este mes
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-1)", marginBottom: "var(--space-3)" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-3xl)", color: isAtLimit ? "var(--brand-danger)" : isNearLimit ? "var(--brand-warning)" : planColor }}>
                {used}
              </span>
              <span style={{ fontSize: "var(--text-base)", color: "var(--text-muted)" }}>/ {limit} análisis</span>
            </div>
            <div style={{ height: 6, background: "var(--bg-border)", borderRadius: "var(--radius-full)", overflow: "hidden", marginBottom: "var(--space-2)" }}>
              <div style={{ height: "100%", width: `${usagePercent}%`, borderRadius: "var(--radius-full)", background: isAtLimit ? "var(--brand-danger)" : isNearLimit ? "var(--brand-warning)" : planColor, transition: "width var(--transition-slow)" }} />
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-disabled)" }}>
              {isAtLimit ? "Límite alcanzado — haz upgrade para continuar"
                : isNearLimit ? `Solo te quedan ${limit - used} análisis este mes`
                : `${limit - used} análisis disponibles`}
            </div>
          </div>

          {/* Card plan */}
          <div style={{ background: `linear-gradient(135deg, ${planColor}12, var(--bg-surface))`, border: `1px solid ${planColor}30`, borderRadius: "var(--radius-xl)", padding: "var(--space-6)" }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: "var(--space-4)" }}>
              Tu plan actual
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", color: planColor, marginBottom: "var(--space-2)", textTransform: "capitalize" }}>
              {plan}
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
              {PLAN_FEATURES[plan]}
            </div>
            {nextPlan ? (
              <button onClick={() => handleUpgrade(nextPlan.id)} style={{ width: "100%", padding: "10px", background: "transparent", border: `1px solid ${planColor}`, borderRadius: "var(--radius-sm)", color: planColor, fontWeight: 700, fontSize: "var(--text-sm)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                Activar {nextPlan.name} {nextPlan.price}/mes →
              </button>
            ) : (
              <div style={{ fontSize: "var(--text-sm)", color: planColor, fontWeight: 600 }}>✓ Plan máximo activado</div>
            )}
          </div>

        </div>

        {/* CTA nuevo análisis */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-8)", textAlign: "center", marginBottom: "var(--space-8)" }}>
          <div style={{ fontSize: 48, marginBottom: "var(--space-4)" }}>⚡</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", marginBottom: "var(--space-2)", letterSpacing: -1 }}>
            {isAtLimit ? "Límite del mes alcanzado" : "¿Listo para generar tu plan?"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-base)", marginBottom: "var(--space-6)", maxWidth: 480, margin: "0 auto var(--space-6)" }}>
            {isAtLimit
              ? `Has usado tus ${limit} análisis de este mes. Haz upgrade para continuar.`
              : "Ingresa la URL de tu negocio y nuestra IA genera tu plan completo en 60 segundos."}
          </p>
          {isAtLimit && nextPlan ? (
            <button onClick={() => handleUpgrade(nextPlan.id)} style={{ padding: "16px 48px", background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-lg)", color: "#fff", fontWeight: 700, fontSize: "var(--text-lg)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
              Activar {nextPlan.name} {nextPlan.price}/mes →
            </button>
          ) : (
            <button onClick={onStart} disabled={isAtLimit} style={{ padding: "16px 48px", background: isAtLimit ? "var(--bg-border)" : "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-lg)", color: isAtLimit ? "var(--text-disabled)" : "#fff", fontWeight: 700, fontSize: "var(--text-lg)", cursor: isAtLimit ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)", boxShadow: isAtLimit ? "none" : "0 0 40px #38bdf844" }}>
              Nuevo análisis →
            </button>
          )}
        </div>

        {/* Historial de análisis */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-lg)" }}>
              Análisis recientes
            </h3>
            {analyses.length > 0 && (
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                {analyses.length} {analyses.length === 1 ? "análisis" : "análisis"}
              </span>
            )}
          </div>

          {loadingHistory ? (
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-8)", textAlign: "center", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
              Cargando historial...
            </div>
          ) : analyses.length === 0 ? (
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-8)", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: "var(--space-3)" }}>📂</div>
              <div style={{ fontSize: "var(--text-base)", fontWeight: 500, marginBottom: "var(--space-2)" }}>Sin análisis aún</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Los planes que generes aparecerán aquí</div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              {analyses.map((analysis) => {
                const favicon = getFavicon(analysis.site_url);
                const planData = analysis.plan_data;
                const analysisPlan = planData?._plan || "free";
                const planCol = PLAN_COLORS[analysisPlan] || "#38bdf8";

                return (
                  <div key={analysis.id} style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-4) var(--space-5)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flex: 1, minWidth: 0 }}>
                      {favicon && (
                        <img src={favicon} alt="" width={20} height={20} style={{ borderRadius: 4, flexShrink: 0 }} onError={e => e.target.style.display = "none"} />
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {analysis.site_url}
                        </div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: 2 }}>
                          {timeAgo(analysis.created_at)}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexShrink: 0 }}>
                      <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: planCol, background: planCol + "18", padding: "3px 10px", borderRadius: "var(--radius-full)", border: `1px solid ${planCol}33`, textTransform: "uppercase", letterSpacing: 1 }}>
                        {analysisPlan}
                      </span>
                      <button
                        onClick={() => onViewPlan(analysis.id, analysis.plan_data)}
                        style={{ padding: "8px 16px", background: "transparent", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}
                      >
                        Ver plan →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
