defmodule Ethui.MCP.Tools.GetLogs do
  @moduledoc """
  Queries event logs on a stack. Topics are raw 32-byte hex values — hash the
  event signature yourself (topic0) to filter by event.
  """

  use Ethui.MCP.Tool

  schema do
    field(:slug, :string, required: true)
    field(:address, :string, description: "Contract address to filter by")
    field(:from_block, :string, default: "earliest", description: "Defaults to earliest")
    field(:to_block, :string, default: "latest", description: "Defaults to latest")
    field(:topics, {:list, :string}, description: "Topic filters, topic0 first")
  end

  @impl true
  def execute(%{slug: slug} = params, frame) do
    with_stack(frame, slug, fn stack ->
      with {:ok, logs} <- rpc(stack, "eth_getLogs", [filter(params)]) do
        {:ok, %{count: length(logs), logs: logs, explorer: Explorer.root(stack)}}
      end
    end)
  end

  defp filter(params) do
    %{
      "fromBlock" => Chain.block_param(params.from_block),
      "toBlock" => Chain.block_param(params.to_block),
      "address" => params[:address],
      "topics" => params[:topics]
    }
    |> Enum.reject(fn {_k, v} -> is_nil(v) end)
    |> Map.new()
  end
end
