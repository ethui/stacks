import type { CreateStackInput, Stack } from "~/types/stack";

// Mock data for development
const mockStacks: Stack[] = [
  {
    id: "1",
    slug: "dev-mainnet",
    chainId: 31337,
    rpcUrl: "https://dev-mainnet.stacks.ethui.dev",
    explorerUrl: "https://dev-mainnet.explorer.ethui.dev",
    ipfsUrl: "https://ipfs-dev-mainnet.stacks.ethui.dev",
    graphUrl: "https://graph-dev-mainnet.stacks.ethui.dev",
    graphRpcUrl: "https://graph-rpc-dev-mainnet.stacks.ethui.dev",
    graphEnabled: true,
    anvilOpts: {
      forkUrl: "https://eth.llamarpc.com",
      forkBlockNumber: 19000000,
    },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    slug: "testing-env",
    chainId: 31338,
    rpcUrl: "https://testing-env.stacks.ethui.dev",
    explorerUrl: "https://testing-env.explorer.ethui.dev",
    graphEnabled: false,
    anvilOpts: {},
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    slug: "arbitrum-fork",
    chainId: 31339,
    rpcUrl: "https://arbitrum-fork.stacks.ethui.dev",
    explorerUrl: "https://arbitrum-fork.explorer.ethui.dev",
    ipfsUrl: "https://ipfs-arbitrum-fork.stacks.ethui.dev",
    graphUrl: "https://graph-arbitrum-fork.stacks.ethui.dev",
    graphRpcUrl: "https://graph-rpc-arbitrum-fork.stacks.ethui.dev",
    graphEnabled: true,
    anvilOpts: {
      forkUrl: "https://arb1.arbitrum.io/rpc",
      forkBlockNumber: 180000000,
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchStacks(): Promise<Stack[]> {
  await delay(500);
  return [...mockStacks];
}

export async function fetchStack(slug: string): Promise<Stack | null> {
  await delay(300);
  return mockStacks.find((s) => s.slug === slug) || null;
}

export async function createStack(input: CreateStackInput): Promise<Stack> {
  await delay(800);

  const newStack: Stack = {
    id: String(mockStacks.length + 1),
    slug: input.slug,
    chainId: 31337 + mockStacks.length,
    rpcUrl: `https://${input.slug}.stacks.ethui.dev`,
    explorerUrl: `https://${input.slug}.explorer.ethui.dev`,
    ipfsUrl: input.graphOpts?.enabled
      ? `https://ipfs-${input.slug}.stacks.ethui.dev`
      : undefined,
    graphUrl: input.graphOpts?.enabled
      ? `https://graph-${input.slug}.stacks.ethui.dev`
      : undefined,
    graphRpcUrl: input.graphOpts?.enabled
      ? `https://graph-rpc-${input.slug}.stacks.ethui.dev`
      : undefined,
    graphEnabled: input.graphOpts?.enabled ?? false,
    anvilOpts: input.anvilOpts ?? {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockStacks.push(newStack);
  return newStack;
}

export async function deleteStack(slug: string): Promise<void> {
  await delay(500);
  const index = mockStacks.findIndex((s) => s.slug === slug);
  if (index !== -1) {
    mockStacks.splice(index, 1);
  }
}
