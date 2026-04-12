"use client";

import { MoreHorizontal, Lock, UserCog } from "lucide-react";
import type { RoleDetail } from "@/features/roles/types";
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
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const headers = ["Role", "Type", "Permissions", "Users", ""];

type Props = {
  rows: RoleDetail[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (r: RoleDetail) => void;
  onDelete: (r: RoleDetail) => void;
};

export function RolesTable({
  rows,
  isLoading,
  isError,
  onRowClick,
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
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  {headers.map((_, cIdx) => (
                    <TableCell key={cIdx}>
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
                  Failed to load roles.
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow
                  key={r.id}
                  onClick={() => onRowClick(r)}
                  className={cn("cursor-pointer hover:bg-muted/50")}
                >
                  <TableCell className="min-w-50">
                    <div className="flex items-center gap-2">
                      {r.is_system_role ? (
                        <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <UserCog className="h-4 w-4 shrink-0 text-primary" />
                      )}
                      <div>
                        <div className="font-medium leading-none flex items-center gap-2">
                          {r.name}
                          {r.is_system_role && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 h-4 bg-muted text-muted-foreground border-transparent"
                            >
                              System
                            </Badge>
                          )}
                        </div>
                        {r.description && (
                          <p className="mt-0.5 text-xs text-muted-foreground max-w-65 truncate">
                            {r.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <Badge variant={r.is_system_role ? "secondary" : "outline"}>
                      {r.is_system_role ? "System" : "Custom"}
                    </Badge>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {r.permissions.length} permissions
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {r.usersCount} user{r.usersCount !== 1 ? "s" : ""}
                  </TableCell>

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
                          <PermissionGate permission={PERMISSIONS.UPDATE_ROLE}>
                            <DropdownMenuItem onClick={() => onRowClick(r)}>
                              {r.is_system_role
                                ? "View permissions"
                                : "Edit role"}
                            </DropdownMenuItem>
                          </PermissionGate>

                          {!r.is_system_role && (
                            <>
                              <DropdownMenuSeparator />
                              <PermissionGate
                                permission={PERMISSIONS.DELETE_ROLE}
                              >
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="text-red-500 focus:text-red-500"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    Delete role
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                              </PermissionGate>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {!r.is_system_role && (
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete role?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {r.usersCount > 0
                                ? `This role is assigned to ${r.usersCount} user(s). Please reassign them before deleting.`
                                : `"${r.name}" will be permanently deleted. This action cannot be undone.`}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(r)}
                              disabled={r.usersCount > 0}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      )}
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
