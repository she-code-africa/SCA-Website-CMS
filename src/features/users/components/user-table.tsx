"use client";

import * as React from "react";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import type { AdminUser } from "@/features/users/types";
import { cn } from "@/lib/utils/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
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

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function initials(user: AdminUser) {
  const a = user.firstName?.[0] ?? "";
  const b = user.lastName?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  active: { label: "Active", variant: "default" },
  inactive: { label: "Inactive", variant: "destructive" },
  pending: { label: "Pending", variant: "outline" }
};

type Props = {
  rows: AdminUser[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (u: AdminUser) => void;
  onToggleStatus: (u: AdminUser) => void;
  onDelete: (u: AdminUser) => void;
};

const headers = ["User", "Role", "Status", "Last Login", "Joined", ""];

export function UserTable({
  rows,
  isLoading,
  isError,
  onRowClick,
  onToggleStatus,
  onDelete
}: Props) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((h) => (
                <TableHead key={h} className="whitespace-nowrap">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <TableRow key={idx}>
                  {headers.map((_, cIdx) => (
                    <TableCell key={cIdx} className="whitespace-nowrap">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="h-24 text-center text-red-500"
                >
                  Failed to load users.
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((u) => {
                const st = statusConfig[u.status] ?? {
                  label: u.status,
                  variant: "outline" as const
                };
                const fullName =
                  [u.firstName, u.lastName].filter(Boolean).join(" ") || "—";

                return (
                  <TableRow
                    key={u.id}
                    onClick={() => onRowClick(u)}
                    className={cn("cursor-pointer hover:bg-muted/50")}
                  >
                    {/* User cell */}
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                          {initials(u)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium leading-none">{fullName}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <Badge variant="secondary">{u.role.name}</Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {fmtDate(u.lastLogin)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {fmtDate(u.createdAt)}
                    </TableCell>

                    {/* Actions — stop row click propagation */}
                    <TableCell
                      className="whitespace-nowrap text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => onRowClick(u)}>
                              View / Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => onToggleStatus(u)}
                              className={
                                u.status === "active"
                                  ? "text-amber-500 focus:text-amber-500"
                                  : "text-emerald-500 focus:text-emerald-500"
                              }
                            >
                              {u.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-red-500 focus:text-red-500"
                                onSelect={(e) => e.preventDefault()}
                              >
                                Delete user
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete user?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove{" "}
                              <strong>{fullName}</strong> from the system. This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(u)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
