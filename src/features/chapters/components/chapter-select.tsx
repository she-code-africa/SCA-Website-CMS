"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
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
  const { data, isLoading, isError } = useQuery({
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
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full sm:w-70">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading chapters…
          </div>
        )}
        {isError && (
          <div className="py-4 text-center text-sm text-red-500">
            Failed to load chapters.
          </div>
        )}
        {!isLoading &&
          !isError &&
          chapters.map((ch: any) => (
            <SelectItem key={ch._id} value={ch._id}>
              {ch.name}
            </SelectItem>
          ))}
        {!isLoading && !isError && chapters.length === 0 && (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No chapters available.
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
