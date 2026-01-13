import type { Stack } from "~/api/stacks";

export interface LiveInfo {
  latestBlockNumber?: number;
  latestBlockTimestamp?: number;
  latestTxHash?: string;
  txStatusSuccess?: boolean;
}

export interface AnvilInfo {
  forkConfig?: {
    forkBlockNumber?: number;
  } | null;
}

export interface StackCardDataProps {
  stack: Stack;
  liveInfo: LiveInfo;
  anvilInfo: AnvilInfo | null | undefined;
  forkChainId?: number;
}
