// components/AuthModal.jsx
// Modal de registro e inicio de sesión

import { useState } from "react";
import { supabase } from "../hooks/useAuth";

export function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) { setError("Completa todos los campos"); return; }
    setLoading(true);
    setError("");
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Email de bienvenida — fire and forget, no bloquea el flujo
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "welcome", to: email }),
        }).catch(() => {}); // silencioso si falla

      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onSuccess();
    } catch (err) {
      setError(err.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
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
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "var(--space-6)" }}>
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-8)", width: "100%", maxWidth: 420, position: "relative" }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer" }}
        >
          ✕
        </button>
        <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
          <div style={{ fontSize: 36, marginBottom: "var(--space-3)" }}>🚀</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-xl)", color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
            {mode === "register" ? "Guarda tu plan gratis" : "Bienvenido de vuelta"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
            {mode === "register"
              ? "Crea tu cuenta para guardar resultados y generar más planes"
              : "Accede a tus análisis guardados"}
          </p>
        </div>

        <div style={{ display: "flex", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", padding: 4, marginBottom: "var(--space-5)" }}>
          {["register", "login"].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)", border: "none", fontSize: "var(--text-sm)", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", background: mode === m ? "var(--gradient-brand)" : "transparent", color: mode === m ? "#fff" : "var(--text-muted)" }}
            >
              {m === "register" ? "Crear cuenta" : "Iniciar sesión"}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: "var(--space-4)" }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            style={inp}
            onFocus={e => e.target.style.borderColor = "var(--brand-primary)"}
            onBlur={e => e.target.style.borderColor = "var(--bg-border)"}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <div style={{ marginBottom: "var(--space-5)" }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña (mín. 6 caracteres)"
            style={inp}
            onFocus={e => e.target.style.borderColor = "var(--brand-primary)"}
            onBlur={e => e.target.style.borderColor = "var(--bg-border)"}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {error && (
          <div style={{ background: "#f8717122", border: "1px solid #f8717144", borderRadius: "var(--radius-sm)", padding: "10px 14px", fontSize: "var(--text-sm)", color: "var(--brand-danger)", marginBottom: "var(--space-4)" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%", padding: "15px", background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-md)", color: "#fff", fontWeight: 700, fontSize: "var(--text-base)", cursor: "pointer", fontFamily: "var(--font-sans)", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Cargando..." : mode === "register" ? "Crear cuenta gratis →" : "Entrar →"}
        </button>
      </div>
    </div>
  );
}
