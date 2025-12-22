import { Button } from "@ethui/ui/components/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ethui/ui/components/shadcn/dialog";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Layers, Trash2 } from "lucide-react";
import type { Stack } from "~/api/stacks";

interface StackDetailHeaderProps {
  stack: Stack;
  onDelete: () => void;
}

export function StackDetailHeader({ stack, onDelete }: StackDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8 animate-fade-in opacity-0">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/dashboard" })}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-3xl text-foreground">{stack.slug}</h1>
            <p className="font-mono text-muted-foreground">
              Chain ID: {stack.chain_id}
            </p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Stack
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this stack?</DialogTitle>
              <DialogDescription>
                This will permanently delete the stack "{stack.slug}" and all
                associated data. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

