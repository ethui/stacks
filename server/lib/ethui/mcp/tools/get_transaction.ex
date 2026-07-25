defmodule Ethui.MCP.Tools.GetTransaction do
  @moduledoc """
  Reads a transaction and its receipt (status, gas, logs) from a stack, with an
  explorer link. Calldata and logs are returned raw — decode them with the ABI.
  """

  use Ethui.MCP.Tool

  schema do
    field(:slug, :string, required: true)
    field(:hash, :string, required: true, description: "Transaction hash")
  end

  @impl true
  def execute(%{slug: slug, hash: hash}, frame) do
    with_stack(frame, slug, fn stack ->
      with {:ok, tx} <- rpc(stack, "eth_getTransactionByHash", [hash]),
           {:ok, receipt} <- receipt(stack, tx, hash) do
        {:ok, %{transaction: tx, receipt: receipt, explorer: Explorer.tx(stack, hash)}}
      end
    end)
  end

  defp receipt(_stack, nil, hash), do: {:error, "transaction not found: #{hash}"}
  defp receipt(stack, _tx, hash), do: rpc(stack, "eth_getTransactionReceipt", [hash])
end
