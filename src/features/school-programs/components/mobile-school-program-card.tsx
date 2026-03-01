import { format } from "date-fns";
import type { SchoolProgram } from "@/features/school-programs/types";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function schoolName(program: SchoolProgram) {
  return typeof program.school === "string"
    ? program.school
    : (program.school?.name ?? "—");
}

export function MobileSchoolProgramCard({
  program
}: {
  program: SchoolProgram;
}) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        {program.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={program.image}
            alt={program.title}
            className="h-16 w-16 rounded-lg object-cover border shrink-0"
          />
        ) : (
          <div className="h-16 w-16 rounded-lg border bg-muted flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {program.title ?? "—"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {schoolName(program)} • Cohort {program.cohort ?? "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            {program.briefContent ?? "No description"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {program.state && (
          <Badge variant={program.state === "published" ? "default" : "outline"}>
            {String(program.state)}
          </Badge>
        )}
        {program.publishDate && (
          <Badge variant="secondary">
            Published: {fmtDate(program.publishDate)}
          </Badge>
        )}
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Updated</span>
          <span>{fmtDate(program.updatedAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(program.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}