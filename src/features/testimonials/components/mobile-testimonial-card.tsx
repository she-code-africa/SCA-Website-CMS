// src/features/testimonials/components/mobile-testimonial-card.tsx
import { format } from "date-fns";
import type { Testimonial } from "@/features/testimonials/types";
import { Badge } from "@/components/ui/badge";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function stateVariant(state?: string) {
  if (state === "published") return "default";
  if (state === "archived") return "destructive";
  return "secondary"; // draft
}

function initials(name?: string) {
  const parts = (name ?? "").trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

export function MobileTestimonialCard({
  testimonial
}: {
  testimonial: Testimonial;
}) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        {testimonial.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="h-10 w-10 rounded-full object-cover border"
          />
        ) : (
          <div className="h-10 w-10 rounded-full border bg-muted flex items-center justify-center text-xs font-semibold">
            {initials(testimonial.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {testimonial.name ?? "—"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {testimonial.role ?? "—"}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant={stateVariant(testimonial.state)}>
              {testimonial.state ?? "draft"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Testimonial</span>
          <span className="max-w-[70%] truncate text-right">
            {testimonial.testimonial?.substring(0, 50) ?? "—"}...
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Updated</span>
          <span>{fmtDate(testimonial.updatedAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(testimonial.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
