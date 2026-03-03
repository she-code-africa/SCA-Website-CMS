"use client";

import * as React from "react";
import type { TeamMembersFilters } from "@/features/team/types";
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

type Props = {
  value: TeamMembersFilters;
  onChange: (next: TeamMembersFilters) => void;
  onReset: () => void;
};

export function TeamFilters({ value, onChange, onReset }: Props) {
  const activeCount =
    Number(!!value.search?.trim()) +
    Number(!!value.isLeader) +
    Number(!!value.state) +
    Number(!!value.team);

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by name, role, or team…"
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
                <p className="text-sm font-medium">Team Lead</p>
                <Select
                  value={value.isLeader ?? "all"}
                  onValueChange={(v) =>
                    onChange({
                      ...value,
                      isLeader: v === "all" ? "" : (v as any)
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <p className="text-sm font-medium">State</p>
                <Select
                  value={value.state ?? "all"}
                  onValueChange={(v) =>
                    onChange({ ...value, state: v === "all" ? "" : (v as any) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <p className="text-sm font-medium">Team</p>
                <Select
                  value={value.team ?? "all"}
                  onValueChange={(v) =>
                    onChange({ ...value, team: v === "all" ? "" : (v as any) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="Dev team">Dev team</SelectItem>
                    <SelectItem value="Support Team">Support Team</SelectItem>
                    <SelectItem value="Advisors">Advisors</SelectItem>
                    <SelectItem value="Full Time">Full Time</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear team only */}
                <Button
                  type="button"
                  variant="ghost"
                  className="justify-start px-0 text-muted-foreground hover:text-foreground"
                  onClick={() => onChange({ ...value, team: "" })}
                >
                  Clear team filter
                </Button>
              </div>

              <Button variant="secondary" onClick={onReset} className="w-full">
                Reset All Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

<PermissionGate permission="CREATE_TEAM">

        <Button
          variant="default"
          className="w-full sm:w-auto"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("team:add-member"))
          }
        >
          Add Member
        </Button>
</PermissionGate>
      </div>
    </div>
  );
}
