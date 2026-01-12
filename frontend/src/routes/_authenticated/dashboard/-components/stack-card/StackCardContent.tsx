import { CardContent } from "@ethui/ui/components/shadcn/card";
import { cn } from "@ethui/ui/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import { Input } from "@ethui/ui/components/shadcn/input";
import type { Stack } from "~/api/stacks";
import { ClickToCopy } from "~/components/ClickToCopy";
import { ChainStateSection } from "./ChainStateSection";
import type { StackCardDataProps } from "./types";
import { explorerUrl } from "~/utils/global";
import { ExternalLink } from "~/components/ExternalLink";

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
      <UrlRow label="HTTP RPC" url={stack.rpc_url} />
      <UrlRow label="WebSocket RPC" url={stack.ws_rpc} />
      {/* TODO: Use the actual explorer URL */}
      <UrlRow
        label="Explorer"
        url={explorerUrl(stack.ws_rpc)}
        externalLink={`${explorerUrl(stack.ws_rpc)}}`}
        externalLinkTooltip="View in Explorer"
      />

      {stack.graph_url && (
        <UrlRow
          label="Subgraph"
          url={stack.graph_url}
          externalLink={stack.graph_url}
          externalLinkTooltip="View in Subgraph dashboard"
        />
      )}
    </div>
  );
}

interface UrlRowProps {
  label: string;
  url: string;
  externalLink?: string;
  externalLinkTooltip?: string;
}

function UrlRow({
  label,
  url,
  externalLink,
  externalLinkTooltip,
}: UrlRowProps) {
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
        {externalLink && (
          <ExternalLink
            href={externalLink}
            tooltip={externalLinkTooltip}
            className="shrink-0 text-muted-foreground hover:text-foreground border rounded border-border bg-background p-2"
          >
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </ExternalLink>
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
