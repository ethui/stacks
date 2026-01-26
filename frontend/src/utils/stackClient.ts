import {
  createTestClient,
  defineChain,
  walletActions,
  webSocket as viemWebSocket,
} from "viem";
import { createConfig, webSocket } from "wagmi";
import type { Stack } from "~/api/stacks";

export function createStackChain(stack: Stack) {
  return defineChain({
    id: stack.chain_id,
    name: stack.slug,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [stack.rpc_url], webSocket: [stack.ws_rpc] } },
  });
}

export function createStackClient(stack: Stack) {
  return createTestClient({
    mode: "anvil",
    chain: createStackChain(stack),
    transport: viemWebSocket(stack.ws_rpc),
  }).extend(walletActions);
}

export function createStackConfig(stack: Stack) {
  const chain = createStackChain(stack);
  return createConfig({
    chains: [chain],
    transports: {
      [stack.chain_id]: webSocket(stack.ws_rpc),
    },
  });
}
