// src/app/(auth)/layout.tsx
import * as React from "react";

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen w-full">
      {/* Background image & overlay */}
      <div
        className="absolute inset-0 bg-slate-900 bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: "url(/brand/register_bg_2.png)"
        }}
      />
      <div className="absolute inset-0 bg-slate-900/10" />

      <section className="relative z-10 flex min-h-screen flex-col justify-between">
        <div className="grow py-16 md:py-24">
          {children}
        </div>

        <footer className="relative pb-6">
          <div className="container mx-auto px-4">
            <hr className="mb-6 border-b border-slate-600" />
            <div className="w-full text-center px-4">
              <div className="text-sm text-slate-500 font-semibold py-1 text-center">
                Copyright © {new Date().getFullYear()}{" "}
                <a
                  href="https://shecodeafrica.org"
                  className="text-white hover:text-slate-300 text-sm font-semibold py-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SheCodeAfrica
                </a>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
