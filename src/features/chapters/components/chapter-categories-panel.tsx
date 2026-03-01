// src/features/chapters/components/chapter-categories-panel.tsx
"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addChapterCategory,
  deleteChapterCategory,
  editChapterCategory,
  getChapterCategories
} from "@/features/chapters/api";

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
import { Trash2 } from "lucide-react";

export function ChapterCategoriesPanel() {
  const qc = useQueryClient();
  const [name, setName] = React.useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["chapter-categories"],
    queryFn: getChapterCategories
  });

  const addMut = useMutation({
    mutationFn: addChapterCategory,
    onSuccess: () => {
      toast.success("Category added");
      setName("");
      qc.invalidateQueries({ queryKey: ["chapter-categories"] });
    },
    onError: () => toast.error("Could not add category")
  });

  const editMut = useMutation({
    mutationFn: editChapterCategory,
    onSuccess: () => {
      toast.success("Category updated");
      qc.invalidateQueries({ queryKey: ["chapter-categories"] });
    },
    onError: () => toast.error("Could not update category")
  });

  const delMut = useMutation({
    mutationFn: deleteChapterCategory,
    onSuccess: () => {
      toast.success("Category deleted");
      qc.invalidateQueries({ queryKey: ["chapter-categories"] });
    },
    onError: () => toast.error("Could not delete category")
  });

  return (
    <Card className="rounded-xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Chapter Categories</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {isLoading ? "…" : data.length} total
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage chapter categories.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="New category"
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
                <CategoryRow
                  key={c._id}
                  id={c._id}
                  initialName={c.name}
                  saving={editMut.isPending}
                  deleting={delMut.isPending}
                  onSave={(next) =>
                    editMut.mutate({ id: c._id, data: { name: next } })
                  }
                  onDelete={() => delMut.mutate(c._id)}
                />
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryRow({
  id,
  initialName,
  onSave,
  onDelete,
  saving,
  deleting
}: {
  id: string;
  initialName: string;
  onSave: (name: string) => void;
  onDelete: () => void;
  saving: boolean;
  deleting: boolean;
}) {
  const [editing, setEditing] = React.useState(false);
  const [val, setVal] = React.useState(initialName);

  React.useEffect(() => setVal(initialName), [initialName]);

  const canSave = val.trim().length > 0 && val.trim() !== initialName.trim();

  return (
    <div className="flex items-center justify-between gap-3 p-3 hover:bg-muted/50 transition-colors">
      <div className="min-w-0 flex-1">
        {!editing ? (
          <p className="truncate text-sm font-medium">{initialName}</p>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full sm:max-w-[320px]"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
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
                size="sm"
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

      {!editing && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditing(true)}>
              Rename
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-red-600"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete category?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} disabled={deleting}>
                    {deleting ? "Deleting…" : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
