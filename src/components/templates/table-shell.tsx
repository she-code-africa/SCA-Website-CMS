// src/components/templates/table-shell.tsx
import * as React from "react";
import { cn } from "@/lib/utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  description?: string;
  right?: React.ReactNode; // right-side header controls (optional)
  children: React.ReactNode; // the actual table / list / content
  className?: string;
};

export function TableShell({
  title,
  description,
  right,
  children,
  className,
}: Props) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-0.5 mb-6">
            <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
      </CardHeader>

      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
