defmodule Ethui.MCP.StackInfo do
  @moduledoc "Stack payload returned by the lifecycle tools"

  alias Ethui.MCP.Explorer
  alias Ethui.Stacks
  alias Ethui.Stacks.Server
  alias Ethui.Stacks.Stack

  @type t :: %{
          slug: String.t(),
          status: String.t(),
          chain_id: non_neg_integer,
          http_rpc: String.t(),
          ws_rpc: String.t(),
          explorer: String.t(),
          anvil_opts: map
        }

  @spec describe(Stack.t()) :: t
  def describe(stack), do: describe(stack, Server.list())

  @spec describe(Stack.t(), [String.t()]) :: t
  def describe(%Stack{} = stack, running_slugs) do
    %{
      slug: stack.slug,
      status: if(stack.slug in running_slugs, do: "running", else: "stopped"),
      chain_id: Stacks.chain_id(stack.id),
      http_rpc: Stacks.http_rpc_url(stack),
      ws_rpc: Stacks.ws_rpc_url(stack),
      explorer: Explorer.root(stack),
      anvil_opts: stack.anvil_opts
    }
  end
end
