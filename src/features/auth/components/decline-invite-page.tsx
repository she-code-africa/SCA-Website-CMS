"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { XCircle, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { declineInvite } from "@/features/auth/api/api";

interface Props {
  token: string;
}

type State = "idle" | "declining" | "success" | "error";

export function DeclineInvitePage({ token }: Props) {
  const router = useRouter();
  const [state, setState] = React.useState<State>("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleDecline = async () => {
    try {
      setState("declining");
      await declineInvite(token);
      setState("success");
      toast.info("Invitation declined.");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to decline the invitation.";
      setErrorMessage(msg);
      setState("error");
    }
  };

  // ── Success ────────────────────────────────────────────────────────────────
  if (state === "success") {
    return (
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
        <div className="grid gap-6 p-10 bg-white rounded-xl shadow-2xl border-t-4 border-slate-500 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-slate-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              Invitation Declined
            </h2>
            <p className="text-slate-500 text-sm">
              You&apos;ve declined this invitation. If this was a mistake, ask your
              administrator to send a new one.
            </p>
            <p className="text-slate-400 text-xs">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (state === "error") {
    return (
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
        <div className="grid gap-6 p-10 bg-white rounded-xl shadow-2xl border-t-4 border-red-500 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              Something went wrong
            </h2>
            <p className="text-slate-500 text-sm">{errorMessage}</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/login")}>
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  // ── Confirmation prompt (idle + declining) ─────────────────────────────────
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
      <div className="flex flex-col space-y-2 text-center items-center">
        <Image
          src="/brand/sca-logo-white.png"
          alt="SCA Logo"
          width={80}
          height={80}
          className="h-20 w-auto mb-4"
        />
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Admin Portal
        </h1>
      </div>

      <div className="grid gap-6 p-8 bg-white rounded-xl shadow-2xl border-t-4 border-slate-800 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
          <XCircle className="h-8 w-8 text-slate-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            Decline Invitation?
          </h2>
          <p className="text-slate-500 text-sm">
            You&apos;re about to decline your invitation to the She Code Africa Admin
            Portal. This action cannot be undone.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleDecline}
            disabled={state === "declining"}
            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            {state === "declining" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Declining...
              </>
            ) : (
              "Yes, decline this invitation"
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push(`/invite/${token}`)}
            disabled={state === "declining"}
            className="w-full"
          >
            Go back and accept instead
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-slate-400">
        <ShieldCheck size={14} />
        <span className="text-[10px] uppercase tracking-widest font-bold">
          Secure Admin Access Only
        </span>
      </div>
    </div>
  );
}
