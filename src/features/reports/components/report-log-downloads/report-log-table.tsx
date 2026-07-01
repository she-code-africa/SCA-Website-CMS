"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { ReportDownloadUser } from "@/features/reports/types";
import { cleanName, getInitials } from "@/features/reports/utils";

export function ReportLogTable({
  rows,
  isLoading,
  isError
}: {
  rows: ReportDownloadUser[];
  isLoading: boolean;
  isError: boolean;
}) {
  const headers = ["First name", "Last name", "Email"];

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
              Failed to load report log.
            </TableCell>
          </TableRow>
        ) : rows.length ? (
          rows.map((u) => {
            const first = cleanName(u.firstname);
            const last = cleanName(u.lastname);
            return (
              <TableRow key={u._id}>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs font-medium">
                        {getInitials(u.firstname, u.lastname)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{first || "—"}</span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {last || "—"}
                </TableCell>
                <TableCell className="text-primary-foreground">
                  {u.email ?? "—"}
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={headers.length}
              className="h-24 text-center text-muted-foreground"
            >
              No downloads recorded yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
