// src/features/volunteer-roles/components/volunteer-role-filters.tsx
"use client";

import * as React from "react";
import type { VolunteerRoleFilters } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function VolunteerRoleFilters({
  value,
  onChange,
  onReset,
  onAdd
}: {
  value: VolunteerRoleFilters;
  onChange: (next: VolunteerRoleFilters) => void;
  onReset: () => void;
  onAdd: () => void;
}) {
  const activeCount = Number(!!value.search?.trim());

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by role name, skill, or description..."
        value={value.search ?? ""}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        className="w-full lg:w-[320px]"
      />

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={onReset}
        >
          Reset{activeCount ? ` (${activeCount})` : ""}
        </Button>

        <Button
          variant="default"
          className="w-full sm:w-auto"
          onClick={onAdd}
        >
          Add Role
        </Button>
      </div>
    </div>
  );
}
