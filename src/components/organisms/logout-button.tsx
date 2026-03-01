"use client";

import * as React from "react";
import { toast } from "sonner";

import { logout } from "@/lib/auth/logout";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

type LogoutButtonProps = {
  variant?: "ghost" | "default" | "secondary" | "outline" | "destructive";
  className?: string;
  children: React.ReactNode;
};

export function LogoutButton({
  variant = "ghost",
  className,
  children
}: LogoutButtonProps) {
  const onConfirmLogout = () => {
    toast.success("Logged out");

    // allow toast to render, then logout + redirect
    setTimeout(() => {
      logout({ reason: "manual", redirectTo: "/login" });
    }, 250);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant} className={className}>
          {children}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout?</AlertDialogTitle>
          <AlertDialogDescription>
            You’ll be signed out of the admin dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>No, stay</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmLogout}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary"
          >
            Yes, Log out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
