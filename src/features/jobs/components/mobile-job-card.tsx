// src/features/jobs/components/mobile-job-card.tsx
import { format } from "date-fns";
import { MapPin, Calendar, Briefcase } from "lucide-react";
import type { Job } from "@/features/jobs/types";
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

function getJobTypeName(jobType: any): string {
  if (!jobType) return "—";
  if (typeof jobType === "string") return jobType;
  return jobType.name ?? "—";
}

function getJobCategoryName(jobCategory: any): string {
  if (!jobCategory) return "—";
  if (typeof jobCategory === "string") return jobCategory;
  return jobCategory.name ?? "—";
}

export function MobileJobCard({ job }: { job: Job }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="space-y-3">
        {/* Title and State */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{job.title ?? "—"}</p>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
              {job.description ?? "—"}
            </p>
          </div>
          <Badge variant={stateVariant(job.state)}>
            {job.state ?? "draft"}
          </Badge>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            <MapPin className="h-3 w-3" />
            {job.location ?? "—"}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Calendar className="h-3 w-3" />
            {fmtDate(job.deadline)}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Briefcase className="h-3 w-3" />
            {getJobTypeName(job.jobType)}
          </Badge>
        </div>

        {/* Details */}
        <div className="grid gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Category</span>
            <span>{getJobCategoryName(job.jobCategory)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Created</span>
            <span>{fmtDate(job.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
