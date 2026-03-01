// src/features/chapters/components/chapter-select.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { getChapters } from "@/features/chapters/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ChapterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function ChapterSelect({
  value,
  onValueChange,
  placeholder = "Select a chapter"
}: ChapterSelectProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["chapters-all"],
    queryFn: () => getChapters(1, 1000),
    staleTime: 60_000
  });

  const chapters = React.useMemo(() => {
    if (!data?.data) return [];
    return data.data
      .sort((a: any, b: any) => a.name.localeCompare(b.name))
      .map((ch: any) => ({
        _id: ch._id,
        name: ch.name
      }));
  }, [data]);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={isLoading}>
      <SelectTrigger className="w-full sm:w-[280px]">
        <SelectValue
          placeholder={isLoading ? "Loading chapters..." : placeholder}
        />
      </SelectTrigger>
      <SelectContent>
        {chapters.map((ch: any) => (
          <SelectItem key={ch._id} value={ch._id}>
            {ch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
