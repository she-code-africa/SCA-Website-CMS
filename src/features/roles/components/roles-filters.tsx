"use client";

import * as React from "react";
import type { RolesFilters } from "@/features/roles/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

type FiltersProps = {
  value: RolesFilters;
  onChange: (next: RolesFilters) => void;
  onReset: () => void;
  onCreate: () => void;
};

export function RolesFiltersBar({
  value,
  onChange,
  onReset,
  onCreate
}: FiltersProps) {
  const activeCount = Number(!!value.type);

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search roles…"
        value={value.search ?? ""}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        className="w-full lg:w-65"
      />

      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Filters{activeCount ? ` (${activeCount})` : ""}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={8}
            className="z-50 w-65 rounded-md border p-4 shadow-md"
          >
            <div className="grid gap-3">
              <div className="grid gap-1">
                <p className="text-sm font-medium">Type</p>
                <Select
                  value={value.type || "all"}
                  onValueChange={(v) =>
                    onChange({
                      ...value,
                      type: v === "all" ? "" : (v as "default" | "custom")
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="default">System roles</SelectItem>
                    <SelectItem value="custom">Custom roles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="secondary" onClick={onReset} className="w-full">
                Reset
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <PermissionGate permission={PERMISSIONS.CREATE_ROLE}>
          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={onCreate}
          >
            Create Role
          </Button>
        </PermissionGate>
      </div>
    </div>
  );
}
