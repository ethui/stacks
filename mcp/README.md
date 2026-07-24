# @ethui/stacks-mcp

MCP server for [ethui Stacks](../). Lets an agent provision disposable forked
anvil sandboxes, inspect the chain, simulate & execute calls, and drive anvil
cheatcodes — with every result deep-linked into the ethui explorer for a human
to verify.

## Why

Stacks spins up forked anvil environments on demand. This MCP gives an agent the
full loop: **provision → experiment → verify → tear down**. The human watches in
the explorer; the agent does the work.

## Config

Runs over stdio. Point it at hosted Stacks (default) or a local instance.

| Env | Default | Notes |
| --- | --- | --- |
| `STACKS_API` | `https://api.stacks.ethui.dev` | Stacks REST base |
| `STACKS_TOKEN` | — | JWT for `/stacks` CRUD (7-day). Omit against a no-auth local instance |
| `EXPLORER_BASE` | `https://explorer.ethui.dev` | Explorer for deep links |
| `FOUNDRY_OUT` | — | Path to a foundry `out/` dir for ABI decoding |

### Getting a token (hosted)

```
curl -X POST https://api.stacks.ethui.dev/auth/send-code -d '{"email":"you@x.com"}'
curl -X POST https://api.stacks.ethui.dev/auth/verify-code -d '{"email":"you@x.com","code":"123456"}'
# -> { "token": "<jwt>" }  (valid 7 days)
```

## Claude Desktop / Claude Code

```json
{
  "mcpServers": {
    "ethui-stacks": {
      "command": "node",
      "args": ["/absolute/path/to/stacks/mcp/dist/index.js"],
      "env": {
        "STACKS_TOKEN": "<jwt>",
        "FOUNDRY_OUT": "/path/to/your/foundry/out"
      }
    }
  }
}
```

## Build

```
pnpm --filter @ethui/stacks-mcp build
```

## Tools

- `create_stack` / `list_stacks` / `delete_stack` — sandbox lifecycle
- _(next)_ `get_block` / `get_transaction` / `get_address` / `get_logs` — read + explorer links
- _(next)_ `simulate_call` / `execute` — run the experiment
- _(next)_ cheatcodes: `impersonate` / `set_balance` / `mine` / `set_block_timestamp` / `snapshot` / `revert`
- _(next)_ `decode` — foundry ABI decoding
