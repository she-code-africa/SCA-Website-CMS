"use client";

// src/app/global-error.tsx
// This file handles catastrophic errors that crash the root layout itself.
// It MUST be completely self-contained — no providers, no context, no useTheme.

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh"
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "0.5rem"
            }}
          >
            Something went wrong
          </h1>
          <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>
            {error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "0.375rem",
              backgroundColor: "#6366f1",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem"
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
