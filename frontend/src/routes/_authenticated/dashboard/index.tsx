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
import { Skeleton } from "@ethui/ui/components/shadcn/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  Copy,
  ExternalLink,
  GitFork,
  Layers,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { deleteStack, fetchStacks } from "~/api/stacks";
import type { Stack } from "~/types/stack";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();

  const {
    data: stacks,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["stacks"],
    queryFn: fetchStacks,
  });

  const handleDelete = async (slug: string) => {
    await deleteStack(slug);
    refetch();
  };

  return (
    <div className="container mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="animate-fade-in opacity-0">
          <h1 className="font-bold text-3xl text-foreground">Your Stacks</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your on-demand Anvil nodes
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: "/dashboard/new" })}
          className="animation-delay-100 animate-fade-in gap-2 opacity-0"
        >
          <Plus className="h-4 w-4" />
          New Stack
        </Button>
      </div>

      {/* Stacks Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : stacks && stacks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stacks.map((stack, index) => (
            <StackCard
              key={stack.id}
              stack={stack}
              onDelete={handleDelete}
              delay={index * 100}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function StackCard({
  stack,
  onDelete,
  delay,
}: {
  stack: Stack;
  onDelete: (slug: string) => void;
  delay: number;
}) {
  return (
    <Card
      className="stack-card flex animate-fade-in-up flex-col rounded-xl shadow-md opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{stack.slug}</CardTitle>
              <p className="font-mono text-muted-foreground text-xs">
                Chain ID: {stack.chainId}
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
              <DropdownMenuItem asChild>
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
      <CardContent className="flex h-full flex-col space-y-3">
        {/* Fork info or Fresh chain indicator */}
        <div className="flex items-center gap-2 rounded-md bg-accent/50 px-3 py-2">
          {stack.anvilOpts.forkUrl ? (
            <>
              <GitFork className="h-4 w-4 text-muted-foreground" />
              <span className="truncate font-mono text-muted-foreground text-xs">
                Forked from block #{stack.anvilOpts.forkBlockNumber}
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

        {/* URLs */}
        <div className="divide-y divide-border rounded-md border border-border bg-accent/30 px-3">
          <UrlRow label="RPC" url={stack.rpcUrl} />
          <UrlRow label="Explorer" url={stack.explorerUrl} isExternal />
          {stack.graphEnabled && stack.graphUrl && (
            <UrlRow label="Subgraph" url={stack.graphUrl} isExternal />
          )}
        </div>

        {/* Spacer to push footer to bottom */}
        <div className="flex-1" />

        {/* Footer: Status + Timestamp */}
        <div className="flex items-center justify-between border-border border-t pt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 font-medium text-green-600 text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            Running
          </span>
          <span className="text-muted-foreground text-xs">
            {formatDistanceToNow(new Date(stack.createdAt))} ago
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function UrlRow({
  label,
  url,
  isExternal,
}: {
  label: string;
  url: string;
  isExternal?: boolean;
}) {
  return (
    <div className="group flex items-center justify-between py-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="flex items-center gap-0.5">
        <ClickToCopy text={url}>
          <button
            type="button"
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title={`Copy ${label} URL`}
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
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

function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Layers className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 font-medium text-foreground text-lg">
        No stacks yet
      </h3>
      <p className="mt-1 max-w-sm text-center text-muted-foreground text-sm">
        Create your first stack to get started with on-demand Anvil nodes.
      </p>
      <Button
        onClick={() => navigate({ to: "/dashboard/new" })}
        className="mt-6 gap-2"
      >
        <Plus className="h-4 w-4" />
        Create Stack
      </Button>
    </div>
  );
}
