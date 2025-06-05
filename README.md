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

## Running locally

```bash
docker build -t ethui-stacks .

docker run -v $HOME/.config/ethui/stacks/local:$HOME/.config/ethui/stacks/local -e DATA_ROOT=$HOME/.config/ethui/stacks/local -v /var/run/docker.sock:/var/run/docker.sock --init -p 4000:4000 --name=ethui-stacks ethui-stacks
```

## Running hosted service

> [!WARNING]
> Soon available at https://stacks.ethui.dev

## How to use

### 1. Create a new stack

```bash
curl -X POST -d '{"slug": "foo"}' http://api.local.ethui.dev:4000/stacks
```

### 2. Access individual services via their subdomain:

- **http://foo.local.ethui.dev** (anvil node)
- **http://graph.foo.local.ethui.dev** (subgraph queries)
- **http://graph-rpc.foo.local.ethui.dev** (subgraph RPC client)
- **http://ipfs.foo.local.ethui.dev** (IPFS)
- **http://foo.local.ethui.dev** (explorer)
