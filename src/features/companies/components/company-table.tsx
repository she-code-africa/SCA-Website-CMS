"use client";

import * as React from "react";
import { format } from "date-fns";
import { Building2, Eye } from "lucide-react";
import type { Company } from "@/features/companies/types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function stateBadgeVariant(state?: string) {
  if (state === "active") return "default";
  return "secondary"; // archived
}

export function CompanyTable({
  rows,
  isLoading,
  isError,
  onView
}: {
  rows: Company[];
  isLoading: boolean;
  isError: boolean;
  onView: (c: Company) => void;
}) {
  const headers = [
    "Company Name",
    "Email",
    "Location",
    "Phone",
    "State",
    "Updated",
    "Action"
  ];

  const handleRowClick = (company: Company) => {
    onView(company);
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
              Failed to load companies.
            </TableCell>
          </TableRow>
        ) : rows.length ? (
          rows.map((c) => (
            <TableRow
              key={c._id}
              onClick={() => handleRowClick(c)}
              className={cn("cursor-pointer hover:bg-muted/50")}
            >
              {/* Company Name */}
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium">{c.companyName ?? "—"}</span>
                </div>
              </TableCell>

              {/* Email */}
              <TableCell className="max-w-xs truncate">
                {c.email ?? "—"}
              </TableCell>

              {/* Location */}
              <TableCell className="whitespace-nowrap">
                {c.companyLocation ?? "—"}
              </TableCell>

              {/* Phone */}
              <TableCell className="whitespace-nowrap">
                {c.companyPhone ?? "—"}
              </TableCell>

              {/* State */}
              <TableCell className="whitespace-nowrap">
                <Badge variant={stateBadgeVariant(c.state)}>
                  {c.state ?? "active"}
                </Badge>
              </TableCell>

              {/* Updated */}
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(c.updatedAt)}
              </TableCell>

              {/* Action */}
              <TableCell
                className="whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onView(c)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={headers.length}
              className="h-24 text-center text-muted-foreground"
            >
              No companies found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
