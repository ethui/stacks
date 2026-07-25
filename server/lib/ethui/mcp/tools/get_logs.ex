defmodule Ethui.MCP.Tools.GetLogs do
  @moduledoc """
  Queries event logs on a stack. Topics are raw 32-byte hex values — hash the
  event signature yourself (topic0) to filter by event.
  """

  use Ethui.MCP.Tool

  alias Ethui.Stacks.Stack

  schema do
    field(:slug, :string, required: true)
    field(:address, :string, description: "Contract address to filter by")

    field(:from_block, :string,
      description:
        "Defaults to earliest, or to the fork block on a forked stack, where scanning further back queries the upstream chain"
    )

    field(:to_block, :string, default: "latest", description: "Defaults to latest")
    field(:topics, {:list, :string}, description: "Topic filters, topic0 first")
  end

  @impl true
  def execute(%{slug: slug} = params, frame) do
    with_stack(frame, slug, fn stack ->
      with {:ok, logs} <- rpc(stack, "eth_getLogs", [filter(params, stack)]) do
        {:ok, %{count: length(logs), logs: logs, explorer: Explorer.root(stack)}}
      end
    end)
  end

  defp filter(params, stack) do
    %{
      "fromBlock" => Chain.block_param(params[:from_block] || from_block(stack)),
      "toBlock" => Chain.block_param(params.to_block),
      "address" => params[:address],
      "topics" => params[:topics]
    }
    |> Enum.reject(fn {_k, v} -> is_nil(v) end)
    |> Map.new()
  end

  defp from_block(%Stack{anvil_opts: %{"fork_block_number" => block}}), do: to_string(block)
  defp from_block(%Stack{anvil_opts: %{"fork_url" => _}}), do: "latest"
  defp from_block(_stack), do: "earliest"
end
