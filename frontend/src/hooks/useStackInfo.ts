import { useMemo, useState } from "react";
import type { Address, Hash } from "viem";
import {
  createConfig,
  http,
  useTransactionReceipt,
  useWatchBlocks,
  webSocket,
} from "wagmi";
import { Stack } from "~/api/stacks";
import { useAnvilNodeInfo, useForkChainId } from "./useAnvil";

export interface LatestTransaction {
  hash: Hash;
  success: boolean;
  timestamp: number;
}

export function useStackInfo(stack: Stack) {
  const [latestStackInfo, setLatestStackInfo] = useState<
    | {
        latestBlockNumber: number;
        latestBlockTimestamp: number;
        latestTxHash: Hash;
      }
    | undefined
  >();

  const { data: anvilInfo } = useAnvilNodeInfo(stack.slug, stack.rpc_url);
  const { data: forkChainId } = useForkChainId(
    stack.slug,
    stack.anvil_opts?.fork_url,
  );

  useWatchBlocks({
    includeTransactions: true,
    emitOnBegin: true,
    onBlock(block) {
      if (latestStackInfo?.latestBlockNumber === Number(block.number)) return;
      const tx = block.transactions[block.transactions.length - 1];
      setLatestStackInfo((prev) => ({
        latestTxHash: tx?.hash ?? prev?.latestTxHash,
        latestBlockNumber: Number(block.number),
        latestBlockTimestamp: Number(block.timestamp),
      }));
    },
  });

  const { data: receipt } = useTransactionReceipt({
    hash: latestStackInfo?.latestTxHash,
  });

  return {
    data: {
      liveInfo: {
        ...latestStackInfo,
        txStatusSuccess: receipt?.status === "success",
      },
      anvilInfo,
      forkChainId,
    },
  };
}
