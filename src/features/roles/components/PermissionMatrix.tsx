// src/features/roles/components/PermissionMatrix.tsx

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";

const PermCheckbox = React.memo(({ id, checked, disabled, onChange }: any) => (
  <div className="flex items-center justify-center">
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(id, e.target.checked)}
      className={cn("h-4 w-4 rounded border cursor-pointer accent-primary", disabled && "cursor-not-allowed opacity-60")}
    />
  </div>
));

export function PermissionMatrix({
  selected,
  onChange,
  readOnly,
  modules,
  actions,
}: {
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  readOnly: boolean;
  modules: Array<{ key: string; label: string; permissions: string[] }>;
  actions: string[];
}) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredModules = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return modules;
    return modules.filter((m) => m.label.toLowerCase().includes(q) || m.key.toLowerCase().includes(q));
  }, [searchQuery, modules]);

  const columnPermsMap = React.useMemo(() => {
    const map: Record<string, string[]> = {};
    actions.forEach((action) => {
      map[action] = modules.flatMap(({ permissions }) => permissions.filter((p) => p.startsWith(action)));
    });
    return map;
  }, [modules, actions]);

  const toggle = (perm: string, on: boolean) => {
    const next = new Set(selected);
    on ? next.add(perm) : next.delete(perm);
    onChange(next);
  };

  const toggleModule = (permissions: string[], on: boolean) => {
    const next = new Set(selected);
    permissions.forEach((p) => (on ? next.add(p) : next.delete(p)));
    onChange(next);
  };

  const toggleColumn = (action: string, on: boolean) => {
    const next = new Set(selected);
    const colPerms = columnPermsMap[action] || [];
    colPerms.forEach((p) => (on ? next.add(p) : next.delete(p)));
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search modules (e.g. 'Team', 'Events')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9 text-xs h-9"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead className="sticky top-0 z-20 shadow-sm">
              <tr className="bg-muted/90 backdrop-blur-sm">
                <th className="py-2.5 px-3 text-left font-medium text-muted-foreground min-w-45 border-b">
                  Module
                </th>
                {actions.map((action) => {
                  const colPerms = columnPermsMap[action] || [];
                  const allOn = colPerms.length > 0 && colPerms.every((p) => selected.has(p));
                  const someOn = colPerms.some((p) => selected.has(p));
                  return (
                    <th key={action} className="py-2.5 px-2 text-center font-medium text-muted-foreground w-18 border-b">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-xs uppercase tracking-wider">{action}</span>
                        {colPerms.length > 0 && (
                          <input
                            type="checkbox"
                            checked={allOn}
                            disabled={readOnly}
                            ref={(el) => { if (el) el.indeterminate = someOn && !allOn; }}
                            onChange={(e) => toggleColumn(action, e.target.checked)}
                            className={cn("h-3.5 w-3.5 accent-primary cursor-pointer", readOnly && "cursor-not-allowed opacity-60")}
                          />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y bg-background">
              {filteredModules.length ? (
                filteredModules.map(({ key, label, permissions }) => {
                  const moduleSelected = permissions.filter((p) => selected.has(p));
                  const allOn = moduleSelected.length === permissions.length;
                  const someOn = moduleSelected.length > 0;
                  const moduleAllDisabled = permissions.every((p) => readOnly);
                  return (
                    <tr key={key} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-3 border-r">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={allOn}
                            disabled={readOnly}
                            ref={(el) => { if (el) el.indeterminate = someOn && !allOn; }}
                            onChange={(e) => toggleModule(permissions, e.target.checked)}
                            className={cn("h-3.5 w-3.5 accent-primary cursor-pointer shrink-0", readOnly && "cursor-not-allowed opacity-60")}
                          />
                          <span className="text-xs font-semibold text-foreground">{label}</span>
                        </div>
                         
                      </td>
                      {actions.map((action) => {
                        const perm = permissions.find((p) => p.startsWith(action));
                        return (
                          <td key={action} className="py-2.5 px-2 text-center">
                            {perm ? (
                              <PermCheckbox
                                id={perm}
                                checked={selected.has(perm)}
                                disabled={readOnly}
                                onChange={toggle}
                              />
                            ) : (
                              <span className="text-muted-foreground/20 text-[10px]">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={actions.length + 1} className="py-12 text-center text-muted-foreground italic text-xs">
                    No modules found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}