// src/features/stem-a-girl/consent/components/consent-table.tsx

"use client";

import * as React from "react";
import { Eye, Pencil } from "lucide-react";
import type { ConsentRecord } from "../types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fmtDate } from "@/features/stem-a-girl/shared/format";
import { AccountStatusBadge, ConsentStateBadge } from "./consent-badges";

const headers = [
  "Name",
  "Username",
  "Age",
  "Guardian Email",
  "State",
  "Account",
  "Created",
  "Action",
];

export function ConsentTable({
  rows,
  isLoading,
  isError,
  onView,
  onEdit,
}: {
  rows: ConsentRecord[];
  isLoading: boolean;
  isError: boolean;
  onView: (r: ConsentRecord) => void;
  onEdit: (r: ConsentRecord) => void;
}) {
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
                  Failed to load consent records.
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No consent records found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow
                  key={r._id}
                  onClick={() => onView(r)}
                  className={cn("cursor-pointer hover:bg-muted/50")}
                >
                  <TableCell className="whitespace-nowrap font-medium">
                    {r.name}
                  </TableCell>

                  <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                    {r.username}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">{r.age}</TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {r.guardianEmail}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <ConsentStateBadge state={r.consentStatus} />
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <AccountStatusBadge status={r.accountStatus} />
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(r.consentSubmittedAt)}
                  </TableCell>

                  <TableCell
                    className="whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`View ${r.name}`}
                        onClick={() => onView(r)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`Edit ${r.name}`}
                        onClick={() => onEdit(r)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
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
