// components/GeneratorForm.jsx
// Formulario de análisis — captura URL y datos del negocio

import { useState } from "react";
import { LogoSVG } from "./LogoSVG";

function GlowOrb({ x, y, color = "#38bdf8", size = 300, opacity = 0.12 }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, opacity, filter: `blur(${size * 0.4}px)`, pointerEvents: "none", zIndex: 0 }} />
  );
}

export function GeneratorForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ url: "", instagram: "", facebook: "", businessType: "ecommerce", description: "" });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

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
          {[
            { key: "url", label: "🌐 URL de tu sitio web", placeholder: "https://tusitioweb.com", required: true },
            { key: "instagram", label: "📸 Instagram (opcional)", placeholder: "@tuusuario" },
            { key: "facebook", label: "📘 Facebook (opcional)", placeholder: "facebook.com/tupagina" },
          ].map(({ key, label, placeholder, required }) => (
            <div key={key} style={{ marginBottom: "var(--space-5)" }}>
              <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>
                {label} {required && <span style={{ color: "var(--brand-danger)" }}>*</span>}
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

          <div style={{ marginBottom: "var(--space-5)" }}>
            <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>
              🏢 Tipo de negocio
            </label>
            <select
              value={form.businessType}
              onChange={e => update("businessType", e.target.value)}
              style={{ ...inp, cursor: "pointer" }}
            >
              {[
                ["ecommerce", "E-commerce / Tienda online"],
                ["saas", "SaaS / Aplicación web"],
                ["local", "Negocio físico / Local"],
                ["agency", "Agencia / Servicios"],
                ["general", "Otro"],
              ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: "var(--space-6)" }}>
            <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>
              📝 Describe tu negocio (opcional)
            </label>
            <textarea
              value={form.description}
              onChange={e => update("description", e.target.value)}
              placeholder="Qué vendes, a quién, en qué mercado..."
              rows={3}
              style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = "var(--brand-primary)"}
              onBlur={e => e.target.style.borderColor = "var(--bg-border)"}
            />
          </div>

          <button
            onClick={() => form.url && onSubmit(form)}
            disabled={!form.url || loading}
            style={{ width: "100%", padding: "16px", background: form.url && !loading ? "var(--gradient-brand)" : "var(--bg-border)", border: "none", borderRadius: "var(--radius-md)", color: form.url && !loading ? "#fff" : "var(--text-disabled)", fontWeight: 700, fontSize: "var(--text-md)", cursor: form.url && !loading ? "pointer" : "not-allowed", fontFamily: "var(--font-sans)" }}
          >
            {loading ? "Generando..." : "Generar mi plan de tráfico ⚡"}
          </button>
        </div>
      </div>
    </div>
  );
}
