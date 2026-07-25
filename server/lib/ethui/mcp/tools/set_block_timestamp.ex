defmodule Ethui.MCP.Tools.SetBlockTimestamp do
  @moduledoc """
  Sets the timestamp of the next block, and mines it by default so the new time
  takes effect immediately.
  """

  use Ethui.MCP.Tool

  schema do
    field(:slug, :string, required: true)
    field(:timestamp, :integer, required: true, description: "Unix timestamp in seconds")

    field(:mine, :boolean,
      default: true,
      description: "Mine a block right after setting it. Defaults to true"
    )
  end

  @impl true
  def execute(%{slug: slug, timestamp: timestamp, mine: mine}, frame) do
    with_stack(frame, slug, fn stack ->
      with {:ok, _} <- rpc(stack, "evm_setNextBlockTimestamp", [timestamp]),
           {:ok, _} <- maybe_mine(stack, mine) do
        {:ok, %{timestamp: timestamp, mined: mine}}
      end
    end)
  end

  defp maybe_mine(_stack, false), do: {:ok, nil}
  defp maybe_mine(stack, true), do: rpc(stack, "anvil_mine", [Chain.hex(1)])
end
