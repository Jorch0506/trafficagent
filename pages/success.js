import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const PLAN_DETAILS = {
  starter: {
    name: "Starter",
    price: "$29 USD/mes",
    color: "#38bdf8",
    features: ["20 análisis/mes", "20 posts listos", "10 artículos SEO", "10 directorios", "Soporte por email"],
  },
  growth: {
    name: "Growth",
    price: "$99 USD/mes",
    color: "#f59e0b",
    features: ["Análisis ilimitados", "50 posts listos", "25 artículos SEO", "Directorios ilimitados", "WhatsApp Bot 24h"],
  },
  agency: {
    name: "Agency",
    price: "$299 USD/mes",
    color: "#e879f9",
    features: ["10 sitios simultáneos", "150 posts/mes", "75 artículos SEO", "White label", "Manager dedicado"],
  },
};

export default function Success() {
  const router = useRouter();
  const { plan } = router.query;
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (plan && PLAN_DETAILS[plan]) {
      setDetails(PLAN_DETAILS[plan]);
    }
  }, [plan]);

  return (
    <>
      <Head>
        <title>¡Bienvenido a CAEVIK!</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Syne:wght@800&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: "100vh", background: "#050a14", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 500, width: "100%", textAlign: "center" }}>

          {/* Logo */}
          <svg width="200" height="52" viewBox="0 0 520 140" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 32 }}>
            <defs>
              <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7B61FF"/>
                <stop offset="100%" stopColor="#00C2FF"/>
              </linearGradient>
            </defs>
            <path d="M70 15 C45 15 25 35 25 60 C25 85 70 125 70 125 C70 125 115 85 115 60 C115 35 95 15 70 15 Z" fill="url(#pg)"/>
            <path d="M70 85 C60 85 52 78 52 70" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.6"/>
            <path d="M70 85 C80 85 88 78 88 70" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.6"/>
            <circle cx="70" cy="85" r="5" fill="white"/>
            <polygon points="70,2 58,22 82,22" fill="#9B6FFF"/>
            <rect x="64" y="18" width="12" height="18" fill="#9B6FFF" rx="2"/>
            <text x="130" y="82" fontFamily="Arial Black, sans-serif" fontSize="56" fontWeight="900" fill="white" letterSpacing="4">CAEVIK</text>
          </svg>

          {/* Success icon */}
          <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, marginBottom: 12, letterSpacing: -1 }}>
            ¡Pago exitoso!
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 32 }}>
            Bienvenido a CAEVIK. Tu plan está activo ahora mismo.
          </p>

          {details && (
            <div style={{ background: "#0f172a", border: `1px solid ${details.color}44`, borderRadius: 20, padding: 28, marginBottom: 32, boxShadow: `0 0 30px ${details.color}22` }}>
              <div style={{ fontSize: 13, color: details.color, fontWeight: 600, marginBottom: 8, letterSpacing: 1 }}>PLAN ACTIVO</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 4 }}>{details.name}</div>
              <div style={{ color: details.color, fontFamily: "monospace", fontSize: 20, marginBottom: 20 }}>{details.price}</div>
              {details.features.map(f => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, fontSize: 14, color: "#94a3b8", textAlign: "left" }}>
                  <span style={{ color: details.color }}>✓</span> {f}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => router.push("/")}
            style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}
          >
            Analizar mi primer sitio web →
          </button>

          <p style={{ fontSize: 13, color: "#475569", marginTop: 16 }}>
            Recibirás un email de confirmación en breve. Cualquier duda escríbenos a hola@caevik.com
          </p>
        </div>
      </div>
    </>
  );
}
