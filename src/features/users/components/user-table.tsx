"use client";

import { format } from "date-fns";
import { Eye } from "lucide-react";
import type { AdminUser } from "@/features/users/types";
import { cn } from "@/lib/utils/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function initials(user: AdminUser) {
  const a = user.firstName?.[0] ?? "";
  const b = user.lastName?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

function getStatusBadge(user: AdminUser) {
  if (user.status === "pending") {
    return <Badge variant="outline">Pending</Badge>;
  }
  const isActive = user.isActive ?? user.status === "active";
  if (isActive) {
    return (
      <Badge className="bg-green-600 text-white hover:bg-green-700">
        Active
      </Badge>
    );
  }
  return (
    <Badge
      variant="destructive"
      className="bg-red-600 text-white hover:bg-red-700"
    >
      Deactivated
    </Badge>
  );
}

type Props = {
  rows: AdminUser[];
  roles: any[];
  isLoading: boolean;
  isError: boolean;
  canEdit?: boolean;
  onRowClick: (u: AdminUser) => void;
};

const headers = ["User", "Role", "Status", "Joined", "Action"];

export function UserTable({
  rows,
  roles,
  isLoading,
  isError,
  canEdit = true,
  onRowClick
}: Props) {
  const resolveRoleName = (user: any) => {
    const roleValue =
      user.role || (Array.isArray(user.roles) ? user.roles[0] : null);
    if (!roleValue) return "User";
    if (typeof roleValue === "object") return roleValue.name || "User";
    if (roleValue === "ADMINISTRATOR") return "Super Admin";
    const matchedRole = roles.find(
      (r) => r._id === roleValue || r.id === roleValue
    );
    return (
      matchedRole?.name ||
      (roleValue.length > 20 ? `ID: ${roleValue.substring(0, 6)}` : roleValue)
    );
  };

  return (
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
            const userId = u._id || u.id;
            const fullName =
              [u.firstName, u.lastName].filter(Boolean).join(" ") || "—";

            return (
              <TableRow
                key={userId}
                onClick={() => canEdit && onRowClick(u)}
                className={cn(
                  canEdit
                    ? "cursor-pointer hover:bg-muted/50"
                    : "cursor-default"
                )}
              >
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

                {/* Role Cell – clickable */}
                <TableCell
                  className="whitespace-nowrap cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canEdit) onRowClick(u);
                  }}
                >
                  <Badge
                    variant={
                      u.role === "ADMINISTRATOR" ? "default" : "secondary"
                    }
                  >
                    {resolveRoleName(u)}
                  </Badge>
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {getStatusBadge(u)}
                </TableCell>

                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {fmtDate(u.createdAt)}
                </TableCell>

                {/* Action Column */}
                <TableCell
                  className="whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onRowClick(u)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
