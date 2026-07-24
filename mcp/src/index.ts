#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadConfig } from "./config.js";
import { StacksClient } from "./stacks.js";
import { explorerLinks } from "./explorer.js";

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

const transport = new StdioServerTransport();
await server.connect(transport);
