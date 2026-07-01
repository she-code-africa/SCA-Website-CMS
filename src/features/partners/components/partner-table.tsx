"use client";

import * as React from "react";
import { format } from "date-fns";
import { Building2, Eye, Pencil } from "lucide-react";
import type { Partner } from "@/features/partners/types";
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

function initials(name?: string) {
  const parts = (name ?? "").trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

export function PartnerTable({
  rows,
  isLoading,
  isError,
  onView,
  onEdit
}: {
  rows: Partner[];
  isLoading: boolean;
  isError: boolean;
  onView: (p: Partner) => void;
  onEdit: (p: Partner) => void;
}) {
  const headers = ["Name", "Featured", "Updated", "Created", "Action"];

  const handleRowClick = (partner: Partner) => {
    onView(partner);
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
              Failed to load partners.
            </TableCell>
          </TableRow>
        ) : rows.length ? (
          rows.map((p) => (
            <TableRow
              key={p._id}
              onClick={() => handleRowClick(p)}
              className={cn("cursor-pointer hover:bg-muted/50")}
            >
              {/* Name column */}
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                      {initials(p.name)}
                    </div>
                  )}
                  <span className="font-medium">{p.name ?? "—"}</span>
                </div>
              </TableCell>

              {/* Featured column */}
              <TableCell className="whitespace-nowrap">
                <Badge variant={p.featured ? "default" : "secondary"}>
                  {p.featured ? "Featured" : "Standard"}
                </Badge>
              </TableCell>

              {/* Updated column */}
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(p.updatedAt)}
              </TableCell>

              {/* Created column */}
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(p.createdAt)}
              </TableCell>

              {/* Action column */}
              <TableCell className="whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onView(p)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(p)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={headers.length}
              className="h-24 text-center text-muted-foreground"
            >
              No partners found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}