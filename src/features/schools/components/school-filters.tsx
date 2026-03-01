"use client";

import * as React from "react";
import type { SchoolsFilters } from "@/features/schools/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  value: SchoolsFilters;
  onChange: (next: SchoolsFilters) => void;
  onReset: () => void;
};

export function SchoolFilters({ value, onChange, onReset }: Props) {
  const activeCount = Number(!!value.search?.trim());

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by name or description…"
        value={value.search ?? ""}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        className="w-full lg:w-[320px]"
      />

      <div className="flex flex-wrap gap-2">
        {activeCount > 0 && (
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full sm:w-auto"
          >
            Reset
          </Button>
        )}

        <Button
          variant="default"
          className="w-full sm:w-auto"
          onClick={() => window.dispatchEvent(new CustomEvent("school:add"))}
        >
          Add School
        </Button>
      </div>
    </div>
  );
}
