// src/app/(auth)/login/page.tsx
"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { login } from "@/features/auth/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  React.useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (token: string) => {
      // cookie for middleware route-guard
      const expires = rememberMe ? 30 : 7;
      Cookies.set("isLoggedIn", "true", { expires });

      // store token (interceptor reads localStorage)
      localStorage.setItem("token", token);

      // email persistence
      if (rememberMe) localStorage.setItem("rememberedEmail", email);
      else localStorage.removeItem("rememberedEmail");

      toast.success("Signed in successfully");
      router.push("/admin/dashboard");
    },
    onError: (err: any) => {
      const status = err?.response?.status;
      if (status === 401) toast.error("Invalid email or password");
      else toast.error("Login failed. Please try again.");
    }
  });

  const onSubmit = () => {
    if (!email || !password) {
      // validation message can stay inline OR toast — your call.
      toast.warning("Please enter email and password");
      return;
    }
    mutation.mutate({ email, password });
  };

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex items-center justify-center min-h-[75vh]">
        <div className="w-full max-w-md px-2">
          <div className="bg-slate-200 rounded-lg shadow-lg border overflow-hidden">
            <div className="px-6 pt-8">
              <div className="flex justify-center">
                <img
                  src="/brand/sca-logo-white.png"
                  alt="She Code Africa"
                  className="h-24 w-auto"
                />
              </div>
            </div>

            <div className="px-6 py-8">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="block uppercase text-slate-600 text-xs font-bold">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block uppercase text-slate-600 text-xs font-bold">
                    Password
                  </label>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white text-slate-900 pr-10"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((s) => !s)}
                      onMouseDown={(e) => e.preventDefault()}
                      className="absolute inset-y-0 right-3 inline-flex items-center text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="form-checkbox mr-2 h-4 w-4"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      toast.message("Forgot password not implemented yet")
                    }
                    className="text-slate-600 text-sm hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="button"
                  onClick={onSubmit}
                  disabled={mutation.isPending}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white mt-4"
                >
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/register")}
                    className="text-slate-600 text-sm hover:underline"
                  >
                    Create account
                  </button>
                </div>
              </form>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-200/80">
            Admin portal access only.
          </p>
        </div>
      </div>
    </div>
  );
}
