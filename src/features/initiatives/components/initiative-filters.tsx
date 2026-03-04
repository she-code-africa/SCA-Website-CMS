// src/features/initiatives/components/initiative-filters.tsx
"use client";

import type { InitiativeFilters } from "@/features/initiatives/types";
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

type Props = {
  value: InitiativeFilters;
  onChange: (next: InitiativeFilters) => void;
  onReset: () => void;
};

export function InitiativeFilters({ value, onChange, onReset }: Props) {
const activeCount =
  Number(!!value.search?.trim()) +
  Number(!!value.isAvailable) + // Checks if it's "true" or "false" vs undefined/empty
  Number(!!value.sortBy);

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by name…"
        value={value.search ?? ""}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        className="w-full lg:w-[320px]"
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
            className="z-50 w-85 max-w-[calc(100vw-2rem)] rounded-md border p-4 shadow-md"
          >
            <div className="grid gap-3">
              <div className="grid gap-1">
                <p className="text-sm font-medium">Availability</p>
                <Select
                  value={value.isAvailable ?? "all"}
                  onValueChange={(v) =>
                    onChange({
                      ...value,
                      isAvailable: v === "all" ? "" : (v as "true" | "false")
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="true">Available</SelectItem>
                    <SelectItem value="false">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <p className="text-sm font-medium">Sort By</p>
                <Select
                  value={value.sortBy ?? "all"}
                  onValueChange={(v) =>
                    onChange({
                      ...value,
                      sortBy: v === "all" ? "" : (v as "createdAt" | "updatedAt" | "title")
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Default</SelectItem>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="updatedAt">Date Updated</SelectItem>
                    <SelectItem value="title">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="secondary" onClick={onReset} className="w-full">
                Reset All Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="default"
          className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("initiative:add"))
          }
        >
          Add Initiative
        </Button>
      </div>
    </div>
  );
}
