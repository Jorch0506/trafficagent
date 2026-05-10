// pages/seo-para-tiendas-online.jsx
// Landing SEO optimizada — SEO para E-commerce

import Head from "next/head";
import { useRouter } from "next/router";

const FAQS = [{"q": "¿Funciona para tiendas Shopify, WooCommerce o propias?", "a": "Sí. CAEVIK analiza la URL de tu tienda independientemente de la plataforma que uses."}, {"q": "¿Cuánto tiempo tarda en verse el tráfico orgánico?", "a": "Las primeras mejoras son visibles en 4-8 semanas. El tráfico orgánico sólido se construye en 3-6 meses con implementación consistente."}, {"q": "¿Funciona para cualquier categoría de productos?", "a": "Sí. Ropa, electrónica, alimentos, artesanías, cosméticos — CAEVIK detecta tu nicho y genera el plan específico para tus productos."}, {"q": "¿Necesito un blog para implementar el plan SEO?", "a": "No es obligatorio, pero sí muy recomendable. Los artículos SEO generados pueden publicarse en un blog de tu tienda para atraer tráfico editorial."}];

const BENEFITS = [{"icon": "🛒", "title": "Keywords de compra", "desc": "Las palabras que usan tus clientes cuando están listos para comprar: 'comprar [producto] online', 'precio [producto] México'."}, {"icon": "📱", "title": "Posts para redes sociales", "desc": "25 posts con captions optimizados para Instagram y Facebook. Diseñados para generar tráfico a tu tienda."}, {"icon": "✍️", "title": "Artículos SEO de producto", "desc": "12 artículos optimizados: guías de compra, comparativas y reseñas que posicionan tu tienda en Google."}, {"icon": "📂", "title": "Directorios de e-commerce", "desc": "Google Shopping, Mercado Libre, Amazon, directorios de tiendas y marketplaces donde debes aparecer."}, {"icon": "🔑", "title": "Long tail keywords", "desc": "Keywords específicas con menos competencia y mayor intención de compra para tu categoría de productos."}, {"icon": "⚡", "title": "Plan en 60 segundos", "desc": "Ingresa la URL de tu tienda y recibe tu estrategia completa al instante. Sin técnicos, sin agencias."}];

export default function Page() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Cómo Generar Tráfico Orgánico para tu Tienda Online — CAEVIK</title>
        <meta name="description" content="Genera el plan de tráfico orgánico para tu tienda online en 60 segundos. Keywords, posts para redes y artículos SEO para vender más. Gratis." />
        <meta property="og:title" content="Cómo Generar Tráfico Orgánico para tu Tienda Online — CAEVIK" />
        <meta property="og:description" content="Genera el plan de tráfico orgánico para tu tienda online en 60 segundos. Keywords, posts para redes y artículos SEO para vender más. Gratis." />
        <meta property="og:url" content="https://www.caevik.com/seo-para-tiendas-online" />
        <meta property="og:image" content="https://www.caevik.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.caevik.com/seo-para-tiendas-online" />
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
          <div style={{ display: "inline-block", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 999, padding: "5px 16px", marginBottom: 28, fontSize: 12, fontWeight: 600, color: "#38bdf8", letterSpacing: 1.5, textTransform: "uppercase" }}>
            SEO para E-commerce
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: -2, lineHeight: 1.05, marginBottom: 24 }}>
            Genera más ventas con tráfico orgánico gratuito
          </h1>
          <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.8, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
            El 68% de las compras online empiezan con una búsqueda en Google. CAEVIK genera tu estrategia de SEO completa en 60 segundos — sin agencias, sin costo mensual.
          </p>
          <button
            onClick={() => router.push("/")}
            style={{ padding: "16px 48px", background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", borderRadius: 10, color: "#03060f", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 0 32px rgba(56,189,248,0.25)" }}
          >
            Generar plan para mi tienda →
          </button>
          <p style={{ fontSize: 13, color: "#1e293b", marginTop: 12 }}>Gratis · Sin tarjeta · En 60 segundos</p>
        </section>

        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 80px" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, textAlign: "center", marginBottom: 48, letterSpacing: -1 }}>
            Todo lo que necesitas para vender más sin pagar publicidad
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
