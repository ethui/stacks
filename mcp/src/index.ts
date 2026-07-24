#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import type { Address, Hash, Hex } from "viem";
import { loadConfig } from "./config.js";
import { StacksClient } from "./stacks.js";
import { explorerLinks } from "./explorer.js";
import {
  anvil,
  deployContract,
  execute,
  executeAs,
  getAddress,
  getBlock,
  getLogs,
  getTransaction,
  jsonSafe,
  simulateCall,
} from "./chain.js";
import { decodeCalldata, decodeLogs, getArtifact } from "./abi.js";

function toWeiHex(decimal: string): Hex {
  return `0x${BigInt(decimal).toString(16)}`;
}

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
    const decoded = cfg.foundryOut
      ? {
          call: decodeCalldata(cfg.foundryOut, result.tx.input),
          events: result.receipt ? decodeLogs(cfg.foundryOut, result.receipt.logs) : [],
        }
      : undefined;
    return text({ ...jsonSafe(result), decoded: jsonSafe(decoded), explorer: links.tx(hash) });
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

server.tool(
  "simulate_call",
  "Dry-run a call on a stack (eth_call, no state change). Returns return data.",
  {
    slug: z.string().describe("Stack slug"),
    to: z.string().describe("Target contract address"),
    data: z.string().optional().describe("Calldata hex (0x...)"),
    value: z.string().optional().describe("Wei value as decimal string"),
    from: z.string().optional().describe("Caller address (defaults to node)"),
  },
  async ({ slug, to, data, value, from }) => {
    const rpc = await stacks.rpcFor(slug);
    const result = await simulateCall(rpc, {
      to: to as Address,
      data: data as Hex | undefined,
      value: value != null ? BigInt(value) : undefined,
      from: from as Address | undefined,
    });
    return text(result);
  },
);

server.tool(
  "execute",
  "Send a transaction on a stack and wait for the receipt. Signs with PRIVATE_KEY or anvil account 0 by default. Pass 'from' to send as any address via impersonation (no key needed). Returns hash, receipt + explorer link.",
  {
    slug: z.string().describe("Stack slug"),
    to: z.string().describe("Target address"),
    data: z.string().optional().describe("Calldata hex (0x...)"),
    value: z.string().optional().describe("Wei value as decimal string"),
    from: z.string().optional().describe("Impersonate this sender (no key needed)"),
  },
  async ({ slug, to, data, value, from }) => {
    const rpc = await stacks.rpcFor(slug);
    const params = {
      to: to as Address,
      data: data as Hex | undefined,
      value: value != null ? BigInt(value) : undefined,
    };
    const result = from
      ? await executeAs(rpc, from as Address, params)
      : await execute(rpc, params, cfg.privateKey);
    const links = explorerLinks(cfg, rpc);
    return text({ ...jsonSafe(result), explorer: links.tx(result.hash) });
  },
);

server.tool(
  "deploy_contract",
  "Deploy a compiled contract from the foundry out/ dir to a stack. Returns address + explorer link.",
  {
    slug: z.string().describe("Stack slug"),
    contract: z.string().describe("Contract name, e.g. 'Counter'"),
    args: z.array(z.any()).optional().describe("Constructor args"),
  },
  async ({ slug, contract, args }) => {
    if (!cfg.foundryOut) throw new Error("FOUNDRY_OUT not set");
    const artifact = getArtifact(cfg.foundryOut, contract);
    if (!artifact.bytecode || artifact.bytecode === "0x")
      throw new Error(`${contract} has no bytecode (interface or abstract?)`);
    const rpc = await stacks.rpcFor(slug);
    const result = await deployContract(
      rpc,
      artifact.abi,
      artifact.bytecode,
      args ?? [],
      cfg.privateKey,
    );
    const links = explorerLinks(cfg, rpc);
    return text({
      contract,
      address: result.address,
      txHash: result.hash,
      explorer: result.address ? links.address(result.address) : links.tx(result.hash),
    });
  },
);

const cheat = (
  name: string,
  description: string,
  shape: z.ZodRawShape,
  build: (a: Record<string, string | undefined>) => { method: string; params: unknown[] },
) =>
  server.tool(name, description, { slug: z.string().describe("Stack slug"), ...shape }, async (a) => {
    const rpc = await stacks.rpcFor(a.slug as string);
    const { method, params } = build(a as Record<string, string | undefined>);
    const result = await anvil(rpc, method, params);
    return text({ method, result: jsonSafe(result) ?? "ok" });
  });

cheat(
  "impersonate",
  "Impersonate an address so subsequent txs can be sent as it (whale testing).",
  { address: z.string().describe("Address to impersonate") },
  (a) => ({ method: "anvil_impersonateAccount", params: [a.address] }),
);

cheat(
  "set_balance",
  "Set an address's native balance.",
  { address: z.string().describe("Address"), wei: z.string().describe("Balance in wei (decimal)") },
  (a) => ({ method: "anvil_setBalance", params: [a.address, toWeiHex(a.wei!)] }),
);

cheat(
  "mine",
  "Mine blocks immediately.",
  { blocks: z.string().optional().describe("How many (default 1)") },
  (a) => ({ method: "anvil_mine", params: [`0x${BigInt(a.blocks ?? "1").toString(16)}`] }),
);

cheat(
  "set_block_timestamp",
  "Set the timestamp of the next block (unix seconds).",
  { timestamp: z.string().describe("Unix seconds") },
  (a) => ({ method: "evm_setNextBlockTimestamp", params: [Number(a.timestamp)] }),
);

cheat(
  "snapshot",
  "Snapshot current chain state; returns an id to revert to.",
  {},
  () => ({ method: "evm_snapshot", params: [] }),
);

cheat(
  "revert",
  "Revert chain state to a snapshot id.",
  { id: z.string().describe("Snapshot id from snapshot") },
  (a) => ({ method: "evm_revert", params: [a.id] }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
