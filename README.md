# Ethui Stacks

> [!WARNING]
> This is an experimental repo, not yet production ready.

An API for managing multiple web3 stacks (anvil, subgraph, etc) for internal and external testing.

## Running locally

```bash
docker build -t ethui-stacks .

docker run -v $HOME/.config/ethui/stacks/local:$HOME/.config/ethui/stacks/local -e DATA_ROOT:$HOME/.config/ethui/stacks/local -v /var/run/docker.sock:/var/run/docker.sock --init -p 4000:4000 --name=ethui-stacks ethui-stacks
```
