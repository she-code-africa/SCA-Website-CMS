// src/features/activity-log/components/activity-log-export-dialog.tsx
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

const calendarClassNames = {
  months: "flex flex-col sm:flex-row gap-4",
  month: "space-y-4",
  caption: "flex justify-center pt-1 relative items-center",
  caption_label: "text-sm font-medium",
  nav: "space-x-1 flex items-center",
  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
  table: "w-full border-collapse space-y-1",
  head_row: "flex",
  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
  row: "flex w-full mt-2",
  cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent [&:has([aria-selected])]:text-accent-foreground",
  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
  day_selected:
    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
  day_today: "bg-accent text-accent-foreground",
  day_outside: "text-muted-foreground opacity-50",
  day_disabled: "text-muted-foreground opacity-50",
  day_range_middle:
    "aria-selected:bg-accent aria-selected:text-accent-foreground",
  day_hidden: "invisible"
};

interface ActivityLogExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exportStart: Date | null;
  onExportStartChange: (date: Date | null) => void;
  exportEnd: Date | null;
  onExportEndChange: (date: Date | null) => void;
  isExporting: boolean;
  onExport: () => void;
  onCancel: () => void;
}

export function ActivityLogExportDialog({
  open,
  onOpenChange,
  exportStart,
  onExportStartChange,
  exportEnd,
  onExportEndChange,
  isExporting,
  onExport,
  onCancel
}: ActivityLogExportDialogProps) {
  const hasDateError = exportStart && exportEnd && exportStart > exportEnd;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <DialogTitle>Export Activity Logs</DialogTitle>
          <DialogDescription>
            Select a date range and export as CSV.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !exportStart && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {exportStart ? format(exportStart, "PPP") : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={8}
                className="z-50 w-auto min-w-70 rounded-md border p-0 shadow-md"
              >
                <Calendar
                  mode="single"
                  selected={exportStart ?? undefined}
                  onSelect={(d) => onExportStartChange(d ?? null)}
                  initialFocus
                  className="bg-background p-3"
                  classNames={calendarClassNames}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !exportEnd && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {exportEnd ? format(exportEnd, "PPP") : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={8}
                className="z-50 w-auto min-w-70 rounded-md border p-0 shadow-md"
              >
                <Calendar
                  mode="single"
                  selected={exportEnd ?? undefined}
                  onSelect={(d) => onExportEndChange(d ?? null)}
                  initialFocus
                  className="bg-background p-3"
                  classNames={calendarClassNames}
                />
              </PopoverContent>
            </Popover>
          </div>

          {hasDateError && (
            <p className="text-sm text-red-500">
              Start date cannot be after end date.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isExporting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={onExport}
              disabled={
                !exportStart || !exportEnd || !!hasDateError || isExporting
              }
            >
              {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
