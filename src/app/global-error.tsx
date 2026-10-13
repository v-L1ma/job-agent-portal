"use client";

import { useEffect } from "react";

/**
 * Erro fatal: substitui o root layout, por isso renderiza <html>/<body> ele mesmo.
 * Estilos via inline style pois o globals.css (carregado pelo layout raixo)
 * não está disponível neste nível.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          backgroundColor: "#ffffff",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
          color: "#010101",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div style={{ width: "100%", maxWidth: "448px", textAlign: "center" }}>
          <div
            style={{
              margin: "0 auto 32px",
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              border: "1px solid #fecaca",
              backgroundColor: "#fef2f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>

          <p
            style={{
              margin: "0 0 12px",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#ef4444",
            }}
          >
            Erro fatal
          </p>

          <h1
            style={{
              margin: "0 0 12px",
              fontSize: "30px",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
            }}
          >
            Ocorreu um erro inesperado
          </h1>

          <p
            style={{
              margin: "0 0 24px",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.6,
              color: "#52525b",
            }}
          >
            Não foi possível iniciar a aplicação. Tente novamente — se o problema persistir,
            contate o suporte.
          </p>

          {error?.digest ? (
            <p
              style={{
                margin: "0 0 24px",
                padding: "8px 12px",
                borderRadius: "12px",
                border: "1px solid #e4e4e7",
                backgroundColor: "#fafafa",
                fontSize: "11px",
                color: "#52525b",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              {error.digest}
            </p>
          ) : null}

          <button
            type="button"
            onClick={reset}
            style={{
              height: "48px",
              padding: "0 32px",
              borderRadius: "9999px",
              border: "none",
              backgroundColor: "#2EAF92",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 10px 15px -3px rgba(46, 175, 146, 0.2)",
            }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
