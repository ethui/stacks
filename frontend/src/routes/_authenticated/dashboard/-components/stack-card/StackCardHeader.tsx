import { Button } from "@ethui/ui/components/shadcn/button";
import { CardHeader, CardTitle } from "@ethui/ui/components/shadcn/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ethui/ui/components/shadcn/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { Key, Layers, MoreVertical, Trash2, Wallet } from "lucide-react";
import { useState } from "react";
import type { Stack } from "~/api/stacks";
import { DeleteStackDialog } from "./DeleteStackDialog";

interface StackCardHeaderProps {
  stack: Stack;
  onDelete: (slug: string) => void;
}

export function StackCardHeader({ stack, onDelete }: StackCardHeaderProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(stack.slug);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{stack.slug}</CardTitle>
              <p className="font-mono text-muted-foreground text-xs">
                Chain ID: {stack.chain_id}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to="/dashboard/$slug/add-chain"
                  params={{ slug: stack.slug }}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Add to Wallet
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to="/dashboard/$slug/addresses"
                  params={{ slug: stack.slug }}
                >
                  <Key className="mr-2 h-4 w-4" />
                  View Addresses
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <DeleteStackDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        stackSlug={stack.slug}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
