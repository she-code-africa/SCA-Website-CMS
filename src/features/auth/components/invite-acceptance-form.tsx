// "use client";

// import * as React from "react";
// import Image from "next/image";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import {
//   Eye,
//   EyeOff,
//   CheckCircle2,
//   XCircle,
//   ShieldCheck,
//   Loader2,
//   Clock
// } from "lucide-react";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from "@/components/ui/form";
// import { Skeleton } from "@/components/ui/skeleton";

// import {
//   inviteAcceptSchema,
//   getPasswordStrength,
//   STRENGTH_CONFIG,
//   type InviteAcceptInput
// } from "@/features/auth/schema/invite.schema";
// import {
//   acceptInvite,
//   declineInvite,
//   verifyInviteToken
// } from "@/features/auth/api/api";
// import type { InviteTokenStatus } from "@/features/auth/types";

// // ─── Helper Components (Rule, StrengthMeter, ConfirmationModal) unchanged ───
// // ... (copy from your existing code)

// export function InviteAcceptanceForm({ token }: Props) {
//   const router = useRouter();
//   const [tokenStatus, setTokenStatus] =
//     React.useState<InviteTokenStatus | null>(null);
//   const [verifying, setVerifying] = React.useState(true);
//   const [isSuccess, setIsSuccess] = React.useState(false);
//   const [isDeclining, setIsDeclining] = React.useState(false);
//   const [showDeclineModal, setShowDeclineModal] = React.useState(false);
//   const [showPassword, setShowPassword] = React.useState(false);
//   const [showConfirm, setShowConfirm] = React.useState(false);
//   const [submitError, setSubmitError] = React.useState<string | null>(null);

//   const form = useForm<InviteAcceptInput>({
//     resolver: zodResolver(inviteAcceptSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       password: "",
//       confirmPassword: ""
//     }
//   });

//   const password = form.watch("password");

//   // ─── Token Verification on Mount ─────────────────────────────────────────
//   React.useEffect(() => {
//     async function validate() {
//       if (!token) {
//         setTokenStatus({
//           valid: false,
//           expired: false,
//           reason: "No invitation token provided."
//         });
//         setVerifying(false);
//         return;
//       }
//       try {
//         const status = await verifyInviteToken(token);
//         setTokenStatus(status);
//         if (status.valid && status.name) {
//           const [first, ...last] = status.name.split(" ");
//           form.setValue("firstName", first);
//           form.setValue("lastName", last.join(" "));
//         }
//       } catch {
//         setTokenStatus({
//           valid: false,
//           expired: false,
//           reason: "Verification failed."
//         });
//       } finally {
//         setVerifying(false);
//       }
//     }
//     validate();
//   }, [token, form]);

//   // ─── Submit handler (unchanged) ──────────────────────────────────────────
//   const onSubmit = async (values: InviteAcceptInput) => {
//     setSubmitError(null);
//     try {
//       await acceptInvite({
//         token,
//         password: values.password,
//         firstName: values.firstName,
//         lastName: values.lastName
//       });
//       setIsSuccess(true);
//       toast.success("Account activated successfully!");
//       setTimeout(() => router.push("/login"), 3000);
//     } catch (err: any) {
//       const status = err?.response?.status;
//       let errorMsg =
//         err?.response?.data?.message || "Failed to complete registration.";
//       if (status === 410) {
//         errorMsg =
//           "This invitation link has expired. Please contact your administrator.";
//       } else if (status === 404 || status === 400) {
//         errorMsg = "This invitation link is invalid or has already been used.";
//       }
//       setSubmitError(errorMsg);
//       toast.error(errorMsg);
//     }
//   };

//   // ─── Decline handler (unchanged) ─────────────────────────────────────────
//   const handleDeclineConfirm = async () => {
//     try {
//       setIsDeclining(true);
//       await declineInvite(token);
//       toast.info("Invitation declined successfully.");
//       router.push("/login");
//     } catch (err: any) {
//       const errorMsg = err?.response?.data?.message || "Failed to decline.";
//       toast.error(errorMsg);
//     } finally {
//       setIsDeclining(false);
//       setShowDeclineModal(false);
//     }
//   };



//   // ─── Password Requirement Row ───────────────────────────────────────────────
// function Rule({ met, text }: { met: boolean; text: string }) {
//   return (
//     <li className="flex items-center gap-1.5 text-[11px]">
//       {met ? (
//         <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
//       ) : (
//         <XCircle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
//       )}
//       <span className={met ? "text-slate-700 font-medium" : "text-slate-400"}>
//         {text}
//       </span>
//     </li>
//   );
// }


//   // ─── Strength Meter ──────────────────────────────────────────────────────────
//   function StrengthMeter({ password }: { password: string }) {
//     const level = getPasswordStrength(password);
//     const cfg = STRENGTH_CONFIG[level];

//     return (
//       <div className="space-y-1.5 mt-1">
//         <div className="flex gap-1">
//           {[1, 2, 3, 4, 5].map((i) => (
//             <div
//               key={i}
//               className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
//                 i <= level ? cfg.barColor : "bg-slate-100"
//               }`}
//             />
//           ))}
//         </div>
//         {password && (
//           <p
//             className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}
//           >
//             {cfg.label}
//           </p>
//         )}
//       </div>
//     );
//   }

//   // ─── Confirmation Modal Component ───────────────────────────────────────────
//   function ConfirmationModal({
//     isOpen,
//     onClose,
//     onConfirm,
//     title,
//     message,
//     isProcessing
//   }: {
//     isOpen: boolean;
//     onClose: () => void;
//     onConfirm: () => void;
//     title: string;
//     message: string;
//     isProcessing: boolean;
//   }) {
//     if (!isOpen) return null;

//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//         <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
//           <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
//           <p className="mt-2 text-sm text-slate-500">{message}</p>
//           <div className="mt-6 flex justify-end gap-3">
//             <Button variant="outline" onClick={onClose} disabled={isProcessing}>
//               Cancel
//             </Button>
//             <Button
//               onClick={onConfirm}
//               disabled={isProcessing}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               {isProcessing ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Declining...
//                 </>
//               ) : (
//                 "Yes, decline"
//               )}
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ─── Loading State ────────────────────────────────────────────────────────
//   if (verifying) {
//     return (
//       <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
//         <div className="grid gap-6 p-8 bg-white rounded-xl shadow-2xl border-t-4 border-slate-800">
//           <Skeleton className="h-20 w-20 rounded-full mx-auto" />
//           <Skeleton className="h-8 w-3/4 mx-auto" />
//           <Skeleton className="h-24 w-full" />
//         </div>
//       </div>
//     );
//   }

//   // ─── Invalid / Expired Token State ───────────────────────────────────────
//   if (tokenStatus && !tokenStatus.valid) {
//     return (
//       <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
//         <div className="grid gap-6 p-10 bg-white rounded-xl shadow-2xl border-t-4 border-red-500 text-center">
//           <div className="mx-auto h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
//             {tokenStatus.expired ? (
//               <Clock className="h-8 w-8 text-red-500" />
//             ) : (
//               <XCircle className="h-8 w-8 text-red-500" />
//             )}
//           </div>
//           <h2 className="text-xl font-bold text-slate-900">
//             {tokenStatus.expired ? "Invitation Expired" : "Link Unavailable"}
//           </h2>
//           <p className="text-slate-500 text-sm">
//             {tokenStatus.reason || "This invitation link is no longer valid."}
//           </p>
//           <Button
//             onClick={() => router.push("/login")}
//             variant="outline"
//             className="w-full"
//           >
//             Return to Login
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // ─── Success State ────────────────────────────────────────────────────────
//   if (isSuccess) {
//     return (
//       <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
//         <div className="grid gap-6 p-10 bg-white rounded-xl shadow-2xl border-t-4 border-emerald-500 text-center">
//           <div className="mx-auto h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center">
//             <CheckCircle2 className="h-10 w-10 text-emerald-500" />
//           </div>
//           <div className="space-y-2">
//             <h2 className="text-2xl font-bold text-slate-900">
//               Account Activated!
//             </h2>
//             <p className="text-slate-500 text-sm">Redirecting to login...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ─── Valid Token – Show Form ─────────────────────────────────────────────
//   // Submit button is disabled if token is expired (but here tokenStatus.valid === true, so not expired)
//   const isSubmitDisabled = form.formState.isSubmitting || isDeclining;

//   return (
//     <div className="container relative flex flex-col items-center justify-center min-h-[80vh] px-4">
//       <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
//         <div className="flex flex-col space-y-2 text-center items-center">
//           <Image
//             src="/brand/sca-logo-white.png"
//             alt="SCA Logo"
//             width={80}
//             height={80}
//             className="h-20 w-auto mb-4"
//           />
//           <h1 className="text-2xl font-semibold tracking-tight text-white">
//             Admin Portal
//           </h1>
//           <p className="text-sm text-slate-300">Complete your account setup</p>
//         </div>

//         <div className="grid gap-6 p-8 bg-white rounded-xl shadow-2xl border-t-4 border-slate-800">
//           {/* Optional: Show email if returned from verification */}
//           {tokenStatus?.valid && tokenStatus.email && (
//             <div className="space-y-2">
//               <Label className="text-slate-700 font-bold uppercase text-[10px]">
//                 Invited Email
//               </Label>
//               <Input
//                 value={tokenStatus.email}
//                 disabled
//                 className="h-11 bg-slate-50 border-slate-200 text-slate-500 font-medium"
//               />
//             </div>
//           )}

//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <div className="grid grid-cols-2 gap-3">
//                 <FormField
//                   control={form.control}
//                   name="firstName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-slate-700 font-bold uppercase text-[10px]">
//                         First name
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           autoComplete="off"
//                           className="h-11"
//                           placeholder="Glory"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="lastName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-slate-700 font-bold uppercase text-[10px]">
//                         Last name
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           autoComplete="off"
//                           className="h-11"
//                           placeholder="Lovelace"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-slate-700 font-bold uppercase text-[10px]">
//                       New Password
//                     </FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Input
//                           {...field}
//                           type={showPassword ? "text" : "password"}
//                           autoComplete="new-password"
//                           className="h-11 pr-10"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//                         >
//                           {showPassword ? (
//                             <EyeOff size={16} />
//                           ) : (
//                             <Eye size={16} />
//                           )}
//                         </button>
//                       </div>
//                     </FormControl>
//                     <StrengthMeter password={password} />
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <ul className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100 list-none">
//                 <Rule met={password.length >= 8} text="8+ Characters" />
//                 <Rule met={/[A-Z]/.test(password)} text="Uppercase" />
//                 <Rule met={/[0-9]/.test(password)} text="Number" />
//                 <Rule met={/[^A-Za-z0-9]/.test(password)} text="Special Char" />
//               </ul>

//               <FormField
//                 control={form.control}
//                 name="confirmPassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-slate-700 font-bold uppercase text-[10px]">
//                       Confirm Password
//                     </FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Input
//                           {...field}
//                           type={showConfirm ? "text" : "password"}
//                           autoComplete="new-password"
//                           className="h-11 pr-10"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowConfirm(!showConfirm)}
//                           className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//                         >
//                           {showConfirm ? (
//                             <EyeOff size={16} />
//                           ) : (
//                             <Eye size={16} />
//                           )}
//                         </button>
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {submitError && (
//                 <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center">
//                   {submitError}
//                 </div>
//               )}

//               <div className="pt-2 space-y-3">
//                 <Button
//                   type="submit"
//                   disabled={isSubmitDisabled}
//                   className="w-full h-11 bg-slate-900 hover:bg-slate-800"
//                 >
//                   {form.formState.isSubmitting ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
//                       Activating...
//                     </>
//                   ) : (
//                     "Complete Setup"
//                   )}
//                 </Button>

//                 <button
//                   type="button"
//                   onClick={() => setShowDeclineModal(true)}
//                   disabled={isSubmitDisabled}
//                   className="w-full text-[11px] text-slate-400 hover:text-red-500 transition-colors uppercase font-bold tracking-widest"
//                 >
//                   I want to decline this invitation
//                 </button>
//               </div>
//             </form>
//           </Form>
//         </div>

//         <div className="flex items-center justify-center gap-2 text-slate-400">
//           <ShieldCheck size={14} />
//           <span className="text-[10px] uppercase tracking-widest font-bold">
//             Secure Admin Access Only
//           </span>
//         </div>
//       </div>

//       <ConfirmationModal
//         isOpen={showDeclineModal}
//         onClose={() => setShowDeclineModal(false)}
//         onConfirm={handleDeclineConfirm}
//         title="Decline Invitation"
//         message="Are you sure you want to decline this invitation? This action cannot be undone."
//         isProcessing={isDeclining}
//       />
//     </div>
//   );
// }




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
  ShieldCheck,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { acceptInvite, declineInvite } from "@/features/auth/api/api";

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

// ─── Confirmation Modal Component ───────────────────────────────────────────
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isProcessing
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isProcessing: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessing}
            className="bg-red-600 hover:bg-red-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Declining...
              </>
            ) : (
              "Yes, decline"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  token: string;
}

export function InviteAcceptanceForm({ token }: Props) {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isDeclining, setIsDeclining] = React.useState(false);
  const [showDeclineModal, setShowDeclineModal] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm<InviteAcceptInput>({
    resolver: zodResolver(inviteAcceptSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: ""
    }
  });

  const password = form.watch("password");

  // If no token is provided, show an error
  if (!token) {
    return (
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
        <div className="grid gap-6 p-10 bg-white rounded-xl shadow-2xl border-t-4 border-red-500 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Missing Invitation
          </h2>
          <p className="text-slate-500 text-sm">
            No invitation token provided. Please use the link from your email.
          </p>
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

  const onSubmit = async (values: InviteAcceptInput) => {
    setSubmitError(null);
    try {
      await acceptInvite({
        token,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName
      });
      setIsSuccess(true);
      toast.success("Account activated successfully!");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      const status = err?.response?.status;
      let errorMsg =
        err?.response?.data?.message || "Failed to complete registration.";
      if (status === 410) {
        errorMsg =
          "This invitation link has expired. Please contact your administrator.";
      } else if (status === 404 || status === 400) {
        errorMsg = "This invitation link is invalid or has already been used.";
      }
      setSubmitError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleDeclineConfirm = async () => {
    try {
      setIsDeclining(true);
      await declineInvite(token);
      toast.info("Invitation declined successfully.");
      router.push("/login");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Failed to decline.";
      toast.error(errorMsg);
    } finally {
      setIsDeclining(false);
      setShowDeclineModal(false);
    }
  };

  const onDeclineClick = () => {
    setShowDeclineModal(true);
  };

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

  return (
    <div className="container relative flex flex-col items-center justify-center min-h-[80vh] px-4">
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
          <p className="text-sm text-slate-300">Complete your account setup</p>
        </div>

        <div className="grid gap-6 p-8 bg-white rounded-xl shadow-2xl border-t-4 border-slate-800">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-bold uppercase text-[10px]">
                        First name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          autoComplete="off"
                          className="h-11 text-slate-600 font-medium"
                          placeholder="Glory"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-bold uppercase text-[10px]">
                        Last name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          autoComplete="off"
                          className="h-11 text-slate-600 font-medium"
                          placeholder="Lovelace"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

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
                          autoComplete="new-password"
                          className="h-11 pr-10 text-slate-600 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
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

              <ul className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100 list-none">
                <Rule met={password.length >= 8} text="8+ Characters" />
                <Rule met={/[A-Z]/.test(password)} text="Uppercase" />
                <Rule met={/[0-9]/.test(password)} text="Number" />
                <Rule met={/[^A-Za-z0-9]/.test(password)} text="Special Char" />
              </ul>

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
                          autoComplete="new-password"
                          className="h-11 pr-10 text-slate-600 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
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

              {submitError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center">
                  {submitError}
                </div>
              )}

              <div className="pt-2 space-y-3">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || isDeclining}
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Activating...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={onDeclineClick}
                  disabled={form.formState.isSubmitting || isDeclining}
                  className="w-full text-[11px] text-slate-400 hover:text-red-500 transition-colors uppercase font-bold tracking-widest text-center flex items-center justify-center gap-2"
                >
                  {isDeclining ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" /> Declining...
                    </>
                  ) : (
                    "I want to decline this invitation"
                  )}
                </button>
              </div>
            </form>
          </Form>
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck size={14} />
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Secure Admin Access Only
          </span>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        onConfirm={handleDeclineConfirm}
        title="Decline Invitation"
        message="Are you sure you want to decline this invitation? This action cannot be undone."
        isProcessing={isDeclining}
      />
    </div>
  );
}
