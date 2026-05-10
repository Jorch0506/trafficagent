// components/LoadingState.jsx
// Pantalla de carga con tiempo estimado dinámico según plan del usuario

function GlowOrb({ x, y, color = "#38bdf8", size = 300, opacity = 0.12 }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, opacity, filter: `blur(${size * 0.4}px)`, pointerEvents: "none", zIndex: 0 }} />
  );
}

export const STEPS = [
  { id: 1, label: "Analizando tu sitio web...", icon: "🔍" },
  { id: 2, label: "Investigando keywords de tu nicho...", icon: "📊" },
  { id: 3, label: "Estudiando a tu competencia...", icon: "🎯" },
  { id: 4, label: "Generando estrategia SEO...", icon: "⚡" },
  { id: 5, label: "Creando contenido para redes sociales...", icon: "📱" },
  { id: 6, label: "Identificando directorios relevantes...", icon: "📂" },
  { id: 7, label: "Preparando tu plan de tráfico...", icon: "🚀" },
];

// Tiempo estimado según plan
const PLAN_TIME = {
  free:    "Esto toma entre 15 y 30 segundos. No cierres esta página.",
  starter: "Esto toma entre 30 y 45 segundos. No cierres esta página.",
  growth:  "Los planes Growth pueden tardar hasta 60 segundos. No cierres esta página.",
  agency:  "Los planes Agency pueden tardar hasta 90 segundos. No cierres esta página.",
};

export function LoadingState({ step, streamText, userPlan }) {
  const charsReceived = streamText?.length || 0;
  const isStreaming = charsReceived > 0;
  const timeMsg = PLAN_TIME[userPlan] || PLAN_TIME.free;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <GlowOrb x="20%" y="20%" color="var(--brand-primary)" size={500} opacity={0.08} />
      <GlowOrb x="60%" y="60%" color="var(--brand-accent)" size={400} opacity={0.06} />

      <div style={{ textAlign: "center", position: "relative", zIndex: 10, maxWidth: 480, padding: "var(--space-6)", width: "100%" }}>
        <div style={{ fontSize: 60, marginBottom: "var(--space-6)" }}>⚡</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", marginBottom: "var(--space-2)" }}>
          Analizando tu negocio
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-base)", marginBottom: "var(--space-10)" }}>
          {timeMsg}
        </p>

        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", marginBottom: isStreaming ? "var(--space-4)" : 0 }}>
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "10px 0", opacity: i > step + 1 ? 0.3 : 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? "#4ade8022" : active ? "#38bdf822" : "var(--bg-border)", border: `2px solid ${done ? "#4ade80" : active ? "#38bdf8" : "var(--bg-border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>
                  {done ? "✓" : s.icon}
                </div>
                <span style={{ fontSize: "var(--text-sm)", color: done ? "#4ade80" : active ? "var(--text-primary)" : "var(--text-disabled)", fontWeight: active ? 600 : 400 }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {isStreaming && (
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-md)", padding: "var(--space-3) var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brand-success)", flexShrink: 0, animation: "pulse 1s infinite" }} />
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--brand-success)", fontWeight: 600, marginBottom: 2 }}>
                Recibiendo tu plan...
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                {charsReceived.toLocaleString()} caracteres generados
              </div>
            </div>
            <div style={{ width: 60, height: 3, background: "var(--bg-border)", borderRadius: "var(--radius-full)", overflow: "hidden", flexShrink: 0 }}>
              <div style={{ height: "100%", width: "40%", background: "var(--brand-success)", borderRadius: "var(--radius-full)", animation: "shimmer 1.5s infinite" }} />
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
