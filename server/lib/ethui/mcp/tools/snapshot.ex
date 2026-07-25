defmodule Ethui.MCP.Tools.Snapshot do
  @moduledoc "Snapshots the sandbox state. Pass the returned id to `revert` to roll back"

  use Ethui.MCP.Tool

  schema do
    field(:slug, :string, required: true)
  end

  @impl true
  def execute(%{slug: slug}, frame) do
    with_stack(frame, slug, fn stack ->
      with {:ok, id} <- rpc(stack, "evm_snapshot") do
        {:ok, %{snapshot_id: id}}
      end
    end)
  end
end
