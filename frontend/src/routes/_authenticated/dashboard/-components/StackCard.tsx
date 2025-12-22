import { ClickToCopy } from "@ethui/ui/components/click-to-copy";
import { Button } from "@ethui/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ethui/ui/components/shadcn/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ethui/ui/components/shadcn/dropdown-menu";

import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  Copy,
  ExternalLink,
  GitFork,
  Layers,
  MoreVertical,
  Trash2,
} from "lucide-react";
import type { Stack } from "~/api/stacks";

interface StackCardProps {
  stack: Stack;
  onDelete: (slug: string) => void;
}

export function StackCard({ stack, onDelete }: StackCardProps) {
  return (
    <Card className="stack-card flex animate-fade-in-up flex-col rounded-xl shadow-md opacity-0">
      <StackCardHeader stack={stack} onDelete={onDelete} />
      <StackCardContent stack={stack} />
    </Card>
  );
}

interface StackCardHeaderProps {
  stack: Stack;
  onDelete: (slug: string) => void;
}

function StackCardHeader({ stack, onDelete }: StackCardHeaderProps) {
  return (
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
            {/* TODO: Needs to be implemented */}
            <DropdownMenuItem asChild disabled={true}>
              <Link to="/dashboard/$slug" params={{ slug: stack.slug }}>
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(stack.slug)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
  );
}

interface StackCardContentProps {
  stack: Stack;
}

function StackCardContent({ stack }: StackCardContentProps) {
  return (
    <CardContent className="flex h-full flex-col space-y-3">
      <ForkIndicator stack={stack} />
      <UrlList stack={stack} />
      <div className="flex-1" />
      <StackCardFooter stack={stack} />
    </CardContent>
  );
}

interface ForkIndicatorProps {
  stack: Stack;
}

function ForkIndicator({ stack }: ForkIndicatorProps) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-accent/50 px-3 py-2">
      {stack.anvil_opts ? (
        <>
          <GitFork className="h-4 w-4 text-muted-foreground" />
          <span className="truncate font-mono text-muted-foreground text-xs">
            {stack.anvil_opts.fork_block_number
              ? `Forked from block ${stack.anvil_opts.fork_block_number}`
              : "Forked from latest block"}
          </span>
        </>
      ) : (
        <>
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-muted-foreground text-xs">
            Fresh chain
          </span>
        </>
      )}
    </div>
  );
}

interface UrlListProps {
  stack: Stack;
}

function UrlList({ stack }: UrlListProps) {
  return (
    <div className="divide-y divide-border rounded-md border border-border bg-accent/30 px-3">
      <UrlRow label="RPC" url={stack.rpc_url} />
      {stack.anvil_opts?.fork_url && (
        <UrlRow label="Fork RPC" url={stack.anvil_opts.fork_url} />
      )}
      {/* TODO: Use the actual explorer URL */}
      <UrlRow
        label="Explorer"
        url={`https://explorer.ethui.dev/rpc/${btoa(stack.rpc_url)}`}
        isExternal
      />

      {stack.graph_url && (
        <UrlRow label="Subgraph" url={stack.graph_url} isExternal />
      )}
    </div>
  );
}

interface StackCardFooterProps {
  stack: Stack;
}

function StackCardFooter({ stack }: StackCardFooterProps) {
  return (
    <div className="flex items-center justify-between border-border border-t pt-3">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 font-medium text-green-600 text-xs">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
        Running
      </span>
      <span className="text-muted-foreground text-xs">
        {formatDistanceToNow(new Date(stack.inserted_at * 1000))} ago
      </span>
    </div>
  );
}

interface UrlRowProps {
  label: string;
  url: string;
  isExternal?: boolean;
}

function UrlRow({ label, url, isExternal }: UrlRowProps) {
  return (
    <div className="group flex cursor-default items-center justify-between py-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="flex items-center gap-0.5">
        <ClickToCopy text={url} className="p-1">
          <Copy className="h-3.5 w-3.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" />
        </ClickToCopy>
        {isExternal && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title={`Open ${label}`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
