import { Button } from "@ethui/ui/components/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ethui/ui/components/shadcn/dialog";

interface DeleteStackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stackSlug: string;
  onConfirm: () => void;
}

export function DeleteStackDialog({
  open,
  onOpenChange,
  stackSlug,
  onConfirm,
}: DeleteStackDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this stack?</DialogTitle>
          <DialogDescription>
            This will permanently delete the stack "{stackSlug}" and all
            associated data. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
