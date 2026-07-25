defmodule Ethui.MCP.Tools.DeleteStack do
  @moduledoc "Destroys a stack and everything on it. Irreversible"

  use Ethui.MCP.Tool

  alias Ethui.Stacks
  alias Ethui.Stacks.Server

  schema do
    field(:slug, :string, required: true, description: "Stack to delete")
  end

  @impl true
  def execute(%{slug: slug}, frame) do
    with_stack(frame, slug, fn stack ->
      Server.destroy(stack)

      case Stacks.delete_stack(stack) do
        {:ok, _stack} -> {:ok, %{slug: slug, deleted: true}}
        {:error, _changeset} -> {:error, "could not delete stack: #{slug}"}
      end
    end)
  end
end
