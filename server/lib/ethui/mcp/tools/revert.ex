defmodule Ethui.MCP.Tools.Revert do
  @moduledoc """
  Rolls the sandbox back to a snapshot. Snapshots are consumed on revert and
  anything taken after them is discarded.
  """

  use Ethui.MCP.Tool

  schema do
    field(:slug, :string, required: true)
    field(:snapshot_id, :string, required: true, description: "Id returned by `snapshot`")
  end

  @impl true
  def execute(%{slug: slug, snapshot_id: id}, frame) do
    with_stack(frame, slug, fn stack ->
      case rpc(stack, "evm_revert", [id]) do
        {:ok, true} -> {:ok, %{reverted: true, snapshot_id: id}}
        {:ok, false} -> {:error, "unknown or already consumed snapshot: #{id}"}
        error -> error
      end
    end)
  end
end
