"use client";

import * as React from "react";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type Trend = "up" | "down" | "neutral";

type StatCardProps = {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;

  trend?: Trend;
  trendValue?: string; // e.g. "+12.3%" or "New"
  trendLabel?: string; // e.g. "Since last month"

  className?: string;
};

export function StatCard({
  title,
  value,
  icon,
  isLoading = false,
  trend = "neutral",
  trendValue,
  trendLabel,
  className
}: StatCardProps) {
  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : null;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-md",
        className
      )}
    >
      {/* subtle top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-muted/40 to-transparent" />

      <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </CardTitle>

        {icon && (
          <div className="shrink-0 rounded-lg bg-primary/10 text-primary p-2 ring-1 ring-primary/15">
            {icon}
          </div>
        )}
      </CardHeader>

      <CardContent className="relative">
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-24 animate-pulse" />
              <Skeleton className="h-4 w-40 animate-pulse" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-semibold leading-none">{value}</div>

              {(trendValue || trendLabel) && (
                <div className="flex items-center gap-2 text-xs">
                  {trendValue && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium",
                        trend === "up" &&
                          "bg-primary/10 text-primary ring-1 ring-primary/15",
                        trend === "down" &&
                          "bg-destructive/10 text-destructive ring-1 ring-destructive/15",
                        trend === "neutral" && "bg-muted text-muted-foreground"
                      )}
                    >
                      {TrendIcon && <TrendIcon className="h-3.5 w-3.5" />}
                      {trendValue}
                    </span>
                  )}

                  {trendLabel && (
                    <span className="text-muted-foreground">{trendLabel}</span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
