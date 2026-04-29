import { useState, useRef } from "react";
import Head from "next/head";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS = [
  { id: "free", name: "Free", price: "$0", period: " USD", color: "#4ade80",
    features: ["Análisis SEO básico", "5 posts/mes", "1 directorio", "Reporte PDF"],
    cta: "Empezar gratis", limit: "Starter pack" },
  { id: "starter", name: "Starter", price: "$29", period: " USD/mes", color: "#38bdf8",
    features: ["20 posts/mes", "10 directorios", "Blog automático", "Keywords report", "Soporte email"],
    cta: "Comenzar", limit: "Para emprendedores" },
  { id: "growth", name: "Growth", price: "$99", period: " USD/mes", color: "#f59e0b",
    features: ["Posts ilimitados", "Directorios ilimitados", "Ads optimization", "Análisis competencia", "Soporte prioritario"],
    cta: "Escalar ahora", limit: "Para negocios", popular: true },
  { id: "agency", name: "Agency", price: "$299", period: " USD/mes", color: "#e879f9",
    features: ["Múltiples clientes", "White label", "API access", "Manager dedicado", "Reportes personalizados"],
    cta: "Contactar", limit: "Para agencias" },
];

const STEPS = [
  { id: 1, label: "Analizando tu sitio web...", icon: "🔍" },
  { id: 2, label: "Investigando keywords de tu nicho...", icon: "📊" },
  { id: 3, label: "Estudiando a tu competencia...", icon: "🎯" },
  { id: 4, label: "Generando estrategia SEO...", icon: "⚡" },
  { id: 5, label: "Creando contenido para redes sociales...", icon: "📱" },
  { id: 6, label: "Identificando directorios relevantes...", icon: "📂" },
  { id: 7, label: "Preparando tu plan de tráfico...", icon: "🚀" },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────

function GlowOrb({ x, y, color = "#38bdf8", size = 300, opacity = 0.12 }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: size, height: size,
      borderRadius: "50%", background: color, opacity,
      filter: `blur(${size * 0.4}px)`, pointerEvents: "none", zIndex: 0,
    }} />
  );
}

function Tag({ children, color = "#38bdf8" }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 600,
      fontFamily: "monospace", letterSpacing: 1, display: "inline-block",
    }}>{children}</span>
  );
}

function ScoreRing({ score }) {
  const r = 42, circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score < 40 ? "#f87171" : score < 70 ? "#f59e0b" : "#4ade80";
  return (
    <div style={{ position: "relative", width: 110, height: 110, margin: "0 auto 12px" }}>
      <svg width={110} height={110} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={55} cy={55} r={r} fill="none" stroke="#ffffff11" strokeWidth={8} />
        <circle cx={55} cy={55} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 26, fontWeight: 800, color, fontFamily: "monospace" }}>{score}</span>
        <span style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 1 }}>SEO SCORE</span>
      </div>
    </div>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────

function LandingScreen({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: "#050a14", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", overflow: "hidden", position: "relative" }}>
      <GlowOrb x="-100px" y="-100px" color="#38bdf8" size={500} opacity={0.08} />
      <GlowOrb x="60%" y="20%" color="#e879f9" size={400} opacity={0.06} />
      <GlowOrb x="20%" y="70%" color="#4ade80" size={300} opacity={0.07} />

      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 48px", borderBottom: "1px solid #ffffff08", position: "relative", zIndex: 10, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="220" height="56" viewBox="0 0 520 140" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7B61FF"/>
            <stop offset="100%" stopColor="#00C2FF"/>
          </linearGradient>
        </defs>
        <path d="M70 15 C45 15 25 35 25 60 C25 85 70 125 70 125 C70 125 115 85 115 60 C115 35 95 15 70 15 Z" fill="url(#pg1)"/>
        <path d="M70 85 C60 85 52 78 52 70" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.6"/>
        <path d="M70 85 C80 85 88 78 88 70" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.6"/>
        <path d="M70 85 C55 85 43 73 43 60" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.35"/>
        <path d="M70 85 C85 85 97 73 97 60" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.35"/>
        <circle cx="70" cy="85" r="5" fill="white"/>
        <polygon points="70,2 58,22 82,22" fill="#9B6FFF"/>
        <rect x="64" y="18" width="12" height="18" fill="#9B6FFF" rx="2"/>
        <text x="130" y="82" fontFamily="Arial Black, sans-serif" fontSize="56" fontWeight="900" fill="white" letterSpacing="4">CAEVIK</text>
        <line x1="130" y1="100" x2="150" y2="100" stroke="#94a3b8" strokeWidth="1.5"/>
        <text x="158" y="104" fontFamily="Arial, sans-serif" fontSize="13" fill="#94a3b8" letterSpacing="3">AI · TRAFFIC · AGENT</text>
        <line x1="380" y1="100" x2="400" y2="100" stroke="#94a3b8" strokeWidth="1.5"/>
      </svg>
        </div>
        <button onClick={onStart} style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 14, padding: "10px 20px", cursor: "pointer" }}>
          Empezar gratis →
        </button>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 48px 60px", textAlign: "center", position: "relative", zIndex: 10 }}>
        <div style={{ display: "inline-flex", gap: 8, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" }}>
          <Tag color="#4ade80">IA-Powered</Tag>
          <Tag color="#38bdf8">SEO Automático</Tag>
          <Tag color="#e879f9">100% Orgánico</Tag>
        </div>

        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1.05, letterSpacing: -2, marginBottom: 24, background: "linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Tu negocio merece<br />
          <span style={{ background: "linear-gradient(135deg, #38bdf8, #e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ser encontrado.</span>
        </h1>

        <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
          Ingresa tu sitio web. Nuestra IA analiza tu nicho, genera contenido SEO, crea posts para redes sociales y te posiciona donde está tu cliente.
        </p>

        <button onClick={onStart} style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 18, padding: "18px 48px", cursor: "pointer", boxShadow: "0 0 40px #38bdf844", letterSpacing: -0.3 }}>
          Generar mi plan de tráfico →
        </button>
        <p style={{ fontSize: 13, color: "#475569", marginTop: 14 }}>Gratis. Sin tarjeta. En 60 segundos.</p>

        <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 80, flexWrap: "wrap" }}>
          {[["10K+", "Sitios analizados"], ["3.2M", "Visitas generadas"], ["89%", "Mejora en SEO"], ["$0", "Para empezar"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, background: "linear-gradient(135deg, #38bdf8, #e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{num}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 80px", position: "relative", zIndex: 10 }}>
        <h2 style={{ textAlign: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, marginBottom: 48, letterSpacing: -1 }}>Planes que escalan contigo</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{ background: plan.popular ? `linear-gradient(135deg, ${plan.color}15, #0f172a)` : "#0f172a", border: `1px solid ${plan.popular ? plan.color + "55" : "#ffffff10"}`, borderRadius: 16, padding: "28px 24px", position: "relative", boxShadow: plan.popular ? `0 0 30px ${plan.color}22` : "none" }}>
              {plan.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: plan.color, color: "#000", fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 20, letterSpacing: 1, whiteSpace: "nowrap" }}>MÁS POPULAR</div>}
              <div style={{ fontSize: 13, color: plan.color, fontWeight: 600, marginBottom: 8, letterSpacing: 1 }}>{plan.limit}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 2 }}>{plan.name}</div>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontFamily: "monospace", fontSize: 32, fontWeight: 700, color: plan.color }}>{plan.price}</span>
                <span style={{ color: "#64748b", fontSize: 14 }}>{plan.period}</span>
              </div>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, fontSize: 13, color: "#94a3b8" }}>
                  <span style={{ color: plan.color }}>✓</span> {f}
                </div>
              ))}
              <button onClick={onStart} style={{ marginTop: 20, width: "100%", padding: "12px", background: plan.popular ? plan.color : "transparent", border: `1px solid ${plan.color}`, borderRadius: 8, color: plan.popular ? "#000" : plan.color, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{plan.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function FormScreen({ onSubmit, loading }) {
  const [form, setForm] = useState({ url: "", instagram: "", facebook: "", businessType: "ecommerce", description: "" });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inputStyle = {
    width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10,
    color: "#e2e8f0", fontSize: 15, padding: "14px 16px", fontFamily: "'DM Sans', sans-serif",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050a14", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <GlowOrb x="0" y="0" color="#38bdf8" size={400} opacity={0.07} />
      <GlowOrb x="60%" y="60%" color="#e879f9" size={300} opacity={0.06} />

      <div style={{ width: "100%", maxWidth: 540, position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
            <svg width="260" height="68" viewBox="0 0 520 140" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pg2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B61FF"/>
              <stop offset="100%" stopColor="#00C2FF"/>
            </linearGradient>
          </defs>
          <path d="M70 15 C45 15 25 35 25 60 C25 85 70 125 70 125 C70 125 115 85 115 60 C115 35 95 15 70 15 Z" fill="url(#pg2)"/>
          <path d="M70 85 C60 85 52 78 52 70" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.6"/>
          <path d="M70 85 C80 85 88 78 88 70" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.6"/>
          <path d="M70 85 C55 85 43 73 43 60" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.35"/>
          <path d="M70 85 C85 85 97 73 97 60" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.35"/>
          <circle cx="70" cy="85" r="5" fill="white"/>
          <polygon points="70,2 58,22 82,22" fill="#9B6FFF"/>
          <rect x="64" y="18" width="12" height="18" fill="#9B6FFF" rx="2"/>
          <text x="130" y="82" fontFamily="Arial Black, sans-serif" fontSize="56" fontWeight="900" fill="white" letterSpacing="4">CAEVIK</text>
          <line x1="130" y1="100" x2="150" y2="100" stroke="#94a3b8" strokeWidth="1.5"/>
          <text x="158" y="104" fontFamily="Arial, sans-serif" fontSize="13" fill="#94a3b8" letterSpacing="3">AI · TRAFFIC · AGENT</text>
          <line x1="380" y1="100" x2="400" y2="100" stroke="#94a3b8" strokeWidth="1.5"/>
        </svg>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: -1, marginBottom: 8 }}>Analiza tu negocio</h2>
          <p style={{ color: "#64748b", fontSize: 15 }}>Nuestra IA genera tu plan de tráfico en 60 segundos</p>
        </div>

        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 20, padding: 36 }}>
          {[
            { key: "url", label: "🌐 URL de tu sitio web", placeholder: "https://tusitioweb.com", required: true },
            { key: "instagram", label: "📸 Instagram (opcional)", placeholder: "@tuusuario" },
            { key: "facebook", label: "📘 Facebook (opcional)", placeholder: "facebook.com/tupagina" },
          ].map(({ key, label, placeholder, required }) => (
            <div key={key} style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>
                {label} {required && <span style={{ color: "#f87171" }}>*</span>}
              </label>
              <input value={form[key]} onChange={e => update(key, e.target.value)} placeholder={placeholder} style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#38bdf8"}
                onBlur={e => e.target.style.borderColor = "#1e293b"} />
            </div>
          ))}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>🏢 Tipo de negocio</label>
            <select value={form.businessType} onChange={e => update("businessType", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              {[["ecommerce", "E-commerce / Tienda online"], ["saas", "SaaS / Aplicación web"], ["local", "Negocio físico / Local"], ["agency", "Agencia / Servicios"], ["general", "Otro"]].map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>📝 Describe tu negocio (opcional)</label>
            <textarea value={form.description} onChange={e => update("description", e.target.value)}
              placeholder="Qué vendes, a quién, en qué mercado..." rows={3}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = "#38bdf8"}
              onBlur={e => e.target.style.borderColor = "#1e293b"} />
          </div>

          <button onClick={() => form.url && onSubmit(form)} disabled={!form.url || loading} style={{
            width: "100%", padding: "16px",
            background: form.url && !loading ? "linear-gradient(135deg, #38bdf8, #818cf8)" : "#1e293b",
            border: "none", borderRadius: 10,
            color: form.url && !loading ? "#fff" : "#475569",
            fontWeight: 700, fontSize: 16, cursor: form.url && !loading ? "pointer" : "not-allowed",
            boxShadow: form.url ? "0 0 30px #38bdf833" : "none",
          }}>
            {loading ? "Generando..." : "Generar mi plan de tráfico ⚡"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Loading ──────────────────────────────────────────────────────────────────

function LoadingScreen({ step }) {
  return (
    <div style={{ minHeight: "100vh", background: "#050a14", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <GlowOrb x="20%" y="20%" color="#38bdf8" size={500} opacity={0.08} />
      <GlowOrb x="60%" y="60%" color="#e879f9" size={400} opacity={0.06} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 10, maxWidth: 480, padding: 24 }}>
        <div style={{ fontSize: 60, marginBottom: 24, display: "inline-block", animation: "spin 2s linear infinite" }}>⚡</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>Analizando tu negocio</h2>
        <p style={{ color: "#64748b", fontSize: 15, marginBottom: 40 }}>La IA está trabajando para ti...</p>
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 24 }}>
          {STEPS.map((s, i) => {
            const done = i < step, active = i === step;
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", opacity: i > step + 1 ? 0.3 : 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? "#4ade8022" : active ? "#38bdf822" : "#1e293b", border: `2px solid ${done ? "#4ade80" : active ? "#38bdf8" : "#1e293b"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>
                  {done ? "✓" : s.icon}
                </div>
                <span style={{ fontSize: 14, color: done ? "#4ade80" : active ? "#e2e8f0" : "#475569", fontWeight: active ? 600 : 400 }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────

function ResultsScreen({ data, url, onReset }) {
  const [tab, setTab] = useState("overview");
  const tabs = [["overview", "📊 Overview"], ["posts", "📱 Posts"], ["seo", "✍️ SEO"], ["directorios", "📂 Directorios"]];

  return (
    <div style={{ minHeight: "100vh", background: "#050a14", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#0a1628", borderBottom: "1px solid #1e293b", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <svg width="200" height="52" viewBox="0 0 520 140" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pg3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7B61FF"/>
                <stop offset="100%" stopColor="#00C2FF"/>
              </linearGradient>
            </defs>
            <path d="M70 15 C45 15 25 35 25 60 C25 85 70 125 70 125 C70 125 115 85 115 60 C115 35 95 15 70 15 Z" fill="url(#pg3)"/>
            <path d="M70 85 C60 85 52 78 52 70" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.6"/>
            <path d="M70 85 C80 85 88 78 88 70" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.6"/>
            <circle cx="70" cy="85" r="5" fill="white"/>
            <polygon points="70,2 58,22 82,22" fill="#9B6FFF"/>
            <rect x="64" y="18" width="12" height="18" fill="#9B6FFF" rx="2"/>
            <text x="130" y="82" fontFamily="Arial Black, sans-serif" fontSize="56" fontWeight="900" fill="white" letterSpacing="4">CAEVIK</text>
            <line x1="130" y1="100" x2="150" y2="100" stroke="#94a3b8" strokeWidth="1.5"/>
            <text x="158" y="104" fontFamily="Arial, sans-serif" fontSize="13" fill="#94a3b8" letterSpacing="3">AI · TRAFFIC · AGENT</text>
            <line x1="380" y1="100" x2="400" y2="100" stroke="#94a3b8" strokeWidth="1.5"/>
          </svg>
          </div>
          <div style={{ fontSize: 13, color: "#64748b" }}>Plan generado para: <span style={{ color: "#38bdf8" }}>{url}</span></div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={onReset} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #1e293b", borderRadius: 8, color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>← Nuevo análisis</button>
          <button style={{ padding: "10px 20px", background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Upgrade a Growth $99 →</button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 32, background: "#0f172a", borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: "10px 18px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", background: tab === id ? "linear-gradient(135deg, #38bdf8, #818cf8)" : "transparent", color: tab === id ? "#fff" : "#64748b" }}>{label}</button>
          ))}
        </div>

        {tab === "overview" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Tráfico estimado", value: `${data.traficoEstimado?.min?.toLocaleString()}–${data.traficoEstimado?.max?.toLocaleString()}`, sub: data.traficoEstimado?.periodo, color: "#38bdf8" },
                { label: "Nivel competencia", value: data.competencia?.nivel, sub: "en tu nicho", color: "#f59e0b" },
                { label: "Potencial", value: data.potencialCrecimiento, sub: "de crecimiento", color: "#4ade80" },
                { label: "Posts generados", value: data.posts?.length, sub: "listos para publicar", color: "#e879f9" },
              ].map(({ label, value, sub, color }) => (
                <div key={label} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 12, color: "#64748b", letterSpacing: 0.5, marginBottom: 8 }}>{label.toUpperCase()}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color, marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 24 }}>
                <ScoreRing score={data.scoreSEO} />
                <div style={{ textAlign: "center", fontSize: 13, color: "#64748b" }}>Oportunidad: <span style={{ color: "#4ade80" }}>{data.competencia?.oportunidad}</span></div>
              </div>
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 16 }}>⚡ ACCIONES INMEDIATAS</div>
                {data.accionesInmediatas?.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "#38bdf8", fontFamily: "monospace", fontSize: 12, marginTop: 2, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 16 }}>🔑 KEYWORDS PRIMARIAS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {data.keywordsPrimarias?.map(kw => <Tag key={kw} color="#38bdf8">{kw}</Tag>)}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>🎯 LONG TAIL</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {data.keywordsLongTail?.map(kw => <Tag key={kw} color="#818cf8">{kw}</Tag>)}
              </div>
            </div>
          </div>
        )}

        {tab === "posts" && (
          <div style={{ display: "grid", gap: 16, animation: "fadeIn 0.4s ease" }}>
            {data.posts?.map((post, i) => (
              <div key={i} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Tag color={post.red === "Instagram" ? "#e879f9" : "#38bdf8"}>{post.red}</Tag>
                    <Tag color="#64748b">{post.tipo}</Tag>
                  </div>
                  <span style={{ fontSize: 12, color: "#475569", fontFamily: "monospace" }}>POST {String(i + 1).padStart(2, "0")}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{post.titulo}</div>
                <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 14, background: "#0a1628", borderRadius: 10, padding: 16 }}>{post.caption}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {post.hashtags?.map(h => <span key={h} style={{ fontSize: 12, color: "#38bdf8" }}>{h}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "seo" && (
          <div style={{ display: "grid", gap: 16, animation: "fadeIn 0.4s ease" }}>
            {data.articulosSEO?.map((art, i) => (
              <div key={i} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace", marginBottom: 8 }}>ARTÍCULO {i + 1} · /{art.slug}</div>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: "#38bdf8" }}>{art.titulo}</div>
                <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 16, fontStyle: "italic" }}>{art.metaDescription}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {art.palabrasClave?.map(kw => <Tag key={kw} color="#4ade80">{kw}</Tag>)}
                </div>
                <div style={{ borderTop: "1px solid #1e293b", paddingTop: 14 }}>
                  <div style={{ fontSize: 12, color: "#475569", marginBottom: 10 }}>ESTRUCTURA DEL ARTÍCULO</div>
                  {art.estructura?.map((h, j) => (
                    <div key={j} style={{ fontSize: 13, color: "#64748b", padding: "5px 0" }}>{h}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "directorios" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>Directorios donde tu negocio debe aparecer para generar tráfico orgánico:</div>
              <div style={{ display: "grid", gap: 12 }}>
                {data.directorios?.map((dir, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#0a1628", borderRadius: 10, border: "1px solid #1e293b" }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{dir.nombre}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{dir.url}</div>
                    </div>
                    <Tag color={dir.prioridad === "Alta" ? "#4ade80" : "#f59e0b"}>{dir.prioridad}</Tag>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #38bdf811, #818cf811)", border: "1px solid #38bdf822", borderRadius: 16, padding: 24, textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>¿Quieres que lo hagamos automáticamente?</div>
              <div style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>Con Growth, registramos tu negocio en todos los directorios automáticamente cada mes.</div>
              <button style={{ padding: "14px 32px", background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Activar Growth por $99/mes →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [screen, setScreen] = useState("landing");
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const handleFormSubmit = async (data) => {
    setFormData(data);
    setLoading(true);
    setScreen("loading");
    setLoadingStep(0);

    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      setLoadingStep(step);
      if (step >= STEPS.length - 1) clearInterval(intervalRef.current);
    }, 900);

    try {
      // Llamada al backend seguro — la API key nunca sale del servidor
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      clearInterval(intervalRef.current);
      setLoadingStep(STEPS.length);

      if (res.ok) {
        const plan = await res.json();
        setResult(plan);
        setScreen("results");
      } else {
        const err = await res.json();
        console.error("API error:", err);
        alert("Error generando el plan. Verifica tu API key en las variables de entorno de Vercel.");
        setScreen("form");
      }
    } catch (err) {
      clearInterval(intervalRef.current);
      console.error("Error:", err);
      alert("Error de conexión. Intenta de nuevo.");
      setScreen("form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>CAEVIK — AI Traffic Agent</title>
        <meta name="description" content="CAEVIK es el agente de IA que hace que tu negocio sea encontrado. SEO automático, posts para redes sociales y más." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      </Head>

      {screen === "landing" && <LandingScreen onStart={() => setScreen("form")} />}
      {screen === "form" && <FormScreen onSubmit={handleFormSubmit} loading={loading} />}
      {screen === "loading" && <LoadingScreen step={loadingStep} />}
      {screen === "results" && <ResultsScreen data={result} url={formData?.url} onReset={() => setScreen("form")} />}
    </>
  );
}
