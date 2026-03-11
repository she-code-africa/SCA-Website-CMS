"use client";

import { useEffect } from "react";

// 🚀 Force dynamic rendering – no static generation for this route
export const dynamic = "force-dynamic";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Something went wrong!</h2>
          <button
            onClick={() => reset()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
