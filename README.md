# Ethui Stacks

A self-hosted, open-source API for web3 stacks.

> [!WARNING]
> This repo is freshly published. Maintenance is ongoing, and bugs are expected.

ethui Stacks can be used either locally or remotely, to provide teams with a full-features tech stack for web3 development:

- anvil node
- subgraph deployment
- IPFS
- explorer

Use it to:

- avoid the boilerplate of setting up full-stack development for web3 projects
- set up a private or public testnet for your projects
- create a shared environment without all the hassles fo public testnets

## Project Structure

This monorepo contains:

- **`server/`** - Elixir/Phoenix API server
- **`frontend/`** - React/TypeScript frontend application
- **`bruno/`** - API testing collection

## Running locally

### Server (API)

```bash
cd server
mix setup              # Install dependencies
mix ecto.create        # Create database
mix ecto.migrate       # Run migrations
mix phx.server         # Start server
```

Or use the setup script:
```bash
npm run setup          # Install deps + setup database
npm run dev:server     # Start server
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Docker (Full Stack)

```bash
docker build -t ethui-stacks .

docker run -v $HOME/.config/ethui/stacks/local:$HOME/.config/ethui/stacks/local -e DATA_ROOT=$HOME/.config/ethui/stacks/local -v /var/run/docker.sock:/var/run/docker.sock --init -p 4000:4000 --name=ethui-stacks ethui-stacks
```

## Running hosted service

> [!WARNING]
> Soon available at <https://stacks.ethui.dev>

## How to use

### 1. Create a new stack

```bash
curl -X POST -d '{"slug": "foo"}' http://api.local.ethui.dev:4000/stacks
```

### 2. Access individual services via their subdomain

- **<http://foo.local.ethui.dev>** (anvil node)
- **<http://graph-foo.local.ethui.dev>** (subgraph queries)
- **<http://graph-rpc-foo.local.ethui.dev>** (subgraph RPC client)
- **<http://ipfs-foo.local.ethui.dev>** (IPFS)
- **<http://foo.local.ethui.dev>** (explorer)

## MCP

The server speaks [MCP](https://modelcontextprotocol.io) over streamable HTTP at
`/mcp` on the api host, so an agent can provision sandboxes, drive them and hand
back explorer links a human can open.

Authentication is the same 7-day JWT as the REST api:

```bash
curl -X POST https://api.stacks.ethui.dev/auth/send-code -d '{"email":"you@example.com"}'
curl -X POST https://api.stacks.ethui.dev/auth/verify-code -d '{"email":"you@example.com","code":"123456"}'
```

```json
{
  "mcpServers": {
    "ethui-stacks": {
      "type": "http",
      "url": "https://api.stacks.ethui.dev/mcp",
      "headers": { "Authorization": "Bearer <jwt>" }
    }
  }
}
```

Tools:

- lifecycle: `create_stack` `list_stacks` `delete_stack`
- reads: `get_block` `get_transaction` `get_address` `get_logs`
- writes: `simulate_call` `execute` — raw calldata, `from` is impersonated so no key is needed
- cheatcodes: `impersonate` `set_balance` `mine` `set_block_timestamp` `snapshot` `revert`

ABI encoding and decoding are deliberately out of scope: calldata goes in raw, so
the caller stays free to use `cast`, viem, or whatever it already has.
