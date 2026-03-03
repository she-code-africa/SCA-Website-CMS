"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import {
  inviteAcceptSchema,
  getPasswordStrength,
  STRENGTH_CONFIG,
  type InviteAcceptInput
} from "@/features/auth/schema/invite.schema";
import {
  verifyInviteToken,
  acceptInvite,
  type InviteTokenStatus
} from "@/features/auth/api/api";

// ─── Password Requirement Row ───────────────────────────────────────────────
function Rule({ met, text }: { met: boolean; text: string }) {
  return (
    <li className="flex items-center gap-1.5 text-[11px]">
      {met ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
      )}
      <span className={met ? "text-slate-700 font-medium" : "text-slate-400"}>
        {text}
      </span>
    </li>
  );
}

// ─── Strength Meter ──────────────────────────────────────────────────────────
function StrengthMeter({ password }: { password: string }) {
  const level = getPasswordStrength(password);
  const cfg = STRENGTH_CONFIG[level];

  return (
    <div className="space-y-1.5 mt-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= level ? cfg.barColor : "bg-slate-100"
            }`}
          />
        ))}
      </div>
      {password && (
        <p
          className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}
        >
          {cfg.label}
        </p>
      )}
    </div>
  );
}

interface Props {
  token: string;
}

export function InviteAcceptanceForm({ token }: Props) {
  const router = useRouter();
  const [tokenStatus, setTokenStatus] =
    React.useState<InviteTokenStatus | null>(null);
  const [verifying, setVerifying] = React.useState(true);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const form = useForm<InviteAcceptInput>({
    resolver: zodResolver(inviteAcceptSchema),
    mode: "onBlur",
    defaultValues: { password: "", confirmPassword: "" }
  });

  const password = form.watch("password");

  React.useEffect(() => {
    async function validate() {
      if (!token) {
        setTokenStatus({
          valid: false,
          expired: false,
          reason: "No token provided."
        });
        setVerifying(false);
        return;
      }
      try {
        const res = await verifyInviteToken(token);
        const data = (res as { data?: InviteTokenStatus }).data ?? res;
        setTokenStatus(data);
      } catch {
        setTokenStatus({
          valid: false,
          expired: false,
          reason: "Verification failed."
        });
      } finally {
        setVerifying(false);
      }
    }
    validate();
  }, [token]);

  const onSubmit = async (data: InviteAcceptInput) => {
    try {
      await acceptInvite({ token, password: data.password });
      setIsSuccess(true);
      toast.success("Account activated!");
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      toast.error("Failed to complete registration.");
    }
  };

  if (verifying) {
    return (
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
        <div className="grid gap-6 p-8 bg-white rounded-xl shadow-2xl border-t-4 border-slate-800">
          <Skeleton className="h-20 w-20 rounded-full mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
        <div className="grid gap-6 p-10 bg-white rounded-xl shadow-2xl border-t-4 border-emerald-500 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Account Activated!
            </h2>
            <p className="text-slate-500 text-sm">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  if (tokenStatus && !tokenStatus.valid) {
    return (
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
        <div className="grid gap-6 p-10 bg-white rounded-xl shadow-2xl border-t-4 border-red-500 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
            <Clock className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Link Unavailable</h2>
          <p className="text-slate-500 text-sm">{tokenStatus.reason}</p>
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            className="w-full"
          >
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
        {/* Header Section - Matches Login */}
        <div className="flex flex-col space-y-2 text-center items-center">
          <Image
            src="/brand/sca-logo-white.png"
            alt="She Code Africa"
            width={80}
            height={80}
            className="h-20 w-auto mb-4"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="text-sm text-slate-300">
            Set your password to activate your account
          </p>
        </div>

        {/* Card Section - Matches Login */}
        <div className="grid gap-6 p-8 bg-white rounded-xl shadow-2xl border-t-4 border-slate-800">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email (Read Only) */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold uppercase text-[10px]">
                  Assigned Email Address
                </Label>
                <Input
                  value={tokenStatus?.valid ? tokenStatus.email : ""}
                  disabled
                  className="h-11 bg-slate-50 border-slate-200 text-slate-500 italic font-medium cursor-not-allowed"
                />
              </div>

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-bold uppercase text-[10px]">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="h-11 pr-10 text-slate-600 font-medium "
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <StrengthMeter password={password} />
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Password Rules */}
              <ul className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100 list-none">
                <Rule met={password.length >= 8} text="8+ Characters" />
                <Rule met={/[A-Z]/.test(password)} text="Uppercase" />
                <Rule met={/[0-9]/.test(password)} text="Number" />
                <Rule met={/[^A-Za-z0-9]/.test(password)} text="Special Char" />
              </ul>

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-bold uppercase text-[10px]">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirm ? "text" : "password"}
                          className="h-11 text-slate-600 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirm ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all active:scale-[0.98]"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Footer Badge - Matches Login */}
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck size={14} />
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Secure Admin Access Only
          </span>
        </div>
      </div>
    </div>
  );
}
