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
  const config = useMemo(
    () =>
      createConfig({
        chains: [
          {
            id: stack.chain_id,
            name: stack.slug,
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: {
              default: { http: [stack.rpc_url], ws: [stack.ws_rpc] },
            },
          },
        ],
        transports: {
          [stack.chain_id]: webSocket(stack.ws_rpc),
        },
      }),
    [stack.chain_id, stack.rpc_url, stack.slug],
  );

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
    config,
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
    config,
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
