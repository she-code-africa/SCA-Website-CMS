"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTeamCategory,
  deleteTeamCategory,
  editTeamCategories,
  getTeamCategories
} from "@/features/team/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { PermissionGate } from "@/components/PermissionGate";
import { usePermissions } from "@/hooks/usePermissions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";


// function getCount(c: any) {
//   // supports different backend shapes safely
//   return (
//     c?.membersCount ??
//     c?.memberCount ??
//     c?.totalMembers ??
//     (Array.isArray(c?.members) ? c.members.length : undefined)
//   );
// }

export function TeamCategoriesPanel() {
  const qc = useQueryClient();
  const [name, setName] = React.useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["team-categories"],
    queryFn: getTeamCategories
  });

  const addMut = useMutation({
    mutationFn: addTeamCategory,
    onSuccess: () => {
      toast.success("Category added");
      setName("");
      qc.invalidateQueries({ queryKey: ["team-categories"] });
    },
    onError: () => toast.error("Could not add category")
  });

  const editMut = useMutation({
    mutationFn: editTeamCategories,
    onSuccess: () => {
      toast.success("Category updated");
      qc.invalidateQueries({ queryKey: ["team-categories"] });
      qc.invalidateQueries({ queryKey: ["team"] }); // optional: if team list depends on names
    },
    onError: () => toast.error("Could not update category")
  });

  const delMut = useMutation({
    mutationFn: deleteTeamCategory,
    onSuccess: () => {
      toast.success("Category deleted");
      qc.invalidateQueries({ queryKey: ["team-categories"] });
      qc.invalidateQueries({ queryKey: ["team"] });
    },
    onError: () => toast.error("Could not delete category")
  });

  return (
    <Card className="rounded-xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Team Categories</CardTitle>

          <Badge variant="secondary" className="shrink-0">
            {isLoading ? "…" : data.length} total
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          Create, rename, and manage categories.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add category */}
        <PermissionGate permission="CREATE_TEAMCATEGORIES">

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="New category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              const v = name.trim();
              if (!v) return;
              addMut.mutate({ name: v });
            }}
            disabled={addMut.isPending}
          >
            {addMut.isPending ? "Adding…" : "Add"}
          </Button>
        </div>
        </PermissionGate>

        {/* List */}
        <div className="rounded-md border">
          {isLoading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading…</div>
          ) : data.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No categories yet.
            </div>
          ) : (
            <ul className="divide-y">
              {data.map((c: any) => (
                <li key={c._id}>
                  <CategoryRow
                    id={c._id}
                    initialName={c.name}
                    // count={getCount(c)}
                    saving={editMut.isPending}
                    deleting={delMut.isPending}
                    onSave={(next) =>
                      editMut.mutate({ catId: c._id, name: next })
                    }
                    onDelete={() => delMut.mutate(c._id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryRow({
  initialName,
  onSave,
  onDelete,
  saving,
  deleting
}: {
  id: string;
  initialName: string;
  count?: number;
  onSave: (name: string) => void;
  onDelete: () => void;
  saving: boolean;
  deleting: boolean;
}) {
  const [editing, setEditing] = React.useState(false);
  const [val, setVal] = React.useState(initialName);

  React.useEffect(() => setVal(initialName), [initialName]);

  const canSave = val.trim().length > 0 && val.trim() !== initialName.trim();
  const { can } = usePermissions();
  const canUpdate = can("UPDATE_TEAMCATEGORIES");
  const canDelete = can("DELETE_TEAMCATEGORIES");

  // If the user can't do either, we should hide the Actions menu entirely
  const hasActions = canUpdate || canDelete;

  return (
    <div className="flex items-center justify-between gap-3 p-3 hover:bg-muted/50 transition-colors">
      {/* Left: name + meta */}
      <div className="min-w-0 flex-1">
        {!editing ? (
          <div className="flex items-center gap-2 min-w-0">
            <p className="truncate text-sm font-medium">{initialName}</p>

            {/* <Badge variant="outline" className="shrink-0">
              {typeof count === "number" ? `${count} members` : "— members"}
            </Badge> */}
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full sm:max-w-[320px]"
              autoFocus
            />

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  const next = val.trim();
                  if (!next) return;
                  onSave(next);
                  setEditing(false);
                }}
                disabled={!canSave || saving}
              >
                {saving ? "Saving…" : "Save"}
              </Button>

              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => {
                  setVal(initialName);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Right: actions menu */}
      {!editing && hasActions && (
        <div className="shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              {canUpdate && (
              <DropdownMenuItem onClick={() => setEditing(true)}>
                Rename
              </DropdownMenuItem>

              )}

{canDelete && (

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onSelect={(e) => e.preventDefault()} // keep menu open behavior stable
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>

                      <div className="space-y-1">
                        <AlertDialogTitle className="text-base">
                          Delete category
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action can’t be undone. Any team members linked
                          to this category may be affected.
                        </AlertDialogDescription>
                      </div>
                    </div>
                  </AlertDialogHeader>

                  <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      disabled={deleting}
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                      {deleting ? "Deleting…" : "Delete category"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
)}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
