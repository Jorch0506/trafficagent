// components/GeneratorForm.jsx
// Formulario de análisis con validación de URL y estados de error inline

import { useState } from "react";
import { LogoSVG } from "./LogoSVG";

function GlowOrb({ x, y, color = "#38bdf8", size = 300, opacity = 0.12 }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, opacity, filter: `blur(${size * 0.4}px)`, pointerEvents: "none", zIndex: 0 }} />
  );
}

function isValidUrl(str) {
  try {
    const url = str.startsWith("http") ? str : `https://${str}`;
    new URL(url);
    return url.includes(".");
  } catch {
    return false;
  }
}

export function GeneratorForm({ onSubmit, loading, error, onClearError }) {
  const [form, setForm] = useState({
    url: "",
    instagram: "",
    facebook: "",
    businessType: "general",
    description: "",
  });
  const [urlError, setUrlError] = useState("");

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (k === "url") {
      setUrlError("");
      if (onClearError) onClearError();
    }
  };

  const handleSubmit = () => {
    if (!form.url) {
      setUrlError("Ingresa la URL de tu sitio web para continuar.");
      return;
    }
    if (!isValidUrl(form.url)) {
      setUrlError("La URL no parece válida. Formato correcto: misitioweb.com");
      return;
    }
    setUrlError("");
    onSubmit(form);
  };

  const inp = {
    width: "100%",
    background: "var(--bg-elevated)",
    border: "1px solid var(--bg-border)",
    borderRadius: "var(--radius-md)",
    color: "var(--text-primary)",
    fontSize: "var(--text-base)",
    padding: "14px 16px",
    fontFamily: "var(--font-sans)",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-6)", position: "relative" }}>
      <GlowOrb x="0" y="0" color="var(--brand-primary)" size={400} opacity={0.07} />
      <GlowOrb x="60%" y="60%" color="var(--brand-accent)" size={300} opacity={0.06} />

      <div style={{ width: "100%", maxWidth: 540, position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
          <LogoSVG id="form-logo" width={260} height={68} />
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", letterSpacing: -1, marginBottom: "var(--space-2)", marginTop: "var(--space-4)" }}>
            Analiza tu negocio
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-base)" }}>
            Nuestra IA genera tu plan de tráfico en 60 segundos
          </p>
        </div>

        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-8)" }}>

          {/* Error global de la API */}
          {error && (
            <div style={{ background: "#f8717118", border: "1px solid #f8717144", borderRadius: "var(--radius-md)", padding: "var(--space-3) var(--space-4)", marginBottom: "var(--space-5)", display: "flex", alignItems: "flex-start", gap: "var(--space-3)" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
              <div>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--brand-danger)", marginBottom: 2 }}>
                  {error.title}
                </div>
                <div style={{ fontSize: "var(--text-sm)", color: "#f87171cc", lineHeight: 1.5 }}>
                  {error.message}
                </div>
                {error.cta && (
                  <button
                    onClick={error.cta.action}
                    style={{ marginTop: "var(--space-2)", fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--brand-primary)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font-sans)" }}
                  >
                    {error.cta.label} →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Campo URL */}
          <div style={{ marginBottom: "var(--space-5)" }}>
            <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>
              🌐 URL de tu sitio web <span style={{ color: "var(--brand-danger)" }}>*</span>
            </label>
            <input
              value={form.url}
              onChange={e => update("url", e.target.value)}
              placeholder="https://tusitioweb.com"
              style={{ ...inp, borderColor: urlError ? "var(--brand-danger)" : "var(--bg-border)" }}
              onFocus={e => e.target.style.borderColor = urlError ? "var(--brand-danger)" : "var(--brand-primary)"}
              onBlur={e => e.target.style.borderColor = urlError ? "var(--brand-danger)" : "var(--bg-border)"}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
            {urlError && (
              <div style={{ fontSize: "var(--text-xs)", color: "var(--brand-danger)", marginTop: "var(--space-1)", display: "flex", alignItems: "center", gap: 4 }}>
                <span>⚠</span> {urlError}
              </div>
            )}
          </div>

          {/* Tipo de negocio — va antes de los opcionales para dar contexto */}
          <div style={{ marginBottom: "var(--space-5)" }}>
            <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>
              🏢 Tipo de negocio <span style={{ color: "var(--brand-danger)" }}>*</span>
            </label>
            <select
              value={form.businessType}
              onChange={e => update("businessType", e.target.value)}
              style={{ ...inp, cursor: "pointer" }}
            >
              {[
                ["general",   "Selecciona tu tipo de negocio..."],
                ["ecommerce", "E-commerce / Tienda online"],
                ["saas",      "SaaS / App / Tecnología"],
                ["health",    "Salud / Bienestar / Health Tech"],
                ["local",     "Negocio físico / Local"],
                ["agency",    "Agencia / Servicios / Consultoría"],
              ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          {/* Descripción — más prominente para mejorar la calidad del plan */}
          <div style={{ marginBottom: "var(--space-5)" }}>
            <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>
              📝 Describe tu negocio
              <span style={{ fontWeight: 400, color: "var(--text-muted)", marginLeft: 6 }}>— mejora la precisión del plan</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => update("description", e.target.value)}
              placeholder="Ej: Plataforma de salud preventiva para empresas en México. Ofrecemos análisis de bienestar laboral y programas de prevención."
              rows={3}
              style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = "var(--brand-primary)"}
              onBlur={e => e.target.style.borderColor = "var(--bg-border)"}
            />
          </div>

          {/* Campos opcionales de redes sociales */}
          {[
            { key: "instagram", label: "📸 Instagram (opcional)", placeholder: "@tuusuario" },
            { key: "facebook",  label: "📘 Facebook (opcional)",  placeholder: "facebook.com/tupagina" },
          ].map(({ key, label, placeholder }) => (
            <div key={key} style={{ marginBottom: "var(--space-5)" }}>
              <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>
                {label}
              </label>
              <input
                value={form[key]}
                onChange={e => update(key, e.target.value)}
                placeholder={placeholder}
                style={inp}
                onFocus={e => e.target.style.borderColor = "var(--brand-primary)"}
                onBlur={e => e.target.style.borderColor = "var(--bg-border)"}
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: "100%", padding: "16px", background: loading ? "var(--bg-border)" : "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-md)", color: loading ? "var(--text-disabled)" : "#fff", fontWeight: 700, fontSize: "var(--text-md)", cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)" }}
          >
            {loading ? "Generando..." : "Generar mi plan de tráfico ⚡"}
          </button>

        </div>
      </div>
    </div>
  );
}
