"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import type { TalentRequest } from "../types";
import { getColumns } from "./columns";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

type Props = {
  rows: TalentRequest[];
  isLoading: boolean;
  isUpdating?: boolean; 
  isError: boolean;
  onRowClick: (v: TalentRequest) => void;
  onApprove: (v: TalentRequest) => void;
  onReject: (v: TalentRequest) => void;
};

export function TalentTable({
  rows,
  isLoading,
  isUpdating = false,
  isError,
  onRowClick,
  onApprove,
  onReject
}: Props) {
  const columns = React.useMemo(
    () => getColumns({ onView: onRowClick, onApprove, onReject }),
    [onRowClick, onApprove, onReject]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const showSkeleton = isLoading || isUpdating;

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead key={header.id} className="whitespace-nowrap">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {showSkeleton ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <TableRow key={idx}>
              {columns.map((_, cIdx) => (
                <TableCell key={cIdx} className="whitespace-nowrap">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : isError ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-red-500"
            >
              Failed to load talent requests.
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => onRowClick(row.original)}
              className={cn("cursor-pointer hover:bg-primary/5")}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-muted-foreground"
            >
              No talent requests found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
