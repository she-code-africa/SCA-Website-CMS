"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { toast } from "sonner";

import { adminRoutes } from "@/lib/routes/admin-routes";
import { cn } from "@/lib/utils/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/logout";
import { LogOut, AlertTriangle } from "lucide-react";

const navItemBase =
  "group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring";

const navItemInactive =
  "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground";

const navItemActive =
  "bg-accent/30 text-sidebar-foreground font-medium ring-1 ring-sidebar-ring/15";

const navDot =
  "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary";

  
type SidebarProps = {
  variant?: "desktop" | "mobile";
};

export function Sidebar({ variant = "desktop" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const wrapperClass =
    variant === "desktop"
      ? "hidden md:flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
      : "flex h-full w-full flex-col bg-sidebar text-sidebar-foreground";

  return (
    <aside className={wrapperClass}>
      {variant === "desktop" ? <SidebarLogo /> : null}

      <ScrollArea className="flex-1 px-2 py-3 pb-0">
        <nav className="space-y-1 pb-3">
          {adminRoutes.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.path || pathname.startsWith(item.path + "/");

            // ✅ GROUP ITEMS (accordion)
            if (item.items?.length) {
              const anyChildActive = item.items.some(
                (sub) =>
                  pathname === sub.path || pathname.startsWith(sub.path + "/")
              );

              const parentActive =
                pathname === item.path || pathname.startsWith(item.path + "/");

              const accordionValue = item.name;

              // ✅ Keep open if parent or any child is active
              const openValue =
                parentActive || anyChildActive ? accordionValue : undefined;

              return (
                <Accordion
                  key={item.name}
                  type="single"
                  collapsible
                  value={openValue}
                >
                  <AccordionItem value={accordionValue} className="border-none">
                    {/* Header row: Link (left) + Toggle button (right) */}
                    <div
                      className={cn(
                        "relative flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                        parentActive || anyChildActive
                          ? navItemActive
                          : navItemInactive
                      )}
                    >
                      {parentActive || anyChildActive ? (
                        <span className={navDot} aria-hidden />
                      ) : null}

                      {/* LEFT: clickable parent link */}
                      <Link
                        href={item.path}
                        className="flex min-w-0 flex-1 items-center gap-2"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>

                      {/* RIGHT: chevron-only accordion toggle */}
                      <AccordionToggle />
                    </div>

                    <AccordionContent className="pt-1">
                      <div className="ml-3 space-y-1 border-l border-sidebar-border pl-2">
                        {item.items.map((sub) => {
                          const subActive =
                            pathname === sub.path ||
                            pathname.startsWith(sub.path + "/");

                          return (
                            <Link
                              key={sub.name}
                              href={sub.path}
                              className={cn(
                                "group flex items-center rounded-md px-3 py-1.5 text-sm transition-colors",
                                subActive
                                  ? "bg-sidebar-accent text-sidebar-foreground ring-1 ring-sidebar-ring/15"
                                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                              )}
                            >
                              <span
                                className={cn(
                                  "mr-2 inline-block h-1.5 w-1.5 rounded-full transition-colors",
                                  subActive
                                    ? "bg-sidebar-primary"
                                    : "bg-sidebar-foreground/30 group-hover:bg-sidebar-primary/70"
                                )}
                              />
                              <span className="truncate">{sub.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            }

            // ✅ SINGLE ITEM
            return (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  navItemBase,
                  isActive ? navItemActive : navItemInactive
                )}
              >
                {isActive ? <span className={navDot} aria-hidden /> : null}
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer logout */}
      <div className="border-t border-sidebar-border p-2 flex-shrink-0">
        <Button
          variant="ghost"
          onClick={() => setLogoutOpen(true)}
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>

              <div className="space-y-1">
                <AlertDialogTitle className="text-base">
                  Sign out
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You’ll be signed out of the admin dashboard and may need to
                  log in again.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary"
            >
              Yes, sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}

function SidebarLogo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
        <Image
          src="/brand/sca-logo-white.png"
          alt="SheCode Africa"
          width={48}
          height={48}
          priority
        />
      </div>
    );
  }

  const logoSrc =
    resolvedTheme === "dark"
      ? "/brand/sca-logo-white.png"
      : "/brand/sca-logo-dark.png";

  return (
    <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
      <Image
        src={logoSrc}
        alt="SheCode Africa"
        width={48}
        height={48}
        priority
      />
    </div>
  );
}
