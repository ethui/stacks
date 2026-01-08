import { cn } from "@ethui/ui/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { GitFork, CircleCheckBig, CircleX } from "lucide-react";
import { getChainName } from "~/api/anvil";
import { ExternalLink as ExternalLinkText } from "~/components/ExternalLink";
import { minifyHash } from "~/utils/global";
import type { StackCardDataProps } from "./types";
import { explorerUrl } from "~/utils/global";

interface ChainStateSectionProps extends StackCardDataProps {}

export function ChainStateSection({
  stack,
  liveInfo,
  anvilInfo,
  forkChainId,
}: ChainStateSectionProps) {
  const {
    latestBlockNumber,
    latestBlockTimestamp,
    latestTxHash,
    txStatusSuccess,
  } = liveInfo;

  const forkConfig = anvilInfo?.forkConfig;
  const chainName = forkChainId ? getChainName(forkChainId) : undefined;
  const isFork = !!stack.anvil_opts?.fork_url;

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs">Forked from</span>
          {isFork ? (
            <div className="flex items-center gap-1.5">
              <GitFork className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-foreground text-xs">
                {chainName ?? "..."} @ {forkConfig?.forkBlockNumber ?? "..."}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs">Latest Block</span>
          <span className="font-mono text-foreground text-xs">
            {latestBlockNumber ? (
              <ExternalLinkText
                href={`${explorerUrl(stack.rpc_url)}/block/${latestBlockNumber}`}
                tooltip={latestTxHash}
              >
                {latestBlockNumber}
              </ExternalLinkText>
            ) : (
              <span className="text-muted-foreground text-xs">—</span>
            )}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs">Latest Tx</span>
          {!latestTxHash ? (
            <span className="text-muted-foreground text-xs">—</span>
          ) : (
            <div className="flex items-center gap-2">
              <ExternalLinkText
                href={`${explorerUrl(stack.rpc_url)}/tx/${latestTxHash}`}
                tooltip={latestTxHash}
              >
                {minifyHash(latestTxHash)}
              </ExternalLinkText>
              {txStatusSuccess ? (
                <CircleCheckBig className="h-4 w-4 text-green-500" />
              ) : (
                <CircleX className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs">Last Activity</span>
          {!latestBlockTimestamp ? (
            <span className="text-muted-foreground text-xs">—</span>
          ) : (
            <span className="text-foreground text-xs">
              {formatDistanceToNow(new Date(latestBlockTimestamp * 1000), {
                addSuffix: true,
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
