"use client";

import * as React from "react";
import type { UsersFilters } from "@/features/users/types";
import { usePermissions } from "@/hooks/usePermissions"; // 1. Import the hook
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

type Role = { id: string; name: string };

type Props = {
  value: UsersFilters;
  onChange: (next: UsersFilters) => void;
  onReset: () => void;
  roles: Role[];
  onInvite: () => void;
};

export function UserFilters({ value, onChange, onReset, roles, onInvite }: Props) {
  const { can } = usePermissions(); // 2. Initialize permissions

  const activeCount =
    Number(!!value.search?.trim()) +
    Number(!!value.roleId) +
    Number(!!value.status);

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by name or email…"
        value={value.search ?? ""}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        className="w-full lg:w-75"
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
            className="z-50 w-75 max-w-[calc(100vw-2rem)] rounded-md border p-4 shadow-md"
          >
            <div className="grid gap-3">
              {/* Role Filter */}
              <div className="grid gap-1">
                <p className="text-sm font-medium">Role</p>
                <Select
                  value={value.roleId ?? "all"}
                  onValueChange={(v) =>
                    onChange({ ...value, roleId: v === "all" ? "" : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any role</SelectItem>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="grid gap-1">
                <p className="text-sm font-medium">Status</p>
                <Select
                  value={value.status ?? "all"}
                  onValueChange={(v) =>
                    onChange({ ...value, status: v === "all" ? "" : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="secondary" onClick={onReset} className="w-full">
                Reset All Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* 3. Wrap Invite Button in Permission Check */}
        {can("CREATE_USER") && (
          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={onInvite}
          >
            Invite User
          </Button>
        )}
      </div>
    </div>
  );
}
