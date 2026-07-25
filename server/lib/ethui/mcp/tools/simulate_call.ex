defmodule Ethui.MCP.Tools.SimulateCall do
  @moduledoc """
  Runs an eth_call against a stack without committing state. Takes raw
  calldata — encode it with the contract ABI before calling.
  """

  use Ethui.MCP.Tool

  schema do
    field(:slug, :string, required: true)
    field(:to, :string, required: true, description: "Target contract address")
    field(:data, :string, required: true, description: "0x-prefixed calldata")
    field(:from, :string, description: "Sender address. Any address, no key needed")

    field(:value, :string,
      default: "0",
      description: "Wei to send, decimal or hex. Defaults to 0"
    )

    field(:block, :string,
      default: "latest",
      description: "Block number or tag to call at. Defaults to latest"
    )
  end

  @impl true
  def execute(%{slug: slug} = params, frame) do
    with_stack(frame, slug, fn stack ->
      with {:ok, value} <- quantity(params.value),
           {:ok, result} <-
             rpc(stack, "eth_call", [tx(params, value), Chain.block_param(params.block)]) do
        {:ok, %{result: result}}
      end
    end)
  end

  defp tx(params, value) do
    %{"to" => params.to, "data" => params.data, "from" => params[:from], "value" => value}
    |> Enum.reject(fn {_k, v} -> is_nil(v) end)
    |> Map.new()
  end
end
