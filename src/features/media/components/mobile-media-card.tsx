import { format } from "date-fns";
import type { Media } from "@/features/media/types";
import { Badge } from "@/components/ui/badge";
import { Image, Video, FileText } from "lucide-react";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function getTypeIcon(type: string) {
  switch (type?.toLowerCase()) {
    case "video":
      return <Video className="w-6 h-6 text-muted-foreground" />;
    case "image":
      return <Image className="w-6 h-6 text-muted-foreground" />;
    case "blog":
      return <FileText className="w-6 h-6 text-muted-foreground" />;
    default:
      return <FileText className="w-6 h-6 text-muted-foreground" />;
  }
}

export function MobileMediaCard({ media }: { media: Media }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        {media.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.coverImage}
            alt={media.title}
            className="h-16 w-16 rounded-lg object-cover border shrink-0"
          />
        ) : (
          <div className="h-16 w-16 rounded-lg border bg-muted flex items-center justify-center shrink-0">
            {getTypeIcon(media.type)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {media.title ?? "—"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            By {media.author ?? "Unknown"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {media.description ?? "No description"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {media.type && (
          <Badge variant="secondary" className="capitalize">
            {media.type}
          </Badge>
        )}
        {media.tag && (
          <Badge variant="outline">{media.tag}</Badge>
        )}
      </div>

      {media.dateCreated && (
        <div className="mt-3 text-xs text-muted-foreground">
          Published: {fmtDate(media.dateCreated)}
        </div>
      )}
    </div>
  );
}