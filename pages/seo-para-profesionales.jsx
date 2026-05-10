// pages/seo-para-profesionales.jsx
// Landing SEO optimizada — SEO para Profesionales

import Head from "next/head";
import { useRouter } from "next/router";

const FAQS = [{"q": "¿Funciona para profesionales independientes sin sitio web?", "a": "CAEVIK genera el plan de contenido y keywords. Para implementarlo completamente, recomendamos tener al menos un sitio web básico o perfil de Google My Business."}, {"q": "¿Qué profesionales pueden usar CAEVIK?", "a": "Médicos, dentistas, psicólogos, abogados, contadores, arquitectos, coaches, consultores, nutriólogos, fisioterapeutas y cualquier profesional de servicios."}, {"q": "¿Viola la ética médica o legal hacer marketing digital?", "a": "CAEVIK genera contenido educativo e informativo, que está permitido para profesionales de la salud y legal. No genera contenido promocional agresivo."}, {"q": "¿Funciona para clínicas con varios especialistas?", "a": "Sí. El plan Agency permite analizar hasta 10 sitios simultáneamente, ideal para clínicas con múltiples especialidades."}];

const BENEFITS = [{"icon": "🩺", "title": "Keywords de tu especialidad", "desc": "Las búsquedas exactas que hacen tus clientes: 'médico [especialidad] en [ciudad]', 'abogado [tipo] precio'."}, {"icon": "📝", "title": "Artículos de autoridad", "desc": "12 artículos que demuestran tu expertise y posicionan tu sitio en Google para consultas de tu especialidad."}, {"icon": "📍", "title": "SEO local", "desc": "Optimización para aparecer en búsquedas locales: Google My Business, directorios profesionales y búsquedas por ciudad."}, {"icon": "📱", "title": "Contenido educativo", "desc": "Posts para Instagram y Facebook que educan a tus pacientes o clientes y generan confianza antes de la consulta."}, {"icon": "⭐", "title": "Directorios profesionales", "desc": "Los directorios específicos de tu profesión: Doctoralia, Jurídico.mx, LinkedIn y más."}, {"icon": "⚡", "title": "Sin agencias costosas", "desc": "Un plan de marketing digital completo por la fracción del costo de una agencia tradicional."}];

export default function Page() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Cómo Conseguir Clientes Online — SEO para Profesionales — CAEVIK</title>
        <meta name="description" content="Genera tu plan de tráfico orgánico como médico, abogado, consultor o coach en 60 segundos. Aparece primero en Google cuando tus clientes te buscan." />
        <meta property="og:title" content="Cómo Conseguir Clientes Online — SEO para Profesionales — CAEVIK" />
        <meta property="og:description" content="Genera tu plan de tráfico orgánico como médico, abogado, consultor o coach en 60 segundos. Aparece primero en Google cuando tus clientes te buscan." />
        <meta property="og:url" content="https://www.caevik.com/seo-para-profesionales" />
        <meta property="og:image" content="https://www.caevik.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.caevik.com/seo-para-profesionales" />
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

        <nav style={{ padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
          <a href="/" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#38bdf8", textDecoration: "none" }}>CAEVIK</a>
          <a href="/" style={{ padding: "10px 24px", background: "linear-gradient(135deg, #38bdf8, #818cf8)", borderRadius: 8, color: "#03060f", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Empezar gratis →</a>
        </nav>

        <section style={{ maxWidth: 800, margin: "0 auto", padding: "80px 48px 60px", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 999, padding: "5px 16px", marginBottom: 28, fontSize: 12, fontWeight: 600, color: "#4ade80", letterSpacing: 1.5, textTransform: "uppercase" }}>
            SEO para Profesionales
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: -2, lineHeight: 1.05, marginBottom: 24 }}>
            Que tus clientes te encuentren en Google
          </h1>
          <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.8, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
            Médicos, abogados, consultores y coaches — tus clientes te buscan en Google antes de contactarte. CAEVIK genera tu plan de posicionamiento completo en 60 segundos.
          </p>
          <button
            onClick={() => router.push("/")}
            style={{ padding: "16px 48px", background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", borderRadius: 10, color: "#03060f", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 0 32px rgba(56,189,248,0.25)" }}
          >
            Generar plan para mi consulta →
          </button>
          <p style={{ fontSize: 13, color: "#1e293b", marginTop: 12 }}>Gratis · Sin tarjeta · En 60 segundos</p>
        </section>

        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 80px" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, textAlign: "center", marginBottom: 48, letterSpacing: -1 }}>
            Todo lo que necesitas para que te encuentren
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

        <section style={{ maxWidth: 700, margin: "0 auto", padding: "0 48px 100px", textAlign: "center" }}>
          <div style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 20, padding: "48px 40px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 16, letterSpacing: -1 }}>
              ¿Listo para generar tráfico orgánico?
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", marginBottom: 32, lineHeight: 1.7 }}>
              El plan Free es permanentemente gratuito. Sin tarjeta requerida.
            </p>
            <button
              onClick={() => router.push("/")}
              style={{ padding: "14px 40px", background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", borderRadius: 10, color: "#03060f", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              Empezar gratis →
            </button>
          </div>
        </section>

        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "24px 48px", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#1e293b", margin: 0 }}>© 2026 CAEVIK · <a href="/" style={{ color: "#334155", textDecoration: "none" }}>caevik.com</a></p>
        </footer>
      </div>
    </>
  );
}
