// "use client";

// import * as React from "react";
// import Image from "next/image";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { useMutation } from "@tanstack/react-query";
// import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
// import { toast } from "sonner";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import type { AxiosError } from "axios";

// import { login } from "@/features/auth/api/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from "@/components/ui/form";
// import { Checkbox } from "@/components/ui/checkbox";

// const loginSchema = z.object({
//   email: z.string().email("Please enter a valid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   rememberMe: z.boolean()
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// export default function LoginPage() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = React.useState(false);

//   const form = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     mode: "onBlur",
//     defaultValues: {
//       email: "",
//       password: "",
//       rememberMe: false
//     }
//   });

//   React.useEffect(() => {
//     const savedEmail = localStorage.getItem("rememberedEmail");
//     if (savedEmail) {
//       form.setValue("email", savedEmail);
//       form.setValue("rememberMe", true);
//     }
//   }, [form]);

//   const mutation = useMutation({
//     mutationFn: login,
//     onSuccess: (token: string) => {
//       const values = form.getValues();
//       const expires = values.rememberMe ? 30 : 7;

//       // 1. Set Secure Cookie for Middleware
//       Cookies.set("isLoggedIn", "true", {
//         expires,
//         sameSite: "lax",
//         secure: process.env.NODE_ENV === "production" // Only sends over HTTPS
//       });

//       // 2. Store Token
//       localStorage.setItem("token", token);

//       if (values.rememberMe) {
//         localStorage.setItem("rememberedEmail", values.email);
//       } else {
//         localStorage.removeItem("rememberedEmail");
//       }

//       toast.success("Welcome back!");
//       router.push("/admin/dashboard");
//     },
//     onError: (err: AxiosError<{ message?: string }>) => {
//       const status = err?.response?.status;
//       const backendMessage = err?.response?.data?.message;

//       if (status === 401) {
//         toast.error("Invalid credentials", {
//           description: "The email or password you entered is incorrect."
//         });
//       } else if (status === 400 && backendMessage) {
//         toast.error("Login Failed", { description: backendMessage });
//       } else {
//         toast.error("Connection Error", {
//           description: "Could not reach the server. Please try again later."
//         });
//       }
//     }
//   });

//   const onSubmit = (data: LoginFormValues) => {
//     mutation.mutate({ email: data.email, password: data.password });
//   };

//   return (
//     <div className="container relative flex flex-col items-center justify-center min-h-[80vh] px-4">
//       <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
//         <div className="flex flex-col space-y-2 text-center items-center">
//           <Image
//             src="/brand/sca-logo-white.png"
//             alt="She Code Africa"
//             width={80}
//             height={80}
//             className="h-20 w-auto mb-4"
//           />
//           <h1 className="text-2xl font-semibold tracking-tight text-white">
//             Admin Portal
//           </h1>
//           <p className="text-sm text-slate-300">
//             Enter your credentials to manage the platform
//           </p>
//         </div>

//         <div className="grid gap-6 p-8 bg-white rounded-xl shadow-2xl border-t-4 border-slate-800">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-slate-700 font-bold uppercase text-[10px]">
//                       Email Address
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="name@company.com"
//                         {...field}
//                         className="h-11 text-slate-600 font-medium"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-xs" />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <div className="flex items-center justify-between">
//                       <FormLabel className="text-slate-700 font-bold uppercase text-[10px]">
//                         Password
//                       </FormLabel>
//                       <button
//                         type="button"
//                         className="text-[11px] text-slate-500 hover:underline"
//                         onClick={() =>
//                           toast.info(
//                             "Contact your system administrator to reset."
//                           )
//                         }
//                       >
//                         Forgot password?
//                       </button>
//                     </div>
//                     <FormControl>
//                       <div className="relative">
//                         <Input
//                           type={showPassword ? "text" : "password"}
//                           {...field}
//                           className="h-11 pr-10 text-slate-600 font-medium"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                         >
//                           {showPassword ? (
//                             <EyeOff size={16} />
//                           ) : (
//                             <Eye size={16} />
//                           )}
//                         </button>
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-xs" />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="rememberMe"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-center space-x-2 space-y-0 py-2">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                     <FormLabel className="text-sm font-medium text-slate-600 cursor-pointer">
//                       Remember this device
//                     </FormLabel>
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 type="submit"
//                 // UPDATE: Disabled during pending AND success to prevent double redirects
//                 disabled={mutation.isPending || mutation.isSuccess}
//                 className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all active:scale-[0.98]"
//               >
//                 {mutation.isPending ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Authenticating...
//                   </>
//                 ) : (
//                   "Sign In to Dashboard"
//                 )}
//               </Button>
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
//     </div>
//   );
// }

"use client";

import * as React from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";

import { login } from "@/features/auth/api/api";
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
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean()
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  React.useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      form.setValue("email", savedEmail);
      form.setValue("rememberMe", true);
    }
  }, [form]);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (token: string) => {
      const values = form.getValues();
      const expires = values.rememberMe ? 30 : 7;

      Cookies.set("isLoggedIn", "true", {
        expires,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
      });

      localStorage.setItem("token", token);

      if (values.rememberMe) {
        localStorage.setItem("rememberedEmail", values.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast.success("Welcome back!");
      router.push("/admin/dashboard");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const status = err?.response?.status;
      const backendMessage = err?.response?.data?.message;

      if (status === 401) {
        toast.error("Invalid credentials", {
          description: "The email or password you entered is incorrect."
        });
      } else if (status === 400 && backendMessage) {
        toast.error("Login Failed", { description: backendMessage });
      } else {
        toast.error("Connection Error", {
          description: "Could not reach the server. Please try again later."
        });
      }
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate({ email: data.email, password: data.password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6">
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
            Enter your credentials to manage the platform
          </p>
        </div>

        <div className="grid gap-6 p-8 bg-white rounded-xl shadow-2xl border-t-4 border-slate-800">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-bold uppercase text-[10px]">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@company.com"
                        {...field}
                        className="h-11 text-slate-600 font-medium"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-slate-700 font-bold uppercase text-[10px]">
                        Password
                      </FormLabel>
                      <button
                        type="button"
                        className="text-[11px] text-slate-500 hover:underline"
                        onClick={() =>
                          toast.info(
                            "Contact your system administrator to reset."
                          )
                        }
                      >
                        Forgot password?
                      </button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="h-11 pr-10 text-slate-600 font-medium"
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
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 py-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium text-slate-600 cursor-pointer">
                      Remember this device
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={mutation.isPending || mutation.isSuccess}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all active:scale-[0.98]"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
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
    </div>
  );
}