import { CardContent } from "@ethui/ui/components/shadcn/card";
import { cn } from "@ethui/ui/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";
import { Input } from "@ethui/ui/components/shadcn/input";
import type { Stack } from "~/api/stacks";
import { ClickToCopy } from "~/components/ClickToCopy";
import { ChainStateSection } from "./ChainStateSection";
import type { StackCardDataProps } from "./types";
import { explorerUrl } from "~/utils/global";

interface StackCardContentProps extends StackCardDataProps {}

export function StackCardContent({
  stack,
  liveInfo,
  anvilInfo,
  forkChainId,
}: StackCardContentProps) {
  return (
    <CardContent className="flex h-full flex-col space-y-4">
      <div className="flex flex-col gap-1.5">
        <ChainStateSection
          stack={stack}
          liveInfo={liveInfo}
          anvilInfo={anvilInfo}
          forkChainId={forkChainId}
        />
      </div>

      <UrlList stack={stack} />

      <div className="flex-1" />
      <StackCardFooter stack={stack} />
    </CardContent>
  );
}

function UrlList({ stack }: { stack: Stack }) {
  return (
    <div className="space-y-2">
      <UrlRow label="RPC" url={stack.rpc_url} />
      {/* TODO: Use the actual explorer URL */}
      <UrlRow label="Explorer" url={explorerUrl(stack.rpc_url)} isExternal />

      {stack.graph_url && (
        <UrlRow label="Subgraph" url={stack.graph_url} isExternal />
      )}
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
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="flex items-center gap-1">
        <Input
          type="text"
          readOnly
          value={url}
          className="h-8 flex-1 truncate font-mono text-xs"
        />
        <ClickToCopy
          text={url}
          className="shrink-0 rounded border border-border bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
        />
        {isExternal && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded border border-border bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            title={`Open ${label}`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

interface StackCardFooterProps {
  stack: Stack;
}

function StackCardFooter({ stack }: StackCardFooterProps) {
  const isStackRunning = stack.status === "running";
  return (
    <div className="flex items-center justify-between border-border border-t pt-3">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium text-xs",
          "before:h-1.5 before:w-1.5 before:animate-pulse before:rounded-full",
          isStackRunning
            ? "bg-green-500/10 text-green-600 before:bg-green-500"
            : "bg-red-500/10 text-red-600 before:bg-red-500",
        )}
      >
        {isStackRunning ? "Running" : "Stopped"}
      </span>
      <span className="text-muted-foreground text-xs">
        {formatDistanceToNow(new Date(stack.inserted_at * 1000))} ago
      </span>
    </div>
  );
}
