import { ClickToCopy } from "@ethui/ui/components/click-to-copy";
import { Button } from "@ethui/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ethui/ui/components/shadcn/card";
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
import { Skeleton } from "@ethui/ui/components/shadcn/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Clock,
  Copy,
  Database,
  ExternalLink,
  GitFork,
  Globe,
  Layers,
  Link as LinkIcon,
  Trash2,
} from "lucide-react";
import { deleteStack, fetchStack } from "~/api/stacks";

export const Route = createFileRoute("/_authenticated/dashboard/$slug")({
  component: StackDetailPage,
});

function StackDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: stack, isLoading } = useQuery({
    queryKey: ["stack", slug],
    queryFn: () => fetchStack(slug),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteStack(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stacks"] });
      navigate({ to: "/dashboard" });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-6 py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (!stack) {
    return (
      <div className="container mx-auto max-w-5xl px-6 py-8">
        <div className="text-center">
          <h2 className="font-medium text-foreground text-xl">
            Stack not found
          </h2>
          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/dashboard" })}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-6 py-8">
      {/* Header */}
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
              <h1 className="font-bold text-3xl text-foreground">
                {stack.slug}
              </h1>
              <p className="font-mono text-muted-foreground">
                Chain ID: {stack.chainId}
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
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate()}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Connection Details */}
        <Card className="animation-delay-100 animate-fade-in-up rounded-xl shadow-md opacity-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LinkIcon className="h-4 w-4" />
              Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="RPC URL" value={stack.rpcUrl} copyable />
            <DetailRow
              label="Explorer"
              value={stack.explorerUrl}
              copyable
              external
            />
            {stack.ipfsUrl && (
              <DetailRow label="IPFS" value={stack.ipfsUrl} copyable />
            )}
          </CardContent>
        </Card>

        {/* Fork Details */}
        <Card className="animation-delay-200 animate-fade-in-up rounded-xl shadow-md opacity-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GitFork className="h-4 w-4" />
              Fork Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stack.anvilOpts.forkUrl ? (
              <>
                <DetailRow
                  label="Fork URL"
                  value={stack.anvilOpts.forkUrl}
                  copyable
                />
                <DetailRow
                  label="Fork Block"
                  value={`#${stack.anvilOpts.forkBlockNumber?.toLocaleString()}`}
                />
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                This stack is not forked from any network.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Subgraph */}
        <Card className="animation-delay-300 animate-fade-in-up rounded-xl shadow-md opacity-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-4 w-4" />
              Subgraph
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stack.graphEnabled ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-success text-xs">
                    <Globe className="h-3 w-3" />
                    Enabled
                  </span>
                </div>
                {stack.graphUrl && (
                  <DetailRow
                    label="Graph URL"
                    value={stack.graphUrl}
                    copyable
                  />
                )}
                {stack.graphRpcUrl && (
                  <DetailRow
                    label="Graph RPC"
                    value={stack.graphRpcUrl}
                    copyable
                  />
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Subgraph indexing is not enabled for this stack.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card className="animation-delay-400 animate-fade-in-up rounded-xl shadow-md opacity-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-4 w-4" />
              Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow
              label="Created"
              value={`${format(new Date(stack.createdAt), "PPp")} (${formatDistanceToNow(new Date(stack.createdAt))} ago)`}
            />
            <DetailRow
              label="Last Updated"
              value={`${format(new Date(stack.updatedAt), "PPp")} (${formatDistanceToNow(new Date(stack.updatedAt))} ago)`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  copyable,
  external,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  external?: boolean;
}) {
  const content = (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="flex items-center gap-2">
        <span className="break-all font-mono text-foreground text-sm">
          {value}
        </span>
        {copyable && <Copy className="h-3 w-3 shrink-0 opacity-50" />}
        {external && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );

  if (copyable) {
    return (
      <ClickToCopy text={value}>
        <div className="-m-2 cursor-pointer rounded-md p-2 hover:bg-accent/50">
          {content}
        </div>
      </ClickToCopy>
    );
  }

  return <div className="-m-2 p-2">{content}</div>;
}
