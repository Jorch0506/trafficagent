// components/Header.jsx
// Navbar con logo, estado de sesión y CTA condicional según plan

import { LogoSVG } from "./LogoSVG";

export function Header({ user, userPlan, onLogout, onStart, onShowAuth }) {
  const getUpgradeCTA = () => {
    if (!user) {
      return (
        <button
          onClick={onShowAuth}
          style={{ background: "transparent", border: "1px solid #1e293b", borderRadius: "var(--radius-sm)", color: "#94a3b8", fontWeight: 600, fontSize: "var(--text-sm)", padding: "10px 20px", cursor: "pointer", fontFamily: "var(--font-sans)" }}
        >
          Iniciar sesión
        </button>
      );
    }
    if (!userPlan || userPlan === "free") {
      return (
        <button
          onClick={() => window.location.href = "/api/checkout?plan=starter"}
          style={{ background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-sm)", color: "#fff", fontWeight: 700, fontSize: "var(--text-sm)", padding: "10px 20px", cursor: "pointer", fontFamily: "var(--font-sans)" }}
        >
          Activar Starter $29 →
        </button>
      );
    }
    if (userPlan === "starter") {
      return (
        <button
          onClick={() => window.location.href = "/api/checkout?plan=growth"}
          style={{ background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-sm)", color: "#fff", fontWeight: 700, fontSize: "var(--text-sm)", padding: "10px 20px", cursor: "pointer", fontFamily: "var(--font-sans)" }}
        >
          Activar Growth $99 →
        </button>
      );
    }
    if (userPlan === "growth") {
      return (
        <button
          onClick={() => window.location.href = "/api/checkout?plan=agency"}
          style={{ background: "var(--gradient-agency)", border: "none", borderRadius: "var(--radius-sm)", color: "#fff", fontWeight: 700, fontSize: "var(--text-sm)", padding: "10px 20px", cursor: "pointer", fontFamily: "var(--font-sans)" }}
        >
          Activar Agency $299 →
        </button>
      );
    }
    return (
      <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", background: "var(--bg-elevated)", padding: "6px 14px", borderRadius: "var(--radius-full)", border: "1px solid var(--bg-border)" }}>
        Plan Agency ✓
      </span>
    );
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 48px", borderBottom: "1px solid #ffffff08", position: "relative", zIndex: 10, flexWrap: "wrap", gap: "var(--space-3)" }}>
      <LogoSVG id="header-logo" width={220} height={56} />
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
        {user && (
          <>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", background: "var(--bg-elevated)", padding: "4px 12px", borderRadius: "var(--radius-full)", border: "1px solid var(--bg-border)" }}>
              {userPlan || "free"}
            </span>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{user.email}</span>
            <button
              onClick={onLogout}
              style={{ background: "transparent", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)", fontSize: "var(--text-sm)", padding: "8px 16px", cursor: "pointer", fontFamily: "var(--font-sans)" }}
            >
              Salir
            </button>
            <button
              onClick={onStart}
              style={{ background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-sm)", color: "#fff", fontWeight: 700, fontSize: "var(--text-sm)", padding: "10px 20px", cursor: "pointer", fontFamily: "var(--font-sans)" }}
            >
              Nuevo análisis →
            </button>
          </>
        )}
        {!user && (
          <>
            {getUpgradeCTA()}
            <button
              onClick={onStart}
              style={{ background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-sm)", color: "#fff", fontWeight: 700, fontSize: "var(--text-sm)", padding: "10px 20px", cursor: "pointer", fontFamily: "var(--font-sans)" }}
            >
              Empezar gratis →
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
