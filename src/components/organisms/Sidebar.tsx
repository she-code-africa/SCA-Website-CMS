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
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/auth/logout";

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
import { LogOut, AlertTriangle } from "lucide-react";
import { useRoleStore } from "@/lib/store/useRoleStore";
import { PERMISSIONS } from "@/lib/rbac/permissions";

type RouteItem = {
  name: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  items?: RouteItem[];
};

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
  const { user } = useAuth();
  const { can } = usePermissions();
  const { currentRole } = useRoleStore();

  const [logoutOpen, setLogoutOpen] = React.useState(false);

  // STATE FOR MANUAL TOGGLING
  // initialized to empty string to keep Accordion "controlled"
  const [openItem, setOpenItem] = React.useState<string>("");

  // AUTO-EXPAND ON NAVIGATION
  // When the URL changes, we check if it belongs to a group and expand it
  React.useEffect(() => {
    const currentGroup = adminRoutes.find((route) =>
      route.items?.some(
        (sub) => pathname === sub.path || pathname.startsWith(sub.path + "/")
      )
    );

    if (currentGroup) {
      setOpenItem(currentGroup.name);
    }
  }, [pathname]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const filteredRoutes = React.useMemo(() => {
    return adminRoutes
      .map((item) => {
        const visibleSubItems = item.items?.filter(
          (sub) => !sub.permission || can(sub.permission)
        );

        const hasParentAccess = !item.permission || can(item.permission);

        if (
          hasParentAccess ||
          (visibleSubItems && visibleSubItems.length > 0)
        ) {
          return { ...item, items: visibleSubItems } as RouteItem;
        }
        return null;
      })
      .filter((item): item is RouteItem => item !== null);
  }, [can]);

  const wrapperClass =
    variant === "desktop"
      ? "hidden md:flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
      : "flex h-full w-full flex-col bg-sidebar text-sidebar-foreground";


  // console.log("--- SIDEBAR DEBUG ---");
  // console.log("Current Role from Global Store:", currentRole);
  // console.log("Filtered Route Count:", filteredRoutes.length);
  // console.log("User permissions:", user?.permissions);
  // console.log(
  //   "Has VIEW_TESTIMONIALS:",
  //   user?.permissionSet.has(PERMISSIONS.VIEW_TESTIMONIALS)
  // );


  return (
    <aside className={wrapperClass}>
      {variant === "desktop" ? <SidebarLogo /> : null}

      <ScrollArea className="flex-1 px-2 py-3 pb-0">
        <nav className="space-y-1 pb-3">
          {filteredRoutes.map((item: RouteItem) => {
            const Icon = item.icon;

            // ✅ GROUP ITEMS (With manual toggle support)
            if (item.items?.length) {
              const anyChildActive = item.items.some(
                (sub: RouteItem) =>
                  pathname === sub.path || pathname.startsWith(sub.path + "/")
              );

              const parentActive =
                pathname === item.path || pathname.startsWith(item.path + "/");

              return (
                <Accordion
                  key={item.name}
                  type="single"
                  collapsible
                  value={openItem}
                  onValueChange={setOpenItem} // Allows manual open/close
                >
                  <AccordionItem value={item.name} className="border-none">
                    <div
                      className={cn(
                        "relative flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                        parentActive || anyChildActive
                          ? navItemActive
                          : navItemInactive
                      )}
                    >
                      {(parentActive || anyChildActive) && (
                        <span className={navDot} aria-hidden />
                      )}

                      <Link
                        href={item.path}
                        className="flex min-w-0 flex-1 items-center gap-2"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>

                      <AccordionToggle />
                    </div>

                    <AccordionContent className="pt-1">
                      <div className="ml-3 space-y-1 border-l border-sidebar-border pl-2">
                        {item.items.map((sub: RouteItem) => {
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
            const isActive =
              pathname === item.path || pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  navItemBase,
                  isActive ? navItemActive : navItemInactive
                )}
              >
                {isActive && <span className={navDot} aria-hidden />}
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-2 shrink-0">
        <Button
          variant="ghost"
          onClick={() => setLogoutOpen(true)}
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

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
              className="bg-primary text-primary-foreground hover:bg-primary/90"
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

  const logoSrc = !mounted
    ? "/brand/sca-logo-white.png"
    : resolvedTheme === "dark"
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