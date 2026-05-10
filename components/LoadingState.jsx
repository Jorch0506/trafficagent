// components/LoadingState.jsx
// Pantalla de carga durante la generación del plan con IA

function GlowOrb({ x, y, color = "#38bdf8", size = 300, opacity = 0.12 }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, opacity, filter: `blur(${size * 0.4}px)`, pointerEvents: "none", zIndex: 0 }} />
  );
}

const STEPS = [
  { id: 1, label: "Analizando tu sitio web...", icon: "🔍" },
  { id: 2, label: "Investigando keywords de tu nicho...", icon: "📊" },
  { id: 3, label: "Estudiando a tu competencia...", icon: "🎯" },
  { id: 4, label: "Generando estrategia SEO...", icon: "⚡" },
  { id: 5, label: "Creando contenido para redes sociales...", icon: "📱" },
  { id: 6, label: "Identificando directorios relevantes...", icon: "📂" },
  { id: 7, label: "Preparando tu plan de tráfico...", icon: "🚀" },
];

export { STEPS };

export function LoadingState({ step }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <GlowOrb x="20%" y="20%" color="var(--brand-primary)" size={500} opacity={0.08} />
      <GlowOrb x="60%" y="60%" color="var(--brand-accent)" size={400} opacity={0.06} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 10, maxWidth: 480, padding: "var(--space-6)" }}>
        <div style={{ fontSize: 60, marginBottom: "var(--space-6)" }}>⚡</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", marginBottom: "var(--space-2)" }}>
          Analizando tu negocio
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-base)", marginBottom: "var(--space-10)" }}>
          Esto puede tomar hasta 60 segundos. No cierres esta página.
        </p>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
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
      </div>
    </div>
  );
}
