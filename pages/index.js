// pages/index.js
// Punto de entrada principal — orquesta las pantallas y el estado global

import { useState, useRef } from "react";
import Head from "next/head";
import { useAuth } from "../hooks/useAuth";
import { AuthModal } from "../components/AuthModal";
import { LoadingState, STEPS } from "../components/LoadingState";
import { LandingScreen } from "../components/LandingScreen";
import { GeneratorForm } from "../components/GeneratorForm";
import { ResultsPanel } from "../components/ResultsPanel";

export default function Home() {
  const [screen, setScreen] = useState("landing");
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const intervalRef = useRef(null);

  const { user, userPlan, logout } = useAuth();

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
    }, 3500);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: user?.id }),
      });
      clearInterval(intervalRef.current);
      setLoadingStep(STEPS.length);
      if (res.ok) {
        const plan = await res.json();
        setResult(plan);
        setScreen("results");
      } else {
        const err = await res.json();
        if (err.error === "limite_alcanzado") {
          alert(`Has alcanzado tu límite de ${err.limit} análisis en tu plan ${err.plan}. Haz upgrade para continuar.`);
          setScreen("landing");
        } else {
          alert("Error generando el plan. Verifica tu API key en Vercel.");
          setScreen("form");
        }
      }
    } catch {
      clearInterval(intervalRef.current);
      alert("Error de conexión. Intenta de nuevo.");
      setScreen("form");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setScreen("landing");
  };

  return (
    <>
      <Head>
        <title>CAEVIK — AI Traffic Agent</title>
        <meta name="description" content="CAEVIK es el agente de IA que hace que tu negocio sea encontrado." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      </Head>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => {
            setShowAuth(false);
            if (result) setScreen("results");
          }}
        />
      )}

      {screen === "landing" && (
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
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      )}

      {screen === "loading" && (
        <LoadingState step={loadingStep} />
      )}

      {screen === "results" && (
        <ResultsPanel
          data={result}
          url={formData?.url}
          onReset={() => setScreen("form")}
          user={user}
          userPlan={userPlan}
          onShowAuth={() => setShowAuth(true)}
        />
      )}
    </>
  );
}
