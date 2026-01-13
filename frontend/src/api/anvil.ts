import axios from "axios";
import * as chains from "viem/chains";
import { z } from "zod";

export const anvilNodeInfoSchema = z.object({
  currentBlockNumber: z.string(),
  currentBlockTimestamp: z.number(),
  currentBlockHash: z.string(),
  hardFork: z.string(),
  transactionOrder: z.string(),
  environment: z.object({
    baseFee: z.string(),
    chainId: z.number(),
    gasLimit: z.string(),
    gasPrice: z.string(),
  }),
  forkConfig: z
    .object({
      forkUrl: z.string(),
      forkBlockNumber: z.number(),
      forkRetryBackoff: z.number(),
    })
    .nullable(),
});

export type AnvilNodeInfo = z.infer<typeof anvilNodeInfoSchema>;

async function jsonRpcCall<T>(
  rpcUrl: string,
  method: string,
  params: unknown[] = [],
): Promise<T> {
  const { data } = await axios.post(rpcUrl, {
    jsonrpc: "2.0",
    method,
    params,
    id: 1,
  });

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result;
}

export const anvil = {
  getNodeInfo: async (rpcUrl: string): Promise<AnvilNodeInfo> => {
    const result = await jsonRpcCall<unknown>(rpcUrl, "anvil_nodeInfo");
    return anvilNodeInfoSchema.parse(result);
  },

  getChainId: async (rpcUrl: string): Promise<number> => {
    const result = await jsonRpcCall<string>(rpcUrl, "eth_chainId");
    return Number.parseInt(result, 16);
  },
};

const allChains = Object.values(chains);

export function getChainName(chainId: number): string {
  const chain = allChains.find((c) => c.id === chainId);
  return chain?.name ?? `Chain ${chainId}`;
}
