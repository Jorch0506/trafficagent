// pages/seo-para-restaurantes.jsx
// Landing SEO optimizada para restaurantes y negocios locales
// Keyword principal: "posicionar restaurante en Google"

import Head from "next/head";
import { useRouter } from "next/router";

const FAQS = [
  {
    q: "¿Cuánto tarda en aparecer mi restaurante en Google?",
    a: "Con CAEVIK generas tu plan de tráfico en 60 segundos. Implementar las acciones recomendadas típicamente genera resultados visibles en Google entre 4 y 12 semanas.",
  },
  {
    q: "¿Necesito conocimientos de SEO para usar CAEVIK?",
    a: "No. CAEVIK genera el plan completo con instrucciones específicas para tu restaurante: qué publicar, dónde registrarte y qué keywords usar. Sin tecnicismos.",
  },
  {
    q: "¿Funciona para cualquier tipo de restaurante?",
    a: "Sí. Funciona para taquerías, restaurantes de comida corrida, fine dining, cafeterías, fondas, dark kitchens y cualquier negocio de alimentos y bebidas.",
  },
  {
    q: "¿Qué incluye el plan de tráfico para mi restaurante?",
    a: "Keywords específicas para tu tipo de cocina y zona, posts listos para Instagram y Facebook, artículos SEO para tu blog, directorios donde debes aparecer (Google My Business, Yelp, TripAdvisor) y acciones inmediatas prioritarias.",
  },
];

const BENEFITS = [
  { icon: "📍", title: "Aparece en búsquedas locales", desc: "Cuando alguien busca 'tacos cerca de mí' o 'restaurante italiano en [ciudad]', tu negocio aparece primero." },
  { icon: "📱", title: "Posts listos para publicar", desc: "25 posts con captions y hashtags optimizados para Instagram y Facebook. Solo copiar y pegar." },
  { icon: "📂", title: "Directorios relevantes", desc: "Google My Business, TripAdvisor, Yelp, Foursquare y 16 directorios más donde tu restaurante debe aparecer." },
  { icon: "✍️", title: "Artículos SEO para tu blog", desc: "12 artículos optimizados para posicionarte en Google con keywords como 'mejor restaurante en [ciudad]'." },
  { icon: "🔑", title: "Keywords de tu nicho", desc: "Las palabras exactas que tus clientes buscan en Google para encontrar un restaurante como el tuyo." },
  { icon: "⚡", title: "Plan en 60 segundos", desc: "Ingresa tu URL y en menos de un minuto tienes tu estrategia completa. Sin consultoras. Sin agencias costosas." },
];

export default function SeoRestaurantes() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Cómo Posicionar tu Restaurante en Google — CAEVIK</title>
        <meta name="description" content="Genera el plan de tráfico orgánico para tu restaurante en 60 segundos. Keywords, posts para redes sociales y directorios donde debes aparecer. Gratis." />
        <meta property="og:title" content="Cómo Posicionar tu Restaurante en Google — CAEVIK" />
        <meta property="og:description" content="Plan de SEO completo para restaurantes generado por IA en 60 segundos. Gratis." />
        <meta property="og:url" content="https://www.caevik.com/seo-para-restaurantes" />
        <meta property="og:image" content="https://www.caevik.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.caevik.com/seo-para-restaurantes" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQS.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        })}</script>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ background: "#03060f", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>

        {/* Nav */}
        <nav style={{ padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
          <a href="/" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#38bdf8", textDecoration: "none", letterSpacing: -0.5 }}>CAEVIK</a>
          <a href="/" style={{ padding: "10px 24px", background: "linear-gradient(135deg, #38bdf8, #818cf8)", borderRadius: 8, color: "#03060f", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Empezar gratis →</a>
        </nav>

        {/* Hero */}
        <section style={{ maxWidth: 800, margin: "0 auto", padding: "80px 48px 60px", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 999, padding: "5px 16px", marginBottom: 28, fontSize: 12, fontWeight: 600, color: "#38bdf8", letterSpacing: 1.5, textTransform: "uppercase" }}>
            SEO para Restaurantes
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: -2, lineHeight: 1.05, marginBottom: 24 }}>
            Haz que tu restaurante aparezca primero en Google
          </h1>
          <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.8, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
            El 80% de los clientes busca restaurantes en Google antes de ir. CAEVIK genera tu plan de tráfico orgánico completo en 60 segundos — sin agencias, sin costos mensuales.
          </p>
          <button
            onClick={() => router.push("/?url=&tipo=local")}
            style={{ padding: "16px 48px", background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", borderRadius: 10, color: "#03060f", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 0 32px rgba(56,189,248,0.25)" }}
          >
            Generar plan para mi restaurante →
          </button>
          <p style={{ fontSize: 13, color: "#1e293b", marginTop: 12 }}>Gratis · Sin tarjeta · En 60 segundos</p>
        </section>

        {/* Beneficios */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 80px" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, textAlign: "center", marginBottom: 48, letterSpacing: -1 }}>
            Todo lo que necesitas para llenar tu restaurante
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {BENEFITS.map(b => (
              <div key={b.title} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "28px 24px" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{b.icon}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{b.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Proceso */}
        <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 48px 80px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, marginBottom: 48, letterSpacing: -1 }}>
            3 pasos para posicionar tu restaurante
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { n: "01", title: "Ingresa tu URL", desc: "Escribe la dirección web de tu restaurante y describe brevemente tu tipo de cocina." },
              { n: "02", title: "La IA analiza tu nicho", desc: "CAEVIK analiza tu mercado, competencia y oportunidades en 60 segundos." },
              { n: "03", title: "Implementa el plan", desc: "Recibe keywords, posts y acciones inmediatas para empezar hoy mismo." },
            ].map(s => (
              <div key={s.n} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 28 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, color: "#38bdf8", marginBottom: 12, letterSpacing: -1 }}>{s.n}</div>
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ maxWidth: 700, margin: "0 auto", padding: "0 48px 80px" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, marginBottom: 40, letterSpacing: -1, textAlign: "center" }}>
            Preguntas frecuentes
          </h2>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 24, marginBottom: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 10, color: "#f1f5f9" }}>{faq.q}</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </section>

        {/* CTA Final */}
        <section style={{ maxWidth: 700, margin: "0 auto", padding: "0 48px 100px", textAlign: "center" }}>
          <div style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 20, padding: "48px 40px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 16, letterSpacing: -1 }}>
              ¿Listo para llenar más mesas?
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", marginBottom: 32, lineHeight: 1.7 }}>
              Genera tu plan de tráfico orgánico ahora. El plan Free es permanentemente gratuito.
            </p>
            <button
              onClick={() => router.push("/")}
              style={{ padding: "14px 40px", background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", borderRadius: 10, color: "#03060f", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              Empezar gratis →
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "24px 48px", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#1e293b", margin: 0 }}>© 2026 CAEVIK · <a href="/" style={{ color: "#334155", textDecoration: "none" }}>caevik.com</a></p>
        </footer>
      </div>
    </>
  );
}
