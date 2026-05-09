// pages/index.js
// Punto de entrada principal
// Si el usuario está logueado → muestra DashboardHome
// Si no → muestra LandingScreen

import { useState, useRef } from "react";
import Head from "next/head";
import { useAuth } from "../hooks/useAuth";
import { AuthModal } from "../components/AuthModal";
import { LoadingState, STEPS } from "../components/LoadingState";
import { LandingScreen } from "../components/LandingScreen";
import { GeneratorForm } from "../components/GeneratorForm";
import { ResultsPanel } from "../components/ResultsPanel";
import { DashboardHome } from "../components/DashboardHome";

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
          setScreen(user ? "dashboard" : "landing");
        } else {
          alert("Error generando el plan. Verifica tu API key en Vercel.");
          setScreen(user ? "dashboard" : "form");
        }
      }
    } catch {
      clearInterval(intervalRef.current);
      alert("Error de conexión. Intenta de nuevo.");
      setScreen(user ? "dashboard" : "form");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setScreen("landing");
    setResult(null);
  };

  // Si el usuario está logueado y no está en un flujo activo
  // mostrar el dashboard en lugar de la landing
  const showDashboard = user && screen === "landing";

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

      {/* Dashboard para usuario logueado en pantalla inicial */}
      {showDashboard && (
        <DashboardHome
          user={user}
          userPlan={userPlan}
          onStart={() => setScreen("form")}
          onLogout={handleLogout}
          onShowAuth={() => setShowAuth(true)}
        />
      )}

      {/* Landing para visitantes sin sesión */}
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
          onReset={() => setScreen(user ? "dashboard" : "form")}
          user={user}
          userPlan={userPlan}
          onShowAuth={() => setShowAuth(true)}
        />
      )}
    </>
  );
}
