// src/app/(auth)/layout.tsx
import * as React from "react";

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen w-full">
      {/* Background (matches old style) */}
      <div
        className="absolute inset-0 bg-slate-900 bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: "url(/brand/register_bg_2.png)"
        }}
      />
      <div className="absolute inset-0 bg-slate-900/10" />

      <section className="relative z-10 min-h-screen w-full py-16 md:py-24">
        {children}

        <footer className="mt-10 text-center text-xs text-slate-200/80">
          © {new Date().getFullYear()}
          {" "}
          <a
            href="https://shecodeafrica.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            She Code Africa.
          </a>{" "}
          All rights reserved.
        </footer>
      </section>
    </main>
  );
}
