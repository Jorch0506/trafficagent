// components/ExportPDFButton.jsx
// Botón de exportación PDF con diseño premium CAEVIK
// Usa hook useExportPDF — premium para pagados, básico para free

import { useState } from "react";
import { useExportPDF } from "../hooks/useExportPDF";

export default function ExportPDFButton({
  planData,
  siteUrl,
  userPlan = "free",
  className = "",
  size = "default", // "default" | "sm" | "lg"
}) {
  const { exportPDF, exporting, error } = useExportPDF();
  const [success, setSuccess] = useState(false);

  const isPremium = userPlan !== "free";

  const handleExport = async () => {
    if (exporting) return;
    setSuccess(false);

    const result = await exportPDF({ planData, siteUrl, plan: userPlan });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  // Sizes
  const sizeStyles = {
    sm: { padding: "6px 14px", fontSize: "12px", gap: "6px" },
    default: { padding: "10px 20px", fontSize: "13px", gap: "8px" },
    lg: { padding: "14px 28px", fontSize: "14px", gap: "10px" },
  }[size] || {};

  const iconSize = size === "sm" ? "14px" : size === "lg" ? "18px" : "16px";

  // Estado del botón
  const getButtonContent = () => {
    if (exporting) {
      return (
        <>
          <SpinnerIcon size={iconSize} />
          <span>Generando PDF…</span>
        </>
      );
    }
    if (success) {
      return (
        <>
          <CheckIcon size={iconSize} />
          <span>¡Descargado!</span>
        </>
      );
    }
    return (
      <>
        {isPremium ? <StarIcon size={iconSize} /> : <DownloadIcon size={iconSize} />}
        <span>{isPremium ? "Exportar PDF Premium" : "Exportar PDF"}</span>
        {isPremium && <PremiumBadge />}
      </>
    );
  };

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    cursor: exporting ? "wait" : "pointer",
    fontWeight: 600,
    borderRadius: "8px",
    transition: "all 0.2s ease",
    border: "1px solid",
    fontFamily: "inherit",
    letterSpacing: "-0.2px",
    position: "relative",
    overflow: "hidden",
    ...sizeStyles,
  };

  const premiumStyle = {
    ...baseStyle,
    background: success
      ? "rgba(16,185,129,0.15)"
      : exporting
      ? "rgba(124,58,237,0.15)"
      : "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(79,70,229,0.15) 100%)",
    borderColor: success
      ? "rgba(16,185,129,0.3)"
      : exporting
      ? "rgba(124,58,237,0.3)"
      : "rgba(124,58,237,0.4)",
    color: success ? "#34d399" : exporting ? "#a78bfa" : "#a78bfa",
    boxShadow: success
      ? "0 0 20px rgba(16,185,129,0.15)"
      : "0 0 20px rgba(124,58,237,0.1)",
  };

  const freeStyle = {
    ...baseStyle,
    background: success
      ? "rgba(16,185,129,0.1)"
      : "rgba(255,255,255,0.05)",
    borderColor: success ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.1)",
    color: success ? "#34d399" : "#94a3b8",
  };

  return (
    <div style={{ display: "inline-block" }} className={className}>
      <button
        onClick={handleExport}
        disabled={exporting}
        style={isPremium ? premiumStyle : freeStyle}
        aria-label={isPremium ? "Exportar plan como PDF premium" : "Exportar plan como PDF"}
      >
        {/* Shimmer effect para premium */}
        {isPremium && !exporting && !success && (
          <span
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.1), transparent)",
              animation: "shimmer 3s infinite",
            }}
          />
        )}
        {getButtonContent()}
      </button>

      {/* Error inline */}
      {error && (
        <p
          style={{
            marginTop: "6px",
            fontSize: "11px",
            color: "#f87171",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>⚠</span> {error}
        </p>
      )}

      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Íconos inline ────────────────────────────────────────────────────────────

function DownloadIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v8M5 7l3 3 3-3M3 13h10" />
    </svg>
  );
}

function StarIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2l1.5 3.5L13 6l-2.5 2.5.5 3.5L8 10.5 5 12l.5-3.5L3 6l3.5-.5L8 2z" />
    </svg>
  );
}

function CheckIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 8l4 4 7-7" />
    </svg>
  );
}

function SpinnerIcon({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <circle cx="8" cy="8" r="6" strokeOpacity="0.2" />
      <path d="M8 2a6 6 0 0 1 6 6" strokeLinecap="round" />
    </svg>
  );
}

function PremiumBadge() {
  return (
    <span
      style={{
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        padding: "2px 6px",
        background: "rgba(124,58,237,0.3)",
        borderRadius: "4px",
        color: "#c4b5fd",
        marginLeft: "2px",
      }}
    >
      HD
    </span>
  );
}
