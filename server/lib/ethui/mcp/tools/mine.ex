defmodule Ethui.MCP.Tools.Mine do
  @moduledoc "Mines blocks on the sandbox, optionally spacing them in time"

  use Ethui.MCP.Tool

  schema do
    field(:slug, :string, required: true)

    field(:blocks, :integer,
      default: 1,
      min: 1,
      description: "How many blocks to mine. Defaults to 1"
    )

    field(:interval, :integer, min: 0, description: "Seconds between mined blocks")
  end

  @impl true
  def execute(%{slug: slug, blocks: blocks} = params, frame) do
    with_stack(frame, slug, fn stack ->
      args = [Chain.hex(blocks) | List.wrap(params[:interval] && Chain.hex(params[:interval]))]

      with {:ok, _} <- rpc(stack, "anvil_mine", args),
           {:ok, number} <- rpc(stack, "eth_blockNumber") do
        {:ok, %{mined: blocks, block_number: number, explorer: Explorer.block(stack, number)}}
      end
    end)
  end
end
