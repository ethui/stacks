#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import type { Address, Hash } from "viem";
import { loadConfig } from "./config.js";
import { StacksClient } from "./stacks.js";
import { explorerLinks } from "./explorer.js";
import { getAddress, getBlock, getLogs, getTransaction, jsonSafe } from "./chain.js";

function text(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

const cfg = loadConfig();
const stacks = new StacksClient(cfg);

const server = new McpServer({ name: "ethui-stacks-mcp", version: "0.0.0" });

server.tool(
  "create_stack",
  "Fork any chain into a fresh disposable anvil sandbox. Returns rpc url + explorer link. Use fork_url + fork_block_number to fork mainnet at a block.",
  {
    slug: z.string().optional().describe("Optional stack name; auto-generated if omitted"),
    fork_url: z.string().optional().describe("RPC url to fork from (e.g. mainnet)"),
    fork_block_number: z.number().int().optional().describe("Block to fork at"),
  },
  async (args) => {
    const stack = await stacks.createStack(args);
    const links = explorerLinks(cfg, stack.urls.http_rpc);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              slug: stack.slug,
              status: stack.status,
              rpc: stack.urls.http_rpc,
              ws: stack.urls.ws_rpc,
              explorer: links.root,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.tool("list_stacks", "List running stacks with their rpc + explorer urls.", {}, async () => {
  const list = await stacks.listStacks();
  const rows = list.map((s) => ({
    slug: s.slug,
    status: s.status,
    rpc: s.urls?.http_rpc,
    explorer: s.urls?.http_rpc ? explorerLinks(cfg, s.urls.http_rpc).root : undefined,
  }));
  return { content: [{ type: "text", text: JSON.stringify(rows, null, 2) }] };
});

server.tool(
  "delete_stack",
  "Tear down a stack by slug.",
  { slug: z.string().describe("Stack slug to destroy") },
  async ({ slug }) => {
    await stacks.deleteStack(slug);
    return { content: [{ type: "text", text: `Deleted stack ${slug}` }] };
  },
);

server.tool(
  "get_block",
  "Get a block on a stack. Returns block data + explorer link.",
  {
    slug: z.string().describe("Stack slug"),
    block: z
      .union([z.number().int(), z.literal("latest")])
      .default("latest")
      .describe("Block number, or 'latest'"),
  },
  async ({ slug, block }) => {
    const rpc = await stacks.rpcFor(slug);
    const b = await getBlock(rpc, block === "latest" ? "latest" : BigInt(block));
    const links = explorerLinks(cfg, rpc);
    return text({ block: jsonSafe(b), explorer: links.block(b.number?.toString() ?? "latest") });
  },
);

server.tool(
  "get_transaction",
  "Get a transaction and its receipt on a stack. Returns data + explorer link.",
  { slug: z.string().describe("Stack slug"), hash: z.string().describe("Tx hash") },
  async ({ slug, hash }) => {
    const rpc = await stacks.rpcFor(slug);
    const result = await getTransaction(rpc, hash as Hash);
    const links = explorerLinks(cfg, rpc);
    return text({ ...jsonSafe(result), explorer: links.tx(hash) });
  },
);

server.tool(
  "get_address",
  "Get balance, nonce, and code for an address on a stack. Returns data + explorer link.",
  { slug: z.string().describe("Stack slug"), address: z.string().describe("Address") },
  async ({ slug, address }) => {
    const rpc = await stacks.rpcFor(slug);
    const info = await getAddress(rpc, address as Address);
    const links = explorerLinks(cfg, rpc);
    return text({ ...jsonSafe(info), explorer: links.address(address) });
  },
);

server.tool(
  "get_logs",
  "Fetch event logs on a stack, optionally filtered by address and block range.",
  {
    slug: z.string().describe("Stack slug"),
    address: z.string().optional().describe("Filter by contract address"),
    fromBlock: z.number().int().optional().describe("Start block"),
    toBlock: z.number().int().optional().describe("End block"),
  },
  async ({ slug, address, fromBlock, toBlock }) => {
    const rpc = await stacks.rpcFor(slug);
    const logs = await getLogs(rpc, {
      address: address as Address | undefined,
      fromBlock: fromBlock != null ? BigInt(fromBlock) : undefined,
      toBlock: toBlock != null ? BigInt(toBlock) : undefined,
    });
    return text({ count: logs.length, logs: jsonSafe(logs) });
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
