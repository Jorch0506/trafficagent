// pages/index.js
// Consume el stream SSE de Claude — el plan aparece progresivamente

import { useState, useRef } from "react";
import Head from "next/head";
import { useAuth } from "../hooks/useAuth";
import { AuthModal } from "../components/AuthModal";
import { LoadingState, STEPS } from "../components/LoadingState";
import { LandingScreen } from "../components/LandingScreen";
import { GeneratorForm } from "../components/GeneratorForm";
import { ResultsPanel } from "../components/ResultsPanel";
import { DashboardHome } from "../components/DashboardHome";
import { OnboardingTooltip } from "../components/OnboardingTooltip";

const ERRORS = {
  LIMIT_REACHED: (plan, limit) => ({
    title: "Límite del mes alcanzado",
    message: `Has usado tus ${limit} análisis del plan ${plan}. Haz upgrade para continuar.`,
    cta: { label: "Ver planes de upgrade", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
  }),
  API_ERROR: {
    title: "Error al generar el plan",
    message: "Algo salió mal de nuestro lado. Intenta de nuevo en un momento.",
  },
  NETWORK_ERROR: {
    title: "Sin conexión",
    message: "Verifica tu conexión a internet e intenta de nuevo.",
  },
  AUTH_ERROR: {
    title: "Sesión expirada",
    message: "Tu sesión expiró. Vuelve a iniciar sesión para continuar.",
  },
};

export default function Home() {
  const [screen, setScreen] = useState("landing");
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [savedUrl, setSavedUrl] = useState(null);
  const [initialUrl, setInitialUrl] = useState("");
  const [formError, setFormError] = useState(null);
  const [streamText, setStreamText] = useState("");
  const intervalRef = useRef(null);

  const { user, userData, userPlan, logout, onboardingDone, markOnboardingComplete } = useAuth();

  const handleFormSubmit = async (data) => {
    setFormData(data);
    setFormError(null);
    setStreamText("");
    setLoading(true);
    setScreen("loading");
    setLoadingStep(0);

    // Avanzar pasos del loading mientras llega el stream
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      setLoadingStep(step);
      if (step >= STEPS.length - 1) clearInterval(intervalRef.current);
    }, 4000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: user?.id }),
      });

      // Si la respuesta no es stream (error HTTP antes del stream)
      if (!res.ok) {
        clearInterval(intervalRef.current);
        const err = await res.json();
        setScreen("form");
        setLoading(false);
        if (err.error === "limite_alcanzado") {
          setFormError(ERRORS.LIMIT_REACHED(err.plan, err.limit));
        } else if (err.error === "Error consultando usuario") {
          setFormError(ERRORS.AUTH_ERROR);
        } else {
          setFormError(ERRORS.API_ERROR);
        }
        return;
      }

      // Leer el stream SSE
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          try {
            const event = JSON.parse(raw);

            if (event.type === "chunk") {
              // Acumular texto del stream para mostrar progreso
              setStreamText(prev => prev + event.text);
            }

            if (event.type === "done") {
              // Plan completo recibido
              clearInterval(intervalRef.current);
              setLoadingStep(STEPS.length);
              setResult(event.plan);
              setSavedUrl(data.url);
              setScreen("results");
              setLoading(false);
              return;
            }

            if (event.type === "error") {
              clearInterval(intervalRef.current);
              setScreen("form");
              setLoading(false);
              setFormError(ERRORS.API_ERROR);
              return;
            }
          } catch {
            // Ignorar líneas no parseables
          }
        }
      }
    } catch {
      clearInterval(intervalRef.current);
      setScreen("form");
      setLoading(false);
      setFormError(ERRORS.NETWORK_ERROR);
    }
  };

  const handleLogout = async () => {
    await logout();
    setScreen("landing");
    setResult(null);
    setSavedUrl(null);
    setFormError(null);
    setStreamText("");
  };

  const handleViewPlan = (id, planData) => {
    setResult(planData);
    setSavedUrl(planData?.site_url || "");
    setScreen("results");
  };

  return (
    <>
      <Head>
        <title>CAEVIK — AI Traffic Agent</title>
        <meta name="description" content="CAEVIK es el agente de IA que hace que tu negocio sea encontrado." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      </Head>

      {!onboardingDone && user && (
        <OnboardingTooltip
          userId={user.id}
          onComplete={markOnboardingComplete}
        />
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => {
            setShowAuth(false);
            if (result) setScreen("results");
          }}
        />
      )}

      {user && screen === "landing" && (
        <DashboardHome
          user={user}
          userData={userData}
          onStart={() => setScreen("form")}
          onLogout={handleLogout}
          onViewPlan={handleViewPlan}
          onAnalyzeSite={(url) => { setInitialUrl(url); setScreen("form"); }}
        />
      )}

      {!user && screen === "landing" && (
        <LandingScreen
          onStart={() => setScreen("form")}
          user={user}
          userPlan={userPlan}
          onLogout={handleLogout}
          onShowAuth={() => setShowAuth(true)}
        />
      )}

      {screen === "form" && (
        <GeneratorForm
          initialUrl={initialUrl}
          onBack={() => { setInitialUrl(""); setScreen("landing"); }}
          user={user}
          onSubmit={handleFormSubmit}
          loading={loading}
          error={formError}
          onClearError={() => setFormError(null)}
        />
      )}

      {screen === "loading" && (
        <LoadingState step={loadingStep} streamText={streamText} userPlan={userPlan} />
      )}

      {screen === "results" && (
        <ResultsPanel
          data={result}
          url={savedUrl || formData?.url}
          onReset={() => setScreen("landing")}
          user={user}
          userPlan={userPlan}
          onShowAuth={() => setShowAuth(true)}
        />
      )}
    </>
  );
}
