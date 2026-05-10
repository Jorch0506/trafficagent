// pages/success.js
// Página de confirmación post-pago
// Muestra el plan activado con features reales y CTA al generador

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { LogoSVG } from "../components/LogoSVG";

const PLAN_DETAILS = {
  starter: {
    name: "Starter",
    color: "#38bdf8",
    emoji: "🚀",
    tagline: "Ya puedes generar hasta 20 planes de tráfico al mes.",
    features: [
      "20 análisis/mes",
      "10 posts listos para publicar",
      "5 artículos SEO con estructura",
      "5 directorios relevantes por análisis",
      "5 keywords primarias + 3 long tail",
      "Soporte por email",
    ],
  },
  growth: {
    name: "Growth",
    color: "#f59e0b",
    emoji: "📈",
    tagline: "Escala tu tráfico orgánico con 60 análisis al mes y 3 sitios.",
    features: [
      "60 análisis/mes",
      "25 posts listos para publicar",
      "12 artículos SEO con estructura",
      "15 directorios relevantes por análisis",
      "3 sitios web simultáneos",
      "10 keywords primarias + 8 long tail",
      "Soporte prioritario",
    ],
  },
  agency: {
    name: "Agency",
    color: "#e879f9",
    emoji: "🏆",
    tagline: "Gestiona hasta 10 sitios con 100 análisis al mes.",
    features: [
      "100 análisis/mes",
      "25 posts listos por análisis",
      "12 artículos SEO por análisis",
      "20 directorios por análisis",
      "10 sitios web simultáneos",
      "Manager dedicado",
      "API access — próximamente",
    ],
  },
};

function GlowOrb({ x, y, color = "#38bdf8", size = 300, opacity = 0.12 }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, opacity, filter: `blur(${size * 0.4}px)`, pointerEvents: "none", zIndex: 0 }} />
  );
}

export default function Success() {
  const router = useRouter();
  const { plan } = router.query;
  const [details, setDetails] = useState(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (plan && PLAN_DETAILS[plan]) {
      setDetails(PLAN_DETAILS[plan]);
    }
  }, [plan]);

  useEffect(() => {
    if (!details) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [details]);

  const planColor = details?.color || "#38bdf8";

  return (
    <>
      <Head>
        <title>¡Bienvenido a CAEVIK {details?.name || ""}!</title>
        <meta name="description" content="Tu plan está activo. Empieza a generar tráfico orgánico ahora." />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-6)", position: "relative", overflow: "hidden" }}>
        <GlowOrb x="-100px" y="-100px" color={planColor} size={500} opacity={0.08} />
        <GlowOrb x="60%" y="60%" color="var(--brand-secondary)" size={400} opacity={0.05} />

        <div style={{ maxWidth: 520, width: "100%", textAlign: "center", position: "relative", zIndex: 10 }}>

          {/* Logo */}
          <div style={{ marginBottom: "var(--space-8)" }}>
            <LogoSVG id="success-logo" width={200} height={52} />
          </div>

          {/* Icono de éxito */}
          <div style={{ fontSize: 64, marginBottom: "var(--space-5)" }}>
            {details?.emoji || "🎉"}
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-3xl)", marginBottom: "var(--space-3)", letterSpacing: -1 }}>
            ¡Pago exitoso!
          </h1>

          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-base)", marginBottom: "var(--space-8)", lineHeight: 1.6 }}>
            {details?.tagline || "Tu plan está activo. Empieza a generar tráfico orgánico ahora mismo."}
          </p>

          {/* Card del plan activado — sin precio */}
          {details && (
            <div style={{ background: "var(--bg-surface)", border: `1px solid ${planColor}44`, borderRadius: "var(--radius-xl)", padding: "var(--space-6)", marginBottom: "var(--space-6)", boxShadow: `0 0 40px ${planColor}18`, textAlign: "left" }}>
              <div style={{ marginBottom: "var(--space-5)" }}>
                <div style={{ fontSize: "var(--text-xs)", color: planColor, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: "var(--space-1)" }}>
                  PLAN ACTIVADO
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", color: planColor }}>
                  {details.name}
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${planColor}22`, paddingTop: "var(--space-4)" }}>
                {details.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", marginBottom: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                    <span style={{ color: planColor, flexShrink: 0 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA principal */}
          <button
            onClick={() => router.push("/")}
            style={{ width: "100%", padding: "16px", background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-lg)", color: "#fff", fontWeight: 700, fontSize: "var(--text-lg)", cursor: "pointer", fontFamily: "var(--font-sans)", marginBottom: "var(--space-4)", boxShadow: "0 0 40px #38bdf844" }}
          >
            Hacer mi primer análisis →
          </button>

          {/* Countdown */}
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-disabled)" }}>
            Redirigiendo automáticamente en {countdown} segundos...
          </p>

          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-disabled)", marginTop: "var(--space-4)" }}>
            Recibirás un email de confirmación en breve. Dudas: hola@caevik.com
          </p>

        </div>
      </div>
    </>
  );
}
