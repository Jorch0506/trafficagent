import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // login | register
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
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.push("/");
    } catch (err) {
      setError(err.message || "Error de autenticacion");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "#0f172a", border: "1px solid #1e293b",
    borderRadius: 10, color: "#e2e8f0", fontSize: 15, padding: "14px 16px",
    fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box",
  };

  return (
    <>
      <Head>
        <title>CAEVIK — Acceder</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: "100vh", background: "#050a14", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <svg width="200" height="52" viewBox="0 0 520 140" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 24 }}>
              <defs>
                <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7B61FF" />
                  <stop offset="100%" stopColor="#00C2FF" />
                </linearGradient>
              </defs>
              <path d="M70 15 C45 15 25 35 25 60 C25 85 70 125 70 125 C70 125 115 85 115 60 C115 35 95 15 70 15 Z" fill="url(#pg)" />
              <path d="M70 85 C60 85 52 78 52 70" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
              <path d="M70 85 C80 85 88 78 88 70" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
              <circle cx="70" cy="85" r="5" fill="white" />
              <polygon points="70,2 58,22 82,22" fill="#9B6FFF" />
              <rect x="64" y="18" width="12" height="18" fill="#9B6FFF" rx="2" />
              <text x="130" y="82" fontFamily="Arial Black, sans-serif" fontSize="56" fontWeight="900" fill="white" letterSpacing="4">CAEVIK</text>
            </svg>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: "#e2e8f0", marginBottom: 8 }}>
              {mode === "login" ? "Bienvenido de vuelta" : "Crea tu cuenta"}
            </h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              {mode === "login" ? "Ingresa para acceder a tu plan" : "Empieza gratis, sin tarjeta"}
            </p>
          </div>

          <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 20, padding: 32 }}>

            <div style={{ display: "flex", background: "#0f172a", borderRadius: 10, padding: 4, marginBottom: 24 }}>
              {["login", "register"].map(m => (
                <button key={m} onClick={() => setMode(m)} style={{
                  flex: 1, padding: "10px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  background: mode === m ? "linear-gradient(135deg, #38bdf8, #818cf8)" : "transparent",
                  color: mode === m ? "#fff" : "#64748b",
                }}>
                  {m === "login" ? "Iniciar sesion" : "Registrarse"}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>
                Correo electronico
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#38bdf8"}
                onBlur={e => e.target.style.borderColor = "#1e293b"}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>
                Contrasena
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#38bdf8"}
                onBlur={e => e.target.style.borderColor = "#1e293b"}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
            </div>

            {error && (
              <div style={{ background: "#f8717122", border: "1px solid #f8717144", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} style={{
              width: "100%", padding: "15px",
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              border: "none", borderRadius: 10, color: "#fff",
              fontWeight: 700, fontSize: 16, cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Cargando..." : mode === "login" ? "Entrar →" : "Crear cuenta →"}
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "#475569", marginTop: 20 }}>
            Al registrarte aceptas nuestros terminos de uso.
          </p>
        </div>
      </div>
    </>
  );
}
