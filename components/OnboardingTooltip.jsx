// components/OnboardingTooltip.jsx
// Tour de 3 pasos para nuevos usuarios — sin librerías externas
// Se muestra solo en el primer login y marca onboarding_completed en Supabase

import { useState } from "react";
import { supabase } from "../hooks/useAuth";

const STEPS = [
  {
    title: "Bienvenido a CAEVIK",
    description: "Tu agente de tráfico orgánico con IA. En 60 segundos generamos un plan completo de keywords, posts y artículos SEO para tu negocio.",
    emoji: "👋",
    position: "center",
  },
  {
    title: "Genera tu primer plan",
    description: "Haz clic en 'Nuevo análisis', ingresa la URL de tu negocio, selecciona tu tipo de negocio y describe brevemente a qué te dedicas. Más contexto = mejor plan.",
    emoji: "⚡",
    position: "center",
  },
  {
    title: "Guarda y revisa tus planes",
    description: "Cada plan que generes queda guardado en tu historial. Puedes verlos, exportarlos a PDF y agregar tus sitios para acceder más rápido.",
    emoji: "💾",
    position: "center",
  },
];

export function OnboardingTooltip({ userId, onComplete }) {
  const [step, setStep] = useState(0);
  const [completing, setCompleting] = useState(false);

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      await handleFinish();
    }
  };

  const handleFinish = async () => {
    setCompleting(true);
    await supabase
      .from("users")
      .update({ onboarding_completed: true })
      .eq("id", userId);
    onComplete();
  };

  const current = STEPS[step];

  return (
    <>
      {/* Overlay semitransparente */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.75)",
        zIndex: 900,
        backdropFilter: "blur(2px)",
      }} />

      {/* Modal central */}
      <div style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 901,
        padding: "var(--space-6)",
      }}>
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--bg-border)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-8)",
          maxWidth: 440,
          width: "100%",
          position: "relative",
          boxShadow: "0 0 60px rgba(56, 189, 248, 0.15)",
        }}>

          {/* Botón cerrar */}
          <button
            onClick={handleFinish}
            style={{
              position: "absolute",
              top: "var(--space-4)",
              right: "var(--space-4)",
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: 18,
              cursor: "pointer",
              lineHeight: 1,
              fontFamily: "var(--font-sans)",
            }}
          >
            ✕
          </button>

          {/* Emoji */}
          <div style={{ fontSize: 48, marginBottom: "var(--space-4)", textAlign: "center" }}>
            {current.emoji}
          </div>

          {/* Título */}
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "var(--text-xl)",
            marginBottom: "var(--space-3)",
            textAlign: "center",
            letterSpacing: -0.5,
          }}>
            {current.title}
          </h2>

          {/* Descripción */}
          <p style={{
            color: "var(--text-muted)",
            fontSize: "var(--text-base)",
            lineHeight: 1.7,
            textAlign: "center",
            marginBottom: "var(--space-8)",
          }}>
            {current.description}
          </p>

          {/* Indicadores de paso */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "var(--space-2)",
            marginBottom: "var(--space-6)",
          }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? 24 : 8,
                  height: 8,
                  borderRadius: "var(--radius-full)",
                  background: i === step
                    ? "var(--brand-primary)"
                    : i < step
                    ? "var(--brand-primary)"
                    : "var(--bg-border)",
                  transition: "width 0.3s ease, background 0.3s ease",
                  opacity: i < step ? 0.4 : 1,
                }}
              />
            ))}
          </div>

          {/* Botón de acción */}
          <button
            onClick={handleNext}
            disabled={completing}
            style={{
              width: "100%",
              padding: "14px",
              background: "var(--gradient-brand)",
              border: "none",
              borderRadius: "var(--radius-md)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "var(--text-base)",
              cursor: completing ? "not-allowed" : "pointer",
              fontFamily: "var(--font-sans)",
              opacity: completing ? 0.7 : 1,
            }}
          >
            {completing
              ? "Guardando..."
              : step < STEPS.length - 1
              ? "Siguiente →"
              : "Empezar →"}
          </button>

          {/* Skip */}
          {step < STEPS.length - 1 && (
            <button
              onClick={handleFinish}
              style={{
                display: "block",
                width: "100%",
                marginTop: "var(--space-3)",
                background: "none",
                border: "none",
                color: "var(--text-disabled)",
                fontSize: "var(--text-sm)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                textAlign: "center",
              }}
            >
              Saltar introducción
            </button>
          )}

        </div>
      </div>
    </>
  );
}
