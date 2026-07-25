defmodule Ethui.MCP.Tools.GetBlock do
  @moduledoc "Reads a block from a stack, with an explorer link to it"

  use Ethui.MCP.Tool

  schema do
    field(:slug, :string, required: true)

    field(:block, :string,
      default: "latest",
      description:
        "Block number (decimal or hex) or latest/earliest/pending/safe/finalized. Defaults to latest"
    )

    field(:full_transactions, :boolean,
      default: false,
      description: "Include full transaction objects instead of hashes. Defaults to false"
    )
  end

  @impl true
  def execute(%{slug: slug, block: block, full_transactions: full}, frame) do
    with_stack(frame, slug, fn stack ->
      case rpc(stack, "eth_getBlockByNumber", [Chain.block_param(block), full]) do
        {:ok, nil} ->
          {:error, "block not found: #{block}"}

        {:ok, result} ->
          {:ok, Map.put(result, "explorer", Explorer.block(stack, result["number"]))}

        error ->
          error
      end
    end)
  end
end
