// // src/features/activity-log/components/activity-log-filters.tsx
// import * as React from "react";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { cn } from "@/lib/utils/utils";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { PermissionGate } from "@/components/PermissionGate";
// import { PERMISSIONS } from "@/lib/rbac/permissions";

// const calendarClassNames = {
//   months: "flex flex-col sm:flex-row gap-4",
//   month: "space-y-4",
//   caption: "flex justify-center pt-1 relative items-center",
//   caption_label: "text-sm font-medium",
//   nav: "space-x-1 flex items-center",
//   nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
//   nav_button_previous: "absolute left-1",
//   nav_button_next: "absolute right-1",
//   table: "w-full border-collapse space-y-1",
//   head_row: "flex",
//   head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
//   row: "flex w-full mt-2",
//   cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent [&:has([aria-selected])]:text-accent-foreground",
//   day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
//   day_selected:
//     "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
//   day_today: "bg-accent text-accent-foreground",
//   day_outside: "text-muted-foreground opacity-50",
//   day_disabled: "text-muted-foreground opacity-50",
//   day_range_middle:
//     "aria-selected:bg-accent aria-selected:text-accent-foreground",
//   day_hidden: "invisible"
// };

// interface ActivityLogFiltersProps {
//   globalFilter: string;
//   onGlobalFilterChange: (value: string) => void;
//   startDate: Date | null;
//   onStartDateChange: (date: Date | null) => void;
//   endDate: Date | null;
//   onEndDateChange: (date: Date | null) => void;
//   onReset: () => void;
//   onExportClick: () => void;
// }

// export function ActivityLogFilters({
//   globalFilter,
//   onGlobalFilterChange,
//   startDate,
//   onStartDateChange,
//   endDate,
//   onEndDateChange,
//   onReset,
//   onExportClick
// }: ActivityLogFiltersProps) {
// return (
//   <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
//     <Input
//       placeholder="Search by user, role, action, and page..."
//       value={globalFilter ?? ""}
//       onChange={(e) => onGlobalFilterChange(e.target.value)}
//       className="w-full lg:w-48"
//     />

//     {/* Start date */}
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           className={cn(
//             "w-full sm:w-50 justify-start text-left font-normal",
//             !startDate && "text-muted-foreground"
//           )}
//         >
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           {startDate ? format(startDate, "PPP") : "Start date"}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent
//         align="start"
//         sideOffset={8}
//         className="z-50 w-auto min-w-70 rounded-md border p-0 shadow-md"
//       >
//         <Calendar
//           mode="single"
//           selected={startDate ?? undefined}
//           onSelect={(d) => onStartDateChange(d ?? null)}
//           initialFocus
//           className="bg-background p-3"
//           classNames={calendarClassNames}
//         />
//       </PopoverContent>
//     </Popover>

//     {/* End date */}
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           className={cn(
//             "w-full sm:w-50 justify-start text-left font-normal",
//             !endDate && "text-muted-foreground"
//           )}
//         >
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           {endDate ? format(endDate, "PPP") : "End date"}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent
//         align="start"
//         sideOffset={8}
//         className="z-50 w-auto min-w-70 rounded-md border p-0 shadow-md"
//       >
//         <Calendar
//           mode="single"
//           selected={endDate ?? undefined}
//           onSelect={(d) => onEndDateChange(d ?? null)}
//           initialFocus
//           className="bg-background p-3"
//           classNames={calendarClassNames}
//         />
//       </PopoverContent>
//     </Popover>

//     <Button
//       variant="secondary"
//       onClick={onReset}
//       className="w-full sm:w-auto hover:bg-primary/10"
//     >
//       Reset
//     </Button>

//     <PermissionGate permission={PERMISSIONS.EXPORT_DASHBOARD_DATA}>
//       <Button
//         variant="default"
//         onClick={onExportClick}
//         className="w-full sm:w-auto bg-primary hover:bg-primary/90"
//       >
//         Export
//       </Button>
//     </PermissionGate>
//   </div>
// );
// }

import * as React from "react";
import type { DateRangePreset } from "@/features/activity-log/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

interface ActivityLogFiltersProps {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  datePreset: DateRangePreset;
  onDatePresetChange: (preset: DateRangePreset) => void;
  onReset: () => void;
  onExportClick: () => void;
}

export function ActivityLogFilters({
  globalFilter,
  onGlobalFilterChange,
  datePreset,
  onDatePresetChange,
  onReset,
  onExportClick
}: ActivityLogFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Search by user, role, action, and page..."
        value={globalFilter ?? ""}
        onChange={(e) => onGlobalFilterChange(e.target.value)}
        className="w-full lg:w-55"
      />

      <Select value={datePreset} onValueChange={onDatePresetChange}>
        <SelectTrigger className="w-full lg:w-48">
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="last7">Last 7 days</SelectItem>
          <SelectItem value="last30">Last 30 days</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="secondary"
        onClick={onReset}
        className="w-auto hover:bg-primary/10"
      >
        Reset
      </Button>

      <PermissionGate permission={PERMISSIONS.EXPORT_DASHBOARD_DATA}>
        <Button
          variant="default"
          onClick={onExportClick}
          className="w-auto bg-primary hover:bg-primary/90"
        >
          Export
        </Button>
      </PermissionGate>
    </div>
  );
}